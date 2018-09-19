// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Lab.
//
// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

const assert = require("assert");

describe('solc', function() {
    this.timeout(10000);

    // Template file paths
    const emptyTemplatePath = "../src/components/templates/empty.json";
    const helloWorldTemplatePath = "../src/components/templates/hello.json";
    const newsFeedTemplatePath = "../src/components/templates/newsfeed.json";
    const raiseToSummonTemplatePath = "../src/components/templates/raisetosummon.json";

    // Template files
    const emptyTemplateFile = require(emptyTemplatePath);
    const helloWorldTemplateFile = require(helloWorldTemplatePath);
    const newsFeedTemplateFile = require(newsFeedTemplatePath);
    const raiseToSummonTemplateFile = require(raiseToSummonTemplatePath);

    // Compiler settings
    const compilerPath = "../src/components/solc/dist/soljson-v0.4.21+commit.dfe3193c.js"
    const compiler = require(compilerPath);
    const compile = compiler.cwrap("compileStandard", "string", ["string", "number"]);

    // Helper function
    function call_compile(fileContents,
            expectedContractsLength, expectedSourcesLength, expectedErrorsLength,
            expectedContractFileName, expectedSourcesFileName, expectedContractName,
            expectedContractBytecode, expectedContractMetadataABI, expectedContractMetadataLanguage, expectedContractMetadataEvmVersion, expectedContractMetadataOptimizerEnabled, expectedContractMetadataOptimizerRuns) {
        var input = {
            language: "Solidity",
            sources: {},
            settings: {
                optimizer: {
                    enabled: false,
                    runs: 200
                },
                evmVersion: "byzantium",
                libraries: {
                },
                outputSelection: {
                    "*": {
                        "*": ["metadata", "evm.bytecode", "evm.gasEstimates"]
                    }
                }
            }
        };

        input.sources[expectedContractFileName] = { content: fileContents };
        const output = JSON.parse(compile(JSON.stringify(input), 0));

        //
        // Check data length settings
        if(expectedErrorsLength > 0) {
            assert.strictEqual(output.errors.length, expectedErrorsLength);
        } else {
            assert.strictEqual(output.errors, undefined);
        }
        assert.strictEqual(Object.keys(output.contracts).length, expectedContractsLength);
        assert.strictEqual(Object.keys(output.sources).length, expectedSourcesLength);

        //
        // Check contract and file name settings
        assert.ok(output.contracts[expectedContractFileName], "Expected contract file name to exist");
        assert.ok(output.sources[expectedContractFileName], expectedSourcesFileName);
        assert.strictEqual(Object.keys(output.contracts[expectedContractFileName])[0], expectedContractName);

        //
        // Check expected output
        const data = output.contracts[expectedContractFileName][expectedContractName];
        const metadata = JSON.parse(data.metadata);

        assert.strictEqual(data.evm.bytecode.object, expectedContractBytecode);
        assert.strictEqual(metadata.output.abi.length, expectedContractMetadataABI.length);
        for(var i=0; i< metadata.output.abi.length; i++) {
            assert.strictEqual(metadata.output.abi[i].toString(), expectedContractMetadataABI[i].toString());
        }

        assert.strictEqual(metadata.language, expectedContractMetadataLanguage);
        assert.strictEqual(metadata.settings.evmVersion, expectedContractMetadataEvmVersion);
        assert.strictEqual(metadata.settings.optimizer.enabled, expectedContractMetadataOptimizerEnabled);
        assert.strictEqual(metadata.settings.optimizer.runs, expectedContractMetadataOptimizerRuns);
    }

    it('should compile a simple contract', function() {
        const fileContents = "pragma solidity ^0.4.21;contract dummy{}"

        // Expected data length settings
        const expectedContractsLength = 1;
        const expectedSourcesLength = 1;
        const expectedErrorsLength = 0;

        // Expected contract and file name settings
        const expectedContractFileName = "Dummy.sol";
        const expectedSourcesFileName = "Dummy.sol";
        const expectedContractName = "dummy";

        // Other expected output
        const expectedContractBytecode = "60606040523415600e57600080fd5b603580601b6000396000f3006060604052600080fd00a165627a7a7230582080907714e832c63788931595fbb5a37dc0038703cded8b55cfb58b2e11e0df140029";
        const expectedContractMetadataABI = [];
        const expectedContractMetadataLanguage = "Solidity";
        const expectedContractMetadataEvmVersion = "byzantium";
        const expectedContractMetadataOptimizerEnabled = false;
        const expectedContractMetadataOptimizerRuns = 200;

        call_compile(fileContents,
            expectedContractsLength, expectedSourcesLength, expectedErrorsLength,
            expectedContractFileName, expectedSourcesFileName, expectedContractName,
            expectedContractBytecode, expectedContractMetadataABI, expectedContractMetadataLanguage, expectedContractMetadataEvmVersion, expectedContractMetadataOptimizerEnabled, expectedContractMetadataOptimizerRuns);
    });

    it('should compile Empty template', function() {
        // Expected data length settings
        const expectedContractsLength = 1;
        const expectedSourcesLength = 1;
        const expectedErrorsLength = 0;

        // Expected contract and file name settings
        const expectedContractFileName = "MyContract.sol";
        const expectedSourcesFileName = "MyContract.sol";
        const expectedContractName = "MyContract";

        // Other expected output
        const expectedContractBytecode = "60606040523415600e57600080fd5b603580601b6000396000f3006060604052600080fd00a165627a7a7230582096dad5bd4a5fb4a813147aa5c569c714ba81b6865d3b46b34580834037ee1a300029";
        const expectedContractMetadataABI = [ { inputs: [], payable: false, stateMutability: 'nonpayable', type: 'constructor' } ];
        const expectedContractMetadataLanguage = "Solidity";
        const expectedContractMetadataEvmVersion = "byzantium";
        const expectedContractMetadataOptimizerEnabled = false;
        const expectedContractMetadataOptimizerRuns = 200;

        const fileContents = emptyTemplateFile.files["/"].children.contracts.children[expectedContractFileName].contents;

        call_compile(fileContents,
            expectedContractsLength, expectedSourcesLength, expectedErrorsLength,
            expectedContractFileName, expectedSourcesFileName, expectedContractName,
            expectedContractBytecode, expectedContractMetadataABI, expectedContractMetadataLanguage, expectedContractMetadataEvmVersion, expectedContractMetadataOptimizerEnabled, expectedContractMetadataOptimizerRuns);
    });

    it('should compile Hello World template', function() {
        // Expected data length settings
        const expectedContractsLength = 1;
        const expectedSourcesLength = 1;
        const expectedErrorsLength = 0;

        // Expected contract and file name settings
        const expectedContractFileName = "HelloWorld.sol";
        const expectedSourcesFileName = "HelloWorld.sol";
        const expectedContractName = "HelloWorld";

        // Other expected output
        const expectedContractBytecode = "6060604052341561000f57600080fd5b6040516103c13803806103c1833981016040528080518201919050508060009080519060200190610041929190610048565b50506100ed565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061008957805160ff19168380011785556100b7565b828001600101855582156100b7579182015b828111156100b657825182559160200191906001019061009b565b5b5090506100c491906100c8565b5090565b6100ea91905b808211156100e65760008160009055506001016100ce565b5090565b90565b6102c5806100fc6000396000f30060606040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680633d7403a314610051578063e21f37ce146100ae575b600080fd5b341561005c57600080fd5b6100ac600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190505061013c565b005b34156100b957600080fd5b6100c1610156565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101015780820151818401526020810190506100e6565b50505050905090810190601f16801561012e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b80600090805190602001906101529291906101f4565b5050565b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156101ec5780601f106101c1576101008083540402835291602001916101ec565b820191906000526020600020905b8154815290600101906020018083116101cf57829003601f168201915b505050505081565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061023557805160ff1916838001178555610263565b82800160010185558215610263579182015b82811115610262578251825591602001919060010190610247565b5b5090506102709190610274565b5090565b61029691905b8082111561029257600081600090555060010161027a565b5090565b905600a165627a7a72305820bb261bb5858618e117ce6751ee971eccf221b3efade6c29d04b739a5e37335ab0029";
        const expectedContractMetadataABI = [ { constant: false, inputs: [ [Object] ], name: 'update', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'message', outputs: [ [Object] ], payable: false, stateMutability: 'view', type: 'function' }, { inputs: [ [Object] ], payable: false, stateMutability: 'nonpayable', type: 'constructor' } ];
        const expectedContractMetadataLanguage = "Solidity";
        const expectedContractMetadataEvmVersion = "byzantium";
        const expectedContractMetadataOptimizerEnabled = false;
        const expectedContractMetadataOptimizerRuns = 200;

        const fileContents = helloWorldTemplateFile.files["/"].children.contracts.children[expectedContractFileName].contents;

        call_compile(fileContents,
            expectedContractsLength, expectedSourcesLength, expectedErrorsLength,
            expectedContractFileName, expectedSourcesFileName, expectedContractName,
            expectedContractBytecode, expectedContractMetadataABI, expectedContractMetadataLanguage, expectedContractMetadataEvmVersion, expectedContractMetadataOptimizerEnabled, expectedContractMetadataOptimizerRuns);
    });

    it('should compile Uncensorable News Feed template', function() {
        // Expected data length settings
        const expectedContractsLength = 1;
        const expectedSourcesLength = 1;
        const expectedErrorsLength = 0;

        // Expected contract and file name settings
        const expectedContractFileName = "NewsFeed.sol";
        const expectedSourcesFileName = "NewsFeed.sol";
        const expectedContractName = "NewsFeed";

        // Other expected output
        const expectedContractBytecode = "6060604052341561000f57600080fd5b6040516020806108818339810160405280805190602001909190505060008173ffffffffffffffffffffffffffffffffffffffff161415151561005157600080fd5b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505061079f806100e26000396000f30060606040526004361061006d576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063734f8482146100725780638da5cb5b1461009b578063a6c3e6b9146100f0578063bd85d86714610145578063c163bba71461024d575b600080fd5b341561007d57600080fd5b6100856102ed565b6040518082815260200191505060405180910390f35b34156100a657600080fd5b6100ae6102f3565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156100fb57600080fd5b610103610318565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561015057600080fd5b610166600480803590602001909190505061033e565b604051808060200180602001838103835285818151815260200191508051906020019080838360005b838110156101aa57808201518184015260208101905061018f565b50505050905090810190601f1680156101d75780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019080838360005b838110156102105780820151818401526020810190506101f5565b50505050905090810190601f16801561023d5780820380516001836020036101000a031916815260200191505b5094505050505060405180910390f35b341561025857600080fd5b6102eb600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919050506104cf565b005b60025481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6103466105c7565b61034e6105c7565b60038381548110151561035d57fe5b906000526020600020906002020160000160038481548110151561037d57fe5b9060005260206000209060020201600101818054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104235780601f106103f857610100808354040283529160200191610423565b820191906000526020600020905b81548152906001019060200180831161040657829003601f168201915b50505050509150808054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104bf5780601f10610494576101008083540402835291602001916104bf565b820191906000526020600020905b8154815290600101906020018083116104a257829003601f168201915b5050505050905091509150915091565b6104d76105db565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561053357600080fd5b60408051908101604052808481526020018381525090506003805480600101828161055e9190610601565b916000526020600020906002020160008390919091506000820151816000019080519060200190610590929190610633565b5060208201518160010190805190602001906105ad929190610633565b505050506001600260008282540192505081905550505050565b602060405190810160405280600081525090565b60408051908101604052806105ee6106b3565b81526020016105fb6106b3565b81525090565b81548183558181151161062e5760020281600202836000526020600020918201910161062d91906106c7565b5b505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061067457805160ff19168380011785556106a2565b828001600101855582156106a2579182015b828111156106a1578251825591602001919060010190610686565b5b5090506106af9190610706565b5090565b602060405190810160405280600081525090565b61070391905b808211156106ff57600080820160006106e6919061072b565b6001820160006106f6919061072b565b506002016106cd565b5090565b90565b61072891905b8082111561072457600081600090555060010161070c565b5090565b90565b50805460018160011615610100020316600290046000825580601f106107515750610770565b601f01602090049060005260206000209081019061076f9190610706565b5b505600a165627a7a723058204bc7dce4a590ed5b044760bdca040cbf07f46495cbbd3e88f6888fcf95fb6c540029";
        const expectedContractMetadataABI = [ { constant: true, inputs: [], name: 'numArticles', outputs: [ [Object] ], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'owner', outputs: [ [Object] ], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'author', outputs: [ [Object] ],  payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [ [Object] ], name: 'getArticle', outputs: [ [Object], [Object] ], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [ [Object], [Object] ], name: 'publish', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { inputs: [ [Object] ], payable: false, stateMutability: 'nonpayable', type: 'constructor' } ];
        const expectedContractMetadataLanguage = "Solidity";
        const expectedContractMetadataEvmVersion = "byzantium";
        const expectedContractMetadataOptimizerEnabled = false;
        const expectedContractMetadataOptimizerRuns = 200;

        const fileContents = newsFeedTemplateFile.files["/"].children.contracts.children[expectedContractFileName].contents;

        call_compile(fileContents,
            expectedContractsLength, expectedSourcesLength, expectedErrorsLength,
            expectedContractFileName, expectedSourcesFileName, expectedContractName,
            expectedContractBytecode, expectedContractMetadataABI, expectedContractMetadataLanguage, expectedContractMetadataEvmVersion, expectedContractMetadataOptimizerEnabled, expectedContractMetadataOptimizerRuns);
    });

    it('should compile Raise to Summon template', function() {
        // Expected data length settings
        const expectedContractsLength = 1;
        const expectedSourcesLength = 1;
        const expectedErrorsLength = 3;

        // Expected contract and file name settings
        const expectedContractFileName = "RaiseToSummon.sol";
        const expectedSourcesFileName = "RaiseToSummon.sol";
        const expectedContractName = "RaiseToSummon";

        // Other expected output
        const expectedContractBytecode = "6060604052341561000f57600080fd5b604051610c67380380610c678339810160405280805190602001909190805182019190602001805190602001909190505060008373ffffffffffffffffffffffffffffffffffffffff161415151561006657600080fd5b60008111151561007557600080fd5b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550816002908051906020019061010c929190610156565b50806003819055506000600460006101000a81548160ff021916908315150217905550600060068190555060006007819055506000600881905550426005819055505050506101fb565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061019757805160ff19168380011785556101c5565b828001600101855582156101c5579182015b828111156101c45782518255916020019190600101906101a9565b5b5090506101d291906101d6565b5090565b6101f891905b808211156101f45760008160009055506001016101dc565b5090565b90565b610a5d8061020a6000396000f3006060604052600436106100db576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632279fa4c146100eb578063242d7dba14610114578063387be94f1461013d5780633c28b9c0146101665780633ccfd60b1461018f578063638f6575146101a457806370a6c4bb146101cd578063878c1484146101e25780638da5cb5b146102705780639f43ddd2146102c5578063bfb460e9146102ee578063d2ffca2d14610311578063ed88c68e1461033a578063f7260d3e14610344578063fc79271914610399575b34156100e657600080fd5b600080fd5b34156100f657600080fd5b6100fe6103c6565b6040518082815260200191505060405180910390f35b341561011f57600080fd5b6101276103cc565b6040518082815260200191505060405180910390f35b341561014857600080fd5b6101506103d2565b6040518082815260200191505060405180910390f35b341561017157600080fd5b6101796103d8565b6040518082815260200191505060405180910390f35b341561019a57600080fd5b6101a26103de565b005b34156101af57600080fd5b6101b761052d565b6040518082815260200191505060405180910390f35b34156101d857600080fd5b6101e0610533565b005b34156101ed57600080fd5b6101f5610694565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561023557808201518184015260208101905061021a565b50505050905090810190601f1680156102625780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561027b57600080fd5b610283610732565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156102d057600080fd5b6102d8610757565b6040518082815260200191505060405180910390f35b34156102f957600080fd5b61030f6004808035906020019091905050610779565b005b341561031c57600080fd5b6103246107ff565b6040518082815260200191505060405180910390f35b610342610823565b005b341561034f57600080fd5b6103576109f8565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156103a457600080fd5b6103ac610a1e565b604051808215151515815260200191505060405180910390f35b60075481565b60085481565b60065481565b60035481565b600080600960003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205411151561042d57600080fd5b600354600554014211151561044157600080fd5b60001515600460009054906101000a900460ff16151514151561046357600080fd5b600960003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490506000600960003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050151561052a57600080fd5b50565b60055481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561058f57600080fd5b600654600854101515156105a257600080fd5b60003073ffffffffffffffffffffffffffffffffffffffff16311115156105c857600080fd5b60035460055401421015156105dc57600080fd5b60001515600460009054906101000a900460ff1615151415156105fe57600080fd5b6001600460006101000a81548160ff021916908315150217905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc3073ffffffffffffffffffffffffffffffffffffffff16319081150290604051600060405180830381858888f19350505050151561069257600080fd5b565b60028054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561072a5780601f106106ff5761010080835404028352916020019161072a565b820191906000526020600020905b81548152906001019060200180831161070d57829003601f168201915b505050505081565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600554600354600554011015151561076d57fe5b60035460055401905090565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156107d557600080fd5b60006006541415156107e657600080fd5b6000811115156107f557600080fd5b8060068190555050565b6000600654600854111561081b57600654600854039050610820565b600090505b90565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415151561088057600080fd5b600354600554014210151561089457600080fd5b6000341115156108a357600080fd5b6000600654141515156108b557600080fd5b60001515600460009054906101000a900460ff1615151415156108d757600080fd5b600960003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205434600960003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054011015151561096357fe5b60085434600854011015151561097557fe5b6007546001600754011015151561098857fe5b34600960003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550346008600082825401925050819055506001600760008282540192505081905550565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600460009054906101000a900460ff16815600a165627a7a723058200f4484035f38e3105ca0f963b4d1e4e0b203c9215bf794995188d10a7cd7cb440029";
        const expectedContractMetadataABI = [ { constant: true, inputs: [], name: 'numPayments', outputs: [ [Object] ], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'totalAmountRaised', outputs: [ [Object] ], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'minimumAmountRequired', outputs: [ [Object] ], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'expirationInSeconds', outputs: [ [Object] ], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [], name: 'withdraw', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'timeStarted', outputs: [ [Object] ], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [], name: 'receiverWithdraw', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'cause', outputs: [ [Object] ], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'owner', outputs: [ [Object] ], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'expirationTimestamp', outputs: [ [Object] ], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [ [Object] ], name: 'receiverSetAmountRequired', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'currentTotalExcess', outputs: [ [Object] ], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [], name: 'donate', outputs: [], payable: true, stateMutability: 'payable', type: 'function' }, { constant: true, inputs: [], name: 'receiver', outputs: [ [Object] ], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'hasBeenClaimed', outputs: [ [Object] ], payable: false, stateMutability: 'view', type: 'function' }, { inputs: [ [Object], [Object], [Object] ], payable: false, stateMutability: 'nonpayable', type: 'constructor' }, { payable: false, stateMutability: 'nonpayable', type: 'fallback' } ];
        const expectedContractMetadataLanguage = "Solidity";
        const expectedContractMetadataEvmVersion = "byzantium";
        const expectedContractMetadataOptimizerEnabled = false;
        const expectedContractMetadataOptimizerRuns = 200;

        const fileContents = raiseToSummonTemplateFile.files["/"].children.contracts.children[expectedContractFileName].contents;

        call_compile(fileContents,
            expectedContractsLength, expectedSourcesLength, expectedErrorsLength,
            expectedContractFileName, expectedSourcesFileName, expectedContractName,
            expectedContractBytecode, expectedContractMetadataABI, expectedContractMetadataLanguage, expectedContractMetadataEvmVersion, expectedContractMetadataOptimizerEnabled, expectedContractMetadataOptimizerRuns);
    });
});
