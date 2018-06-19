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

import { h, Component } from 'preact';
// TODO: FIXME: pending style
import style from './style-mocha';
import SuperProvider from '../superprovider';
import Web3 from 'web3';
import Tx from '../../ethereumjs-tx-1.3.3.min.js';
import ABI from '../../ethereumjs-abi-0.6.5.min.js';
import Mocha from '../../mocha.js';

export default class ContractTester extends Component {
    constructor(props) {
        super(props);
        this.id=props.id+"_contracttester";
        this.props.parent.childComponent=this;
        this.dappfile = this.props.project.props.state.data.dappfile;
        this.provider=new SuperProvider({that:this});
        this.setState({account:0});
        this.contract_address="";
        this.contract_instance=null;
    }

    getAccounts = (useDefault) => {
        var index=0;
        const ret=[{name:"(locked)",value:index++}];
        this.dappfile.accounts().map((account) => {
            ret.push({name:account.name,value:index++});
        })
        return ret;
    };

    _getAccount=()=>{
        const items=this.getAccounts().filter((item)=>{
            return this.state.account==item.value;
        });
        if(items.length>0) return items[0].name;
    };

    _getAccountAddress=()=>{
        // Check given account, try to open and get address, else return [].
        const accountName=this._getAccount();
        if(accountName=="(locked)") return [];
        if(!accountName) return [];

        const env=this.props.project.props.state.data.env;
        const account = this.dappfile.getItem("accounts", [{name: accountName}]);
        const accountIndex=account.get('index', env);
        const walletName=account.get('wallet', env);
        const wallet = this.dappfile.getItem("wallets", [{name: walletName}]);
        if(!wallet) {
            return [];
        }
        const walletType=wallet.get('type');

        if(walletType=="external") {
            // Metamask seems to always only provide one (the chosen) account.
            const extAccounts = web3.eth.accounts || [];
            if(extAccounts.length<accountIndex+1) {
                // Account not matched
                return [];
            }
            return [extAccounts[accountIndex]];
        }

        if(this.props.functions.wallet.isOpen(walletName)) {
            const address=this.props.functions.wallet.getAddress(walletName, accountIndex);
            return [address];
        }

        return [];
    };

    _getWeb3=(endpoint)=>{
        var provider;
        if(endpoint.toLowerCase()=="http://superblocks-browser") {
            provider=this.props.functions.EVM.getProvider();
        }
        else {
            var provider=new Web3.providers.HttpProvider(endpoint);
        }
        var web3=new Web3(provider);
        return web3;
    };

    _makeFileName=(path, tag, suffix)=>{
        const a = path.match(/^(.*\/)([^/]+)$/);
        const dir=a[1];
        const filename=a[2];
        return dir + "." + filename + "." + tag + "." + suffix;
    };

    // NOTE: this represents an user-provided function to be executed before tests
    action_before() {
        describe('User action before tests', function () {
            it('should test a pre-test', function () {
                if(false) {
                    throw new Error("Unexpected error");
                }
            })
        });
    }

    // NOTE: this represents an user-provided function to be executed after tests
    action_after() {
        describe('User action after tests', function () {
            it('should test a post-test', function () {
                if(false) {
                    throw new Error("Unexpected error");
                }
            })
        });
    }

    assert_call(instance, address, method, args, expected_type, expected_value, done) {
        var data_name=ABI.ABI.methodID(method, args);
        var expected_value="0x" + ABI.ABI.rawEncode(expected_type, expected_value).toString("hex");
        it('matches data', function (done) {
            instance._eth.call({to: address, data: data_name}, function(error, result) {
                if(!error) {
                    if(result !== expected_value) {
                        done(new Error(result));
                    } else {
                        done();
                    }
                } else {
                    done(new Error(error));
                }
            });
        });
    }

