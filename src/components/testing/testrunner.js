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


import Mocha from '../../mocha.js';
import { CustomReporter } from "../testing/reporter";

//
// Libraries available from within test context
const ABI = require('../../ethereumjs-abi-0.6.5.min.js');
const Tx = require('../../ethereumjs-tx-1.3.3.min.js');
const TestLibrary = require("./library").default;
const utilityLibrary = new TestLibrary();


/*====================
  TestRunner

  Controls tests: initialize, start, run, ...
=====================*/
export default class TestRunner {

    constructor() {
        this._status = "";
    }

    _createAliases(contractsData) {
        // TODO: FIXME: input data error handling
        // TODO: FIXME: error checking when
        //              -  data is not valid
        //              -  data is not present
        //              -  when there are no elements
        var contracts="";
        for(var key in contractsData) {
            const contractName = key.toString();
            console.log("[TestRunner] exposing contract alias: " + contractName);
            contracts+="const " + contractName + '=contractsData["' + contractName + '"];';
        }
        return contracts;
    }

    _run(testName, testCode, contractsData, accountAddress, accountKey, web3) {
        // TODO: FIXME: revisit input data error handling
        if(!accountAddress || accountAddress === null) {
            console.error("[TestRunner] Unable to run: undefined account address");
            return;
        }

        if(!accountKey || accountKey === null) {
            console.error("[TestRunner] Unable to run: undefined account key");
            return;
        }

        console.log("[TestRunner] setting up test runner ...");
        const thisReference = this;
        const contracts = thisReference._createAliases(contractsData);

        thisReference._status="";

        //
        // Setup Mocha
        // TODO: FIXME: consider create or none instead ?
        //var suiteInstance = mocha.suite.create(mochaInstance.suite, 'Test Suite');
        // TODO: FIXME: reference error handling
        mocha.suite = mocha.suite.clone();
        mocha.setup("bdd");
        mocha.reporter(CustomReporter);

        describe("Test name: " + testName, function() {
            try {
                // TODO: FIXME: consider a better alternative for dynamically adding tests
                // Note: alternatively, could use mocha.suite.addTest(new Test ... ), given the possibility to access the inner library
                //
                // Reference:
                //   const statement="describe(\"Hello World\", function(){var contractInstance;beforeEach(function(){console.warn(\"testing...\");});it(\"testing tests\",function(){console.log(true); }); });";
                eval(contracts + testCode);
            } catch(e) {
                thisReference._status="Invalid test file. " + e;
                console.error("[TestRunner] error: ", thisReference._status);
                return;
            }
        });

        // Invoke Mocha
        mocha.checkLeaks();
        //mocha.allowUncaught();
        mocha.fullTrace();
        // TODO: FIXME: error handling
        const runner = mocha.run(function() {
            console.log("[TestRunner] test run completed!");
        });
    }

    readStatus() {
        return this._status;
    }

    runAll(testFiles, contractsData, accountAddress, accountKey, web3) {
        for(var testName in testFiles) {
            const testCode = testFiles[testName];
            this._run(testName, testCode, contractsData, accountAddress, accountKey, web3);
        }
    };

    runSingle(file, title, testFiles, contractsData, accountAddress, accountKey, web3) {
        // TODO: FIXME: add error checking
        // TODO: FIXME: consider multiple occurrences
        //              consider case (in)sensitive
        //              consider single and double quotes
        for(var testName in testFiles) {
            if(testName === file) {
                const testCode = testFiles[testName];
                const regex = new RegExp("it*.\'" + title + "\'*.,{1}");
                const replaceWith = 'it.only("' + title + '",';
                const singleTestCode = testCode.replace(regex, replaceWith);

                this._run(testName, singleTestCode, contractsData, accountAddress, accountKey, web3);
                return;
            }
        }
    };
}
