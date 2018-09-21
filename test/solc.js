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
    const compilerPath = "../src/components/solc/dist/soljson-v0.4.25+commit.59dbf8f1.js"
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
        const expectedContractBytecode = "6080604052348015600f57600080fd5b50603580601d6000396000f3006080604052600080fd00a165627a7a723058208286ca49448f53440bc3e60cd1b2480fc830c49e7ba495424a54a1601d51c6bb0029";
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
        const expectedContractBytecode = "6080604052348015600f57600080fd5b50603580601d6000396000f3006080604052600080fd00a165627a7a72305820d733598722a0cc71034b48bf55e97e6341e2a1bf4ee6dcdbcfd15fd661331e610029";
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
        const expectedContractBytecode = "608060405234801561001057600080fd5b506040516103d73803806103d7833981018060405281019080805182019291905050508060009080519060200190610049929190610050565b50506100f5565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061009157805160ff19168380011785556100bf565b828001600101855582156100bf579182015b828111156100be5782518255916020019190600101906100a3565b5b5090506100cc91906100d0565b5090565b6100f291905b808211156100ee5760008160009055506001016100d6565b5090565b90565b6102d3806101046000396000f30060806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680633d7403a314610051578063e21f37ce146100ba575b600080fd5b34801561005d57600080fd5b506100b8600480360381019080803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919291929050505061014a565b005b3480156100c657600080fd5b506100cf610164565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561010f5780820151818401526020810190506100f4565b50505050905090810190601f16801561013c5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b8060009080519060200190610160929190610202565b5050565b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156101fa5780601f106101cf576101008083540402835291602001916101fa565b820191906000526020600020905b8154815290600101906020018083116101dd57829003601f168201915b505050505081565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061024357805160ff1916838001178555610271565b82800160010185558215610271579182015b82811115610270578251825591602001919060010190610255565b5b50905061027e9190610282565b5090565b6102a491905b808211156102a0576000816000905550600101610288565b5090565b905600a165627a7a72305820d42766fa8542610c22334e58300eb153009d2e0061a05ec6ca89828d5a57a5650029";
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
        const expectedContractBytecode = "608060405234801561001057600080fd5b506040516020806107b28339810180604052810190808051906020019092919050505060008173ffffffffffffffffffffffffffffffffffffffff161415151561005957600080fd5b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550506106c8806100ea6000396000f30060806040526004361061006d576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063734f8482146100725780638da5cb5b1461009d578063a6c3e6b9146100f4578063bd85d8671461014b578063c163bba71461025d575b600080fd5b34801561007e57600080fd5b5061008761030c565b6040518082815260200191505060405180910390f35b3480156100a957600080fd5b506100b2610312565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561010057600080fd5b50610109610337565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561015757600080fd5b506101766004803603810190808035906020019092919050505061035d565b604051808060200180602001838103835285818151815260200191508051906020019080838360005b838110156101ba57808201518184015260208101905061019f565b50505050905090810190601f1680156101e75780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019080838360005b83811015610220578082015181840152602081019050610205565b50505050905090810190601f16801561024d5780820380516001836020036101000a031916815260200191505b5094505050505060405180910390f35b34801561026957600080fd5b5061030a600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091929192905050506104e1565b005b60025481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60608060038381548110151561036f57fe5b906000526020600020906002020160000160038481548110151561038f57fe5b9060005260206000209060020201600101818054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104355780601f1061040a57610100808354040283529160200191610435565b820191906000526020600020905b81548152906001019060200180831161041857829003601f168201915b50505050509150808054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104d15780601f106104a6576101008083540402835291602001916104d1565b820191906000526020600020905b8154815290600101906020018083116104b457829003601f168201915b5050505050905091509150915091565b6104e96105dd565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561054557600080fd5b60408051908101604052808481526020018381525090506003819080600181540180825580915050906001820390600052602060002090600202016000909192909190915060008201518160000190805190602001906105a69291906105f7565b5060208201518160010190805190602001906105c39291906105f7565b505050506001600260008282540192505081905550505050565b604080519081016040528060608152602001606081525090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061063857805160ff1916838001178555610666565b82800160010185558215610666579182015b8281111561066557825182559160200191906001019061064a565b5b5090506106739190610677565b5090565b61069991905b8082111561069557600081600090555060010161067d565b5090565b905600a165627a7a7230582072f45f6c6bd0a874a46a7a3fccaa3030ff5b2cf30fcefb10bc65ad146515a39d0029";
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
        const expectedContractBytecode = "608060405234801561001057600080fd5b50604051610ca5380380610ca583398101806040528101908080519060200190929190805182019291906020018051906020019092919050505060008373ffffffffffffffffffffffffffffffffffffffff161415151561007057600080fd5b60008111151561007f57600080fd5b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508160029080519060200190610116929190610160565b50806003819055506000600460006101000a81548160ff02191690831515021790555060006006819055506000600781905550600060088190555042600581905550505050610205565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106101a157805160ff19168380011785556101cf565b828001600101855582156101cf579182015b828111156101ce5782518255916020019190600101906101b3565b5b5090506101dc91906101e0565b5090565b61020291905b808211156101fe5760008160009055506001016101e6565b5090565b90565b610a91806102146000396000f3006080604052600436106100db576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632279fa4c146100ed578063242d7dba14610118578063387be94f146101435780633c28b9c01461016e5780633ccfd60b14610199578063638f6575146101b057806370a6c4bb146101db578063878c1484146101f25780638da5cb5b146102825780639f43ddd2146102d9578063bfb460e914610304578063d2ffca2d14610331578063ed88c68e1461035c578063f7260d3e14610366578063fc792719146103bd575b3480156100e757600080fd5b50600080fd5b3480156100f957600080fd5b506101026103ec565b6040518082815260200191505060405180910390f35b34801561012457600080fd5b5061012d6103f2565b6040518082815260200191505060405180910390f35b34801561014f57600080fd5b506101586103f8565b6040518082815260200191505060405180910390f35b34801561017a57600080fd5b506101836103fe565b6040518082815260200191505060405180910390f35b3480156101a557600080fd5b506101ae610404565b005b3480156101bc57600080fd5b506101c561055a565b6040518082815260200191505060405180910390f35b3480156101e757600080fd5b506101f0610560565b005b3480156101fe57600080fd5b506102076106c8565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561024757808201518184015260208101905061022c565b50505050905090810190601f1680156102745780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561028e57600080fd5b50610297610766565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156102e557600080fd5b506102ee61078b565b6040518082815260200191505060405180910390f35b34801561031057600080fd5b5061032f600480360381019080803590602001909291905050506107ad565b005b34801561033d57600080fd5b50610346610833565b6040518082815260200191505060405180910390f35b610364610857565b005b34801561037257600080fd5b5061037b610a2c565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156103c957600080fd5b506103d2610a52565b604051808215151515815260200191505060405180910390f35b60075481565b60085481565b60065481565b60035481565b600080600960003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205411151561045357600080fd5b600354600554014211151561046757600080fd5b60001515600460009054906101000a900460ff16151514151561048957600080fd5b600960003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490506000600960003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015610556573d6000803e3d6000fd5b5050565b60055481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156105bc57600080fd5b600654600854101515156105cf57600080fd5b60003073ffffffffffffffffffffffffffffffffffffffff16311115156105f557600080fd5b600354600554014210151561060957600080fd5b60001515600460009054906101000a900460ff16151514151561062b57600080fd5b6001600460006101000a81548160ff021916908315150217905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc3073ffffffffffffffffffffffffffffffffffffffff16319081150290604051600060405180830381858888f193505050501580156106c5573d6000803e3d6000fd5b50565b60028054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561075e5780601f106107335761010080835404028352916020019161075e565b820191906000526020600020905b81548152906001019060200180831161074157829003601f168201915b505050505081565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060055460035460055401101515156107a157fe5b60035460055401905090565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561080957600080fd5b600060065414151561081a57600080fd5b60008111151561082957600080fd5b8060068190555050565b6000600654600854111561084f57600654600854039050610854565b600090505b90565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515156108b457600080fd5b60035460055401421015156108c857600080fd5b6000341115156108d757600080fd5b6000600654141515156108e957600080fd5b60001515600460009054906101000a900460ff16151514151561090b57600080fd5b600960003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205434600960003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054011015151561099757fe5b6008543460085401101515156109a957fe5b600754600160075401101515156109bc57fe5b34600960003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550346008600082825401925050819055506001600760008282540192505081905550565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600460009054906101000a900460ff16815600a165627a7a72305820a308162adcc6bbca32172689ecbe2e7c9126fc5f1917bf0631436531f73188a50029";
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
