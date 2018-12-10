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
    setContractsData(project) {
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
            PLACEHOLDER_REFERENCE_TEST_CODE,        // TODO: FIXME: read user-created test code content (string)

            this.contractsData,

            PLACEHOLDER_REFERENCE_ACCOUNT_ADDRESS,  // TODO: FIXME: read currently selected account address from "Select an Account"

            PLACEHOLDER_REFERENCE_ACCOUNT_KEY,      // TODO: FIXME: read currently selected account address from "Select an Account" and wallet

            web3Object)                             // TODO: FIXME: consider reusing available web3 object ?
    }

    runSingle(evmProvider, index) {
        // TODO: FIXME: input data error checking
        const data = this.readData().reportOutput;
        // TODO: FIXME: returned data error checking (index access)
        const testTitle = data[index].title;
        // TODO: FIXME: returned object error checking
        const web3Object = this._getWeb3(evmProvider);

        this.testRunner.runSingle(
            testTitle,

            PLACEHOLDER_REFERENCE_TEST_CODE,        // TODO: FIXME: read user-created test code content (string)

            this.contractsData,

            PLACEHOLDER_REFERENCE_ACCOUNT_ADDRESS,  // TODO: FIXME: read currently selected account address from "Select an Account"

            PLACEHOLDER_REFERENCE_ACCOUNT_KEY,      // TODO: FIXME: read currently selected account address from "Select an Account" and wallet

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

const PLACEHOLDER_REFERENCE_ACCOUNT_ADDRESS="0xa48f2e0be8ab5a04a5eb1f86ead1923f03a207fd";

const PLACEHOLDER_REFERENCE_ACCOUNT_KEY="3867b6c26d09eda0a03e523f509e317d1656adc2f64b59f8b630c76144db0f17";
