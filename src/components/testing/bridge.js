// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Studio.
//
// Superblocks Studio is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Studio is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Studio.  If not, see <http://www.gnu.org/licenses/>.

//
// NOTE: This is a set of data and operations for integrating
//       the GUI with testing functionalities
//

import TestRunner from "../testing/testrunner";
import { readReportSuccesses, readReportFailures, readTotalTestCount, readReportOutput, readReporterStatus } from "../testing/reporter";

class TestRunnerBridge {
    constructor() {
        this.testRunner = new TestRunner();

        //
        // Reference to Solc compiler
        this.compiler = null;

        //
        // Contracts data hash map
        this.contractsData = {};

        //
        // Currently selected account
        this.testAccountAddress = null;
        this.testAccountKey = null;

        //
        // Currently loaded test files
        this.testFiles = {};
        this.isLoadingTestFiles = false;

        // TODO: consider reading currently selected network address from "Select a Network"
        this.endpoint="http://superblocks-browser";

        this.testData = [];
        this.totalTestDataTime = 0;
        this.selectedTestId = null;
    }

    setCompiler(compiler) {
        this.compiler = compiler;
    }

    // Take project settings to extract hash map of contract names and their respective source code
    _setContractsData(project, wallet) {
        if(!this.compiler) {
            console.error("Unable to set testing contracts data. Compiler reads: ", this.compiler);
            return;
        }

        console.log("Preparing testing contracts data...");
        this.contractsData = {};

        const thisReference = this;
        const contractsPath = "/contracts";
        var contractSources = {}

        project.listFiles(contractsPath, function(status, list) {
            if(status === 0){
                // TODO: consider supporting sub-directories
                for(var i=0; i<list.length; i++) {
                    const file = list[i]
                    const fileName = file.name;
                    const fullPath = contractsPath + "/" + fileName;

                    const suffix = (fullPath.match('^.*/[^/]+[.](.+)$') || [])[1] || '';
                    const suffixLowerCase = suffix.toLowerCase();

                    //
                    // Read contracts only
                    if(file.type === "f" && suffixLowerCase == "sol") {
                        const key = fileName;
                        project.loadFile(fullPath, function(result){
                            if(result.status === 0) {
                                const value = result.contents;
                                contractSources[key] = value;

                                const input = {
                                    language: 'Solidity',
                                    sources: {},
                                    settings: {
                                        optimizer: {
                                            enabled: false,
                                            runs: 200,
                                        },
                                        evmVersion: 'byzantium',
                                        libraries: {},
                                        outputSelection: {
                                            '*': {
                                                '*': [
                                                    'metadata',
                                                    'evm.bytecode',
                                                    'evm.gasEstimates',
                                                ],
                                            },
                                        },
                                    },
                                };
                                input.sources[key] = { content: value };

                                // TODO: consider supporting other required files for compiling the aforementioned input (dependencies)
                                const files = {};

                                thisReference.compiler.queue({ input: JSON.stringify(input), files: files }, function(result) {
                                    const resultJson = JSON.parse(result);
                                    const contractFile = resultJson.contracts[fileName];

                                    for(var contract in contractFile) {
                                        const contractData = contractFile[contract];
                                        const abi = JSON.parse(contractData.metadata).output.abi;
                                        const bytecode = "0x" + contractData.evm.bytecode.object;

                                        thisReference.contractsData[contract] = {
                                            abi: abi,
                                            bin: bytecode
                                        };
                                    }
                                });
                            } else {
                                console.error("Error trying to load contract: " + fullPath);
                            }
                        });
                    }
                }
            } else {
                console.error("Error trying to read contracts path: " + contractsPath);
            }
        });

        console.log("Finished preparing contracts data: ", this.contractsData);
    }

