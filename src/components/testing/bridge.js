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

        // TODO: FIXME: read currently selected network address from "Select a Network"
        this.endpoint="http://superblocks-browser"; // TODO: FIXME: support other networks

        // TODO: FIXME: consider enabling custom account selection;
        //              See also: contractinteraction.js
        //
        // Reference:
        /*
            const accountAddress=this._getAccountAddress();
            if(accountAddress.length==0) {
                accountAddress="0x0";
            } else {
                accountAddress=accountAddress[0];
            }
        */

        // TODO: FIXME: consider retrieving currently used endpoint and network settings
        // Reference:
        /*
            const env=this.props.project.props.state.data.env;
            const contract = this.dappfile.getItem("contracts", [{name: this.props.contract}]);
            const src=contract.get('source');
            const network=contract.get('network', env);
            const endpoint=(this.props.functions.networks.endpoints[network] || {}).endpoint;
            const web3=this._getWeb3(endpoint);
        */
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

        const thisReference = this;
        const contractsPath = "/contracts";
        var contractSources = {}

        project.listFiles(contractsPath, function(status, list) {
            if(status === 0){
                // TODO: FIXME: handle sub-directories
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

                                // TODO: FIXME: other required files for compiling the aforementioned input
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
        //
        // TODO: FIXME: depends on project reload (asynchronous wallet load)
        //              consider project reloads
        function getAccountAddress () {
            // Check given account, try to open and get address
            const accountName = projectReference.getAccount();
            if (!accountName) {
                return null;
            }

            const env = projectReference.getEnvironment();
            const accounts = projectReference.getHiddenItem('accounts');
            const account = accounts.getByName(accountName);
            const accountIndex = account.getAccountIndex(env);
            const walletName = account.getWallet(env);
            const wallets = projectReference.getHiddenItem('wallets');
            const wallet = wallets.getByName(walletName);

            if (!wallet) {
                return null;
            }
            const walletType = wallet.getWalletType();

            if (walletType == 'external') {
                // Metamask seems to always only provide one (the chosen) account.
                var extAccounts = [];
                if (window.web3 && window.web3.eth)
                    extAccounts = window.web3.eth.accounts || [];
                if (extAccounts.length < accountIndex + 1) {
                    // Account not matched
                    return null;
                }
                return extAccounts[accountIndex];
            }

            if (walletReference.isOpen(walletName)) {
                const address = walletReference.getAddress(walletName, accountIndex);
                return address;
            }

            return null;
        };

        //
        // Note: derived from superprovider::getKey
        //
        // TODO: FIXME: consider compressing getAccount* into a single pass (overlapping calls and data)
        function getAccountKey () {
            // Check given account, try to open and get address, else return [].
            const accountName = projectReference.getAccount();
            if (!accountName) {
                return null;
            }

            const env = projectReference.getEnvironment();
            const accounts = projectReference.getHiddenItem('accounts');
            const account = accounts.getByName(accountName);
            const accountIndex = account.getAccountIndex(env);
            const walletName = account.getWallet(env);
            const wallets = projectReference.getHiddenItem('wallets');
            const wallet = wallets.getByName(walletName);

            walletReference.getKey(walletName, accountIndex, function(status, key) {
                if (status == 0) {
                    const address = walletReference.getAddress(walletName, accountIndex);
                    thisReference.testAccountKey = key;
                } else {
                    const msg = "Could not get key for wallet " + walletName + ".";
                    console.error(msg);
                    thisReference.testAccountKey = null;
                }
            });
        };

        this.testAccountAddress = getAccountAddress();
        getAccountKey();
    }

    //
    // Take project settings to load project-specific references data
    // to be used in the testing environment
    loadReferencesData(project, wallet) {
        this._setContractsData(project);
        this._setAccountsData(project, wallet);
    }

    loadTestFiles(project) {

        // Early exit
        if(this.isLoadingTestFiles) {
            return;
        }

        this.isLoadingTestFiles = true;
        console.log("Loading test files...");

        const thisReference = this;
        const testsPath = "/tests";

        // Load data
        project.listFiles(testsPath, function(status, list) {
            if(status === 0){

                //
                // Rebuild data from scractch
                thisReference.testFiles = {};

                //
                // TODO: FIXME: always add the placeholder entry (demonstration purposes only)
                thisReference.testFiles["HelloWorldPlaceholder.test.js"] = PLACEHOLDER_REFERENCE_TEST_CODE;

                // TODO: FIXME: handle sub-directories
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

                //
                // Toggle early exit condition
                //
                // TODO: FIXME: considering this helps preventing multiple loadFile calls,
                // which happens asynchronously, it would be more correct to
                // aggregate the data in the loop first and do the loadFiles on a separate step
                // later. After loading is complete, only then toggle this flag.
                thisReference.isLoadingTestFiles = false;

            } else {
                console.error("Error trying to read contracts path: " + testsPath);
            }
        });
    }

    _getWeb3(evmProvider) {
        // TODO: FIXME: input parameter error checking
        var provider;
        // TODO: FIXME: checking assumptions
        if(this.endpoint.toLowerCase()=="http://superblocks-browser") {
            provider=evmProvider;
        }
        else {
            // TODO: FIXME: error checking
            provider=new Web3.providers.HttpProvider(this.endpoint);
        }

        // TODO: FIXME: provider error checking
        // TODO: FIXME: resulted object error checking
        var web3=new Web3(provider);

        return web3;
    };

    runAll(evmProvider) {
        // TODO: FIXME: returned object error checking
        const web3Object = this._getWeb3(evmProvider);

        this.testRunner.runAll(
            this.testFiles,
            this.contractsData,
            this.testAccountAddress,
            this.testAccountKey,

            web3Object)                             // TODO: FIXME: consider reusing available web3 object ?
    }

    runSingle(evmProvider, index) {
        // TODO: FIXME: input data error checking
        const data = this.readData().reportOutput;
        // TODO: FIXME: returned data error checking (index access)
        const testTitle = data[index].title;
        // TODO: FIXME: returned object error checking
        const web3Object = this._getWeb3(evmProvider);

        // TODO: FIXME: call the placeholder entry (for demonstration purposes only)
        // TODO: FIXME: index must be transformed into the respective file (section)
        //              in case there are multiple tests in a file.
        const file = "HelloWorldPlaceholder.test.js";

        this.testRunner.runSingle(
            file,                                   // TODO: FIXME: Grab test file from testFiles instead

            testTitle,                              // TODO: FIXME: Grab test title from testFiles instead

            this.testFiles,
            this.contractsData,
            this.testAccountAddress,
            this.testAccountKey,

            web3Object);                            // TODO: FIXME: consider reusing available web3 object ?
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

    // TODO: FIXME: set proper action name (rename)
    onPlayRun(evmProvider, callback) {
        this.runAll(evmProvider);

        const data = this.readData();
        // TODO: FIXME: remove timeout in favor of asynchronous event
        // to be executed after the previous run call
        setTimeout(()=>{
            callback(data);
        },2000);
    }

    // TODO: FIXME: set proper action name (rename)
    onRetry(evmProvider, index, callback) {
        console.warn(evmProvider, index, callback);
        // TODO: FIXME: index: selection by index position
        testRunnerBridge.runSingle(evmProvider, index, callback);

        const data = this.readData();
        // TODO: FIXME: remove timeout in favor of asynchronous event
        // to be executed after the previous run call
        setTimeout(()=>{
            callback(data);
        },2000);
    };
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
            // TODO: FIXME: constructor parameters
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