    action_test=(web3, instance, contract_address, account_address, account_key, done)=> {
        describe('User test action: manually check contract data', function (done) {
            // NOTE: the following tests are intended
            //       to target the Hello World template
            it('matches message data', function (done) {
                var expected_value = "Hello World!";
                instance.message(function(error, result) {
                    if(error) {
                        console.error(error);
                        done(error);
                    } else {
                        if(result !== expected_value) {
                            done(new Error(result));
                        } else {
                            done();
                        }
                    }
                });
            });

            it('update message data', function (done) {
                const gas_price="0x3B9ACA00";
                const gas_limit="0x3b8260";
                var account_nonce=0;

                // TODO: FIXME: consider providing a helper function for the following code ?
                web3.eth.getTransactionCount(account_address, function(error, result) {
                    if(error) {
                        done(new Error("Could not get nonce for address " + account_address));
                    } else {
                        account_nonce=result;
                        var data = ABI.ABI.simpleEncode("update(string)", "Super Hello World!");
                        const tx=new Tx.Tx({
                            from: account_address,
                            to: contract_address,
                            value: "0x0",
                            nonce: account_nonce,
                            gasPrice: gas_price,
                            gasLimit: gas_limit,
                            data: data,
                        });
                        tx.sign(Tx.Buffer.Buffer.from(account_key, "hex"));

                        web3.eth.sendRawTransaction("0x"+tx.serialize().toString("hex"),
                            function(error, result) {
                                if(error) {
                                    console.error(error);
                                    done(error);
                                } else {
                                    done();
                                }
                            }
                        );
                    }
                });
            });

            // TODO: FIXME: remove skip
            it.skip('matches updated message data', function (done) {
                // NOTE: this is a test for Hello World template
                var expected_value = "Super Hello World!";
                instance.message(function(error, result) {
                    if(error) {
                        console.error(error);
                        done(error);
                    } else {
                        if(result !== expected_value) {
                            done(new Error(result));
                        } else {
                            done();
                        }
                    }
                });
            });
        });

        var assert_call = this.assert_call;
        describe('User test action: check contract data via assert_call', function (done) {
            // NOTE: this is a test for Hello World template
            // TODO: FIXME: simplify assert_call to minimize number of parameters 
            //              (consider implicit instance and address ?)

            var method="message";
            var args=[];
            var expected_type=["string"];
            var expected_value=["Hello World!"];
            assert_call(instance, contract_address, method, args, expected_type, expected_value, done);
        });
    }

    setup(action_before, action_test, action_after) {
        // TODO: FIXME: enable custom account selection;
        //              See also: contractinteraction.js
/*        const account_address=this._getAccountAddress();
        if(account_address.length==0) {
            this.account_address="0x0";
        }
        else {
            this.account_address=account_address[0];
        }*/
        const account_address="0xa48f2e0be8ab5a04a5eb1f86ead1923f03a207fd";
        const account_key="3867b6c26d09eda0a03e523f509e317d1656adc2f64b59f8b630c76144db0f17";

        const env=this.props.project.props.state.data.env;
        const contract = this.dappfile.getItem("contracts", [{name: this.props.contract}]);
        const src=contract.get('source');
        const network=contract.get('network', env);
        const endpoint=(this.props.functions.networks.endpoints[network] || {}).endpoint;
        const web3=this._getWeb3(endpoint);

        // Contract ABI
        var contract_abi;
        const abisrc=this._makeFileName(src, env, "abi");
        this.props.project.loadFile(abisrc, (body) => {
            if(body.status != 0) {
                console.error("Unable to read contract ABI. Make sure the contract is deployed");
                return 1;
            }
            contract_abi = body.contents;

            if(!contract_abi) {
                console.error("Unable to read contract ABI. Make sure the contract is deployed");
                return 1
            }

            var contract_interface = JSON.parse(contract_abi);

            // Contract address
            const addresssrc=this._makeFileName(src, env+"."+network, "address");
            this.props.project.loadFile(addresssrc, (body) => {
                if(body.status != 0) {
                    console.error("Unable to read contract address. Make sure the contract is deployed");
                    return 2;
                }

                this.contract_address = body.contents;

                if(!this.contract_address) {
                    console.error("Unable to read contract address. Make sure the contract is deployed");
                    return 2;
                }

                this.contract_instance = web3.eth.contract(contract_interface).at(this.contract_address);

                var contract_address = this.contract_address;
                if(contract_address) {
                   mocha.setup('bdd');

                    var instance = this.contract_instance;

                    var contract_name=this.props.contract;
                    describe(contract_name, function(done) {
                        before(function (done) {
                            console.log('Preparing test suite...');
                            this.timeout(0);

                            if(action_before) {
                                action_before();
                            }

                            done();
                        });

                        it('Running test suite...', function (done) {
                            console.log('Running test suite...');
                            action_test(web3, instance, contract_address, account_address, account_key, done);
                            done();
                        });

                        after(function (done) {
                            console.log('Finalizing test suite...');

                            if(action_after) {
                                action_after();
                            }

                            done();
                        });
                    });

                    mocha.checkLeaks();
                    mocha.run();
                    return 0;
                }
            });
        });
    };

    redraw = () => {
        this.setState();
    };

    render() {

        // TODO: FIXME: read user tests (external)
        var user_action_before_test = this.action_before;
        var user_action_test = this.action_test;
        var user_action_after_test = this.action_after;
        var status = this.setup(user_action_before_test, user_action_test, user_action_after_test);

        // Render results
        if(status == 1) {
            return (
                    <div class="scrollable-y" id={this.id+"_scrollable"}>
                    <h1>Unable to read contract ABI. Make sure the contract is deployed</h1>
                    </div>);
        } else if(status == 2) {
            return (
                    <div class="scrollable-y" id={this.id+"_scrollable"}>
                    <h1>Unable to read contract address. Make sure the contract is deployed</h1>
                    </div>);
        } else {
            return (
                    <div class="scrollable-y" id={this.id+"_scrollable"}>
                    <div id="mocha">
                    </div>
                    </div>);
        }
    }
}