    // Take project settings to extract hash map of contract names and their respective source code
    _setAccountsData(projectReference, walletReference) {
        if(!walletReference) {
            console.error("Unable to set testing accounts data. Wallet reads: ", walletReference);
            return;
        }

        console.log("Preparing testing accounts data...");

        const thisReference = this;

        //
        // Note: derived from contractinteraction::_getAccountAddress
        // Note: depends on asynchronous wallet load
        //
        // Check given account, try to open and get address
        const accountName = projectReference.getAccount();
        if (!accountName) {
            this.testAccountAddress=null;
            this.testAccountKey=null;
            setTimeout(() => thisReference._setAccountsData(projectReference, walletReference), 1000);
            return;
        }

        const env = projectReference.getEnvironment();
        const accounts = projectReference.getHiddenItem('accounts');
        const account = accounts.getByName(accountName);
        const accountIndex = account.getAccountIndex(env);
        const walletName = account.getWallet(env);
        const wallets = projectReference.getHiddenItem('wallets');
        const wallet = wallets.getByName(walletName);

        if (!wallet) {
            this.testAccountAddress=null;
            this.testAccountKey=null;
            setTimeout(() => thisReference._setAccountsData(projectReference, walletReference), 1000);
            return;
        }
        const walletType = wallet.getWalletType();

        if (walletType == 'external') {
            // Metamask seems to always only provide one (the chosen) account.
            var extAccounts = [];
            if (window.web3 && window.web3.eth)
                extAccounts = window.web3.eth.accounts || [];
            if (extAccounts.length < accountIndex + 1) {
                // Account not matched
                this.testAccountAddress=null;
                this.testAccountKey=null;
                setTimeout(() => thisReference._setAccountsData(projectReference, walletReference), 1000);
                return;
            }
            this.testAccountAddress=extAccounts[accountIndex];
        }

        if (walletReference.isOpen(walletName)) {
            this.testAccountAddress = walletReference.getAddress(walletName, accountIndex);
        } else {
            this.testAccountAddress=null;
            setTimeout(() => thisReference._setAccountsData(projectReference, walletReference), 1000);
            return;
        }

        //
        // Note: derived from superprovider::getKey
        //
        // Check given account, try to open and get address, else return [].
        walletReference.getKey(walletName, accountIndex, function(status, key) {
            if (status == 0) {
                const address = walletReference.getAddress(walletName, accountIndex);
                thisReference.testAccountKey = key;
            } else {
                const msg = "Could not get key for wallet " + walletName + ".";
                console.error(msg);
                thisReference.testAccountKey = null;
                setTimeout(() => thisReference._setAccountsData(projectReference, walletReference), 1000);
                return;
            }
        });
    }

    //
    // Take project settings to load project-specific references data
    // to be used in the testing environment
    loadReferencesData(project, wallet) {
        this._setContractsData(project);
        this._setAccountsData(project, wallet);
    }

    loadTestFiles(project, callback) {

        // Early exit
        if(this.isLoadingTestFiles) {
            return;
        }

        this.isLoadingTestFiles = true;

        console.log("Loading test files...");

        //
        // Rebuild data from scratch
        this.testFiles = {};

        const thisReference = this;
        const testsPath = "/tests";

        // Load data
        project.listFiles(testsPath, function(status, list) {
            if(status === 0 && list.length > 0){

                //
                // TODO: FIXME: always add the placeholder entry (demonstration purposes only)
                thisReference.testFiles["HelloWorldPlaceholder.test.js"] = PLACEHOLDER_REFERENCE_TEST_CODE;

                // TODO: consider supporting sub-directories
                for(var i=0; i<list.length; i++) {
                    const file = list[i]
                    const fileName = file.name;
                    const fullPath = testsPath + "/" + fileName;

                    const suffix = (fullPath.match('^.*/[^/]+[.](.+)$') || [])[1] || '';
                    const suffixLowerCase = suffix.toLowerCase();

                    //
                    // Read JavaScript files only
                    if(file.type === "f" && suffixLowerCase == "js") {
                        project.loadFile(fullPath, function(result) {
                            thisReference.testFiles[fileName] = result.contents;
                        });
                    }
                }

            } else {
                const errorMessage = "No tests available in " + testsPath;
                callback(errorMessage);
            }

            //
            // Toggle early exit condition
            //
            // TODO: considering this helps preventing multiple loadFile calls,
            // which happens asynchronously, it would be more correct to
            // aggregate the data in the loop first and do the loadFiles on a separate step
            // later. After loading is complete, only then toggle this flag.
            thisReference.isLoadingTestFiles = false;
        });
    }

