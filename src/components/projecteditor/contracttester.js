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
// TODO: FIXME: consider adding as part of the project (instead of dist)
import Mocha from '../mocha';

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

    action_before() {
        describe('User action before tests', function () {
            it('should test a pre-test', function () {
                if(false) {
                    throw new Error("Unexpected error");
                }
            })
        });
    }

    action_after() {
        describe('User action after tests', function () {
            it('should test a post-test', function () {
                if(false) {
                    throw new Error("Unexpected error");
                }
            })
        });
    }

    check_data(instance, address, data_name, expected_value, done) {
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

    action_test=(instance, address, done)=> {
        var check_data = this.check_data;
        describe('User test action: check contract data', function (done) {
            // TODO: FIXME: simplify check_data to minimize number of parameters 
            //              (implicit instance and address)
            // TODO: FIXME: change input data to proper signature (ABI)
            // TODO: FIXME: change expected value output to human readable (decoded)
            check_data(instance, address, "0xe21f37ce", "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000c48656c6c6f20576f726c64210000000000000000000000000000000000000000", done);
        });
    }

    setup(action_before, action_test, action_after) {
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

                var address = this.contract_address;
                if(address) {
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
                            action_test(instance, address, done);
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