    _getWeb3(evmProvider) {
        // TODO: consider caching web3 object for subsequent calls

        if(!Web3) {
            console.error("Unable to access Web3 library: ", Web3);
            return null;
        }

        var provider;
        if(this.endpoint && this.endpoint.toLowerCase() === "http://superblocks-browser") {
            if(evmProvider) {
                provider=evmProvider;
            } else {
                console.error("Unable to read EVM provider: ", evmProvider);
                return null;
            }
        } else {
            if(Web3.providers) {
                provider=new Web3.providers.HttpProvider(this.endpoint);
            } else {
                console.error("Unable to read Web3 providers: ", Web3.providers);
                return null;
            }
        }

        var web3=new Web3(provider);

        return web3;
    };

    runAll(evmProvider, callback) {
        //
        // Early exit
        if(this.testFiles.length === undefined || this.testFiles.length === 0) {
            callback("No tests available in /tests");
        }

        const web3Object = this._getWeb3(evmProvider);

        if(web3Object !== null) {
            // TODO: FIXME: remove condition
            const safeRun = false;
            if(safeRun) {
                this.testRunner.safeRunAll(
                    this.testFiles,
                    this.contractsData,
                    this.testAccountAddress,
                    this.testAccountKey,
                    web3Object,
                    callback);
            } else {
                this.testRunner.runAll(
                    this.testFiles,
                    this.contractsData,
                    this.testAccountAddress,
                    this.testAccountKey,
                    web3Object,
                    callback);
            }
        }
    }

    runSingle(evmProvider, index, callback) {
        //
        // Early exit
        if(this.testFiles.length === undefined || this.testFiles.length === 0) {
            callback("No tests available in /tests");
        }

        const data = this.readData().reportOutput;

        var counter = 0;
        var file = null;
        var testTitle = null;
        for(var test in data) {
            counter++;

            if(file === null && testTitle === null) {
                for(var i=0; i<data[test].tests.length; i++) {
                    if(counter !== index) {
                        counter++;
                    } else {
                        file = test;
                        testTitle = data[test].tests[i].title;
                        break;
                    }
                }
            }
        }
        const web3Object = this._getWeb3(evmProvider);

        if(web3Object !== null) {
            this.testRunner.runSingle(
                file,
                testTitle,
                this.testFiles,
                this.contractsData,
                this.testAccountAddress,
                this.testAccountKey,
                web3Object,
                callback);
        }
    }

    readData() {
        const total = readTotalTestCount();
        const passed = readReportSuccesses();
        const failed = readReportFailures();
        const done = passed + failed;
        const testRunnerStatus = this.testRunner.readStatus().toString();
        const testReporterStatus = readReporterStatus();
        const status = testRunnerStatus !== "" ? testRunnerStatus : testReporterStatus;
        const report = readReportOutput();

        return {
            done: {
                count: done,
                total: total
            },
            reportOutput: report,
            summary: {
                passed: passed,
                failed: failed,
                total: done
            },
            consoleOutput: status,
        };
    }

    onPlay(evmProvider, callback) {
        callback("Loading...");

        const thisReference=this;
        function setDataCallback() {
            const data = thisReference.readData();
            callback(data);
        }
        this.runAll(evmProvider, setDataCallback);
    }

    onRetry(evmProvider, index, callback) {
        callback("Loading...");

        const thisReference=this;
        function setDataCallback() {
            const data = thisReference.readData();
            callback(data);
        }
        this.runSingle(evmProvider, index, setDataCallback);
    };

    setSelectedTestId(id) {
        this.selectedTestId = id;
    }

    readSelectedTestId() {
        return this.selectedTestId;
    }

    readTotalTestDataTime() {
        return this.totalTestDataTime;
    }

    readTestData() {
        return this.testData;
    }

    setTestData(data) {
        // TODO: FIXME: add support to "Suites" (describe)
        // TODO: FIXME: automatically iterate over all tests
        this.testData = [];
        this.totalTestDataTime = 0;
        var uiCounter = 0;

        if(data.length <= 0) {
            //
            // Early exit in case there is no data
            return;
        } else if(typeof data === "string") {
            //
            // ... or take the input as a string message, if applicable
            this.testData = data;
            return;
        }

        for(var name in data) {
            const contractName = name;
            const tests = data[contractName].tests;

            var contractTotalTime = 0;
            var testEntries = [];
            for(var i=0; i<tests.length; i++) {

                //
                // Considers duration to be a condition that is only
                // present for tests (not suites or describe)
                if(tests[i] && tests[i].duration !== undefined) {
                    const testId = i;
                    const testName = tests[testId].title;
                    const testTime = tests[testId].duration;
                    const testTimeString = testTime + " ms";
                    const testState = tests[testId].state;

                    const testEntry = {
                        uiCounter: uiCounter++,
                        id: uiCounter,
                        name: testName,
                        time: testTimeString,
                        state: testState
                    };

                    //
                    // Update data
                    contractTotalTime += testTime;
                    testEntries.push(testEntry);
                }

            }

            this.totalTestDataTime += contractTotalTime;

            const contractTotalTimeString = contractTotalTime + " ms";

            const testTotalTime = contractTotalTime;
            const testTotalTimeString = contractTotalTime + " ms";
            const testFileName = "/tests/"+contractName;

            const newTest = {
                uiCounter: uiCounter++,
                id: -100 + uiCounter,
                name: testFileName,
                time: testTotalTimeString,
                children: testEntries
            };
            this.testData.push(newTest);
        }

    /*    const totalDummyTestTime = 5*4;
        this.totalTestDataTime += totalDummyTestTime;

        const totalDummyTestTimeString = totalDummyTestTime + " ms";
        const dummyTest = {
            uiCounter: 100,
            id: 1,
            name: "/tests/a_reference_dummy_test.js",
            time: totalDummyTestTimeString,
            children: [
                [{
                    uiCounter: 101,
                    id: 3,
                    name: "HardcodedExampleResults",
                    time: totalDummyTestTimeString,
                    children: [
                        {
                            uiCounter: 102,
                            id: 4,
                            name: "has an Owner",
                            time:"4ms",
                            state: "passed"
                        },
                        {
                            uiCounter: 103,
                            id: 5,
                            name: "has an Owner",
                            time:"4ms",
                            state: "failed"
                        },
                        {
                            uiCounter: 104,
                            id: 6,
                            name: "accepts fund",
                            time:"4ms",
                            state: "passed"
                        },
                        {
                            uiCounter: 105,
                            id: 7,
                            name: "Is able to pause or unpause",
                            time:"4ms",
                            state: "failed"
                        },
                        {
                            uiCounter: 106,
                            id: 8,
                            name: "permits owner to receive funds",
                            time:"4ms",
                            state: "passed"
                        },
                    ]
                }]
            ],
        };

        //
        // Update data
        this.testData.push(dummyTest);*/
    }
}

export const testRunnerBridge = new TestRunnerBridge();


/*=========================
  Placeholder and reference data
  for development and testing

=========================*/
const PLACEHOLDER_REFERENCE_TEST_CODE=`
    describe('User-created test block: manually check contract data', function (done) {
        var contractInstance;

        beforeEach(function (done) {
            // TODO: consider adding a helper for handling constructor parameters
            const contractBin = HelloWorld.bin + "0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000c48656c6c6f20576f726c64210000000000000000000000000000000000000000";
            const contractABI = HelloWorld.abi;

            var account_nonce=0;
            web3.eth.getTransactionCount(accountAddress, function(error, result) {
                if(error) {
                    done(new Error("Could not get nonce for address " + accountAddress));
                } else {
                    account_nonce=result;

                    const gas_price="0x3B9ACA00";
                    const gas_limit="0x3b8260";
                    const tx=new Tx.Tx({
                        from: accountAddress,
                        value: "0x0",
                        nonce: account_nonce,
                        gasPrice: gas_price,
                        gasLimit: gas_limit,
                        data: contractBin,
                    });
                    tx.sign(Tx.Buffer.Buffer.from(accountKey, "hex"));

                    web3.eth.sendRawTransaction("0x"+tx.serialize().toString("hex"),
                        function(error, result) {
                            if(error) {
                                console.error(error);
                                done(error);
                            } else {
                                var currentContractTransactionHash = result;

                                function getTransactionReceipt(hash, cb) {
                                    web3.eth.getTransactionReceipt(hash,(err,res)=>{
                                        if(err || !res || !res.blockHash) {
                                            setTimeout(()=>{getTransactionReceipt(hash, cb)},100);
                                        }
                                        else  {
                                            cb(null, res);
                                        }
                                    });
                                }

                                getTransactionReceipt(currentContractTransactionHash, function(err, res) {
                                    if(err) {
                                        console.error(err);
                                        done(err);
                                    } else {
                                        var contract = web3.eth.contract(contractABI);
                                        contractInstance = contract.at(res.contractAddress);
                                        done();
                                    }
                                });
                            }
                    });
                }
            });
        });

        // NOTE: the following tests are intended
        //       to target the Hello World template
        it('matches message data', function (done) {
            var expectedValue = "Hello World!";
            contractInstance.message(function(error, result) {
                if(error) {
                    console.error(error);
                    done(error);
                } else {
                    if(result !== expectedValue) {
                        done(new Error(result));
                    } else {
                        done();
                    }
                }
            });
        });

        // NOTE: the following tests are intended
        //       to target the Hello World template
        it('update message data', function (done) {
            const gas_price="0x3B9ACA00";
            const gas_limit="0x3b8260";
            var account_nonce=0;
            web3.eth.getTransactionCount(accountAddress, function(error, result) {
                if(error) {
                    done(new Error("Could not get nonce for address " + accountAddress));
                } else {
                    account_nonce=result;
                    var data = ABI.ABI.simpleEncode("update(string)", "Super Hello World!");
                    const tx=new Tx.Tx({
                        from: accountAddress,
                          to: contractInstance.address,
                          value: "0x0",
                          nonce: account_nonce,
                          gasPrice: gas_price,
                          gasLimit: gas_limit,
                          data: data,
                    });
                    tx.sign(Tx.Buffer.Buffer.from(accountKey, "hex"));

                    web3.eth.sendRawTransaction("0x"+tx.serialize().toString("hex"),
                        function(error, result) {
                            if(error) {
                                console.error(error);
                                done(error);
                            } else {
                                contractInstance.message(function(error, result) {
                                    var expectedValue = "Super Hello World!";

                                    if(error) {
                                        console.error(error);
                                        done(error);
                                    } else {
                                        if(result !== expectedValue) {
                                            done(new Error(result));
                                        } else {
                                            // Yet another method for checking the previous assumption
                                            var method="message";
                                            var args=[];
                                            var expectedType=["string"];
                                            var expectedValue=["Super Hello World!"];
                                            utilityLibrary.assert_call(contractInstance, contractInstance.address, method, args, expectedType, expectedValue, done);
                                            done();
                                        }
                                    }
                                });
                            }
                        }
                    );
                }
            });
        });

        // NOTE: the following tests are intended
        //       to target the Hello World template
        it('repeat: matches message data', function (done) {
            var expectedValue = "Hello World!";
            contractInstance.message(function(error, result) {
                if(error) {
                    console.error(error);
                    done(error);
                } else {
                    if(result !== expectedValue) {
                        done(new Error(result));
                    } else {
                        done();
                    }
                }
            });
        });
    });
`;
