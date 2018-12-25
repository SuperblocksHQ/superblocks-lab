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


/*====================
  Test data

  Keep track of tests
====================*/
var testData={};
function registerTestSuite(key, suite) {
    if(key === null) {
        console.error("Unable to register test suite with null key.");
        return;
    }

    if(testData && suite) {
        if(testData[key] === undefined) {
            testData[key] = suite;
        } else {
            console.warn("Skipping registration for test suite entry. Key already exists: " + key);
            return;
        }
    } else {
        console.error("Unexpected failure: unable to access test suite data. testData: ", testData, " suite: ", suite);
        return;
    }
}

/*====================
  Latest test data

  Keep track of statistics
====================*/
var successCount;
var failureCount;
var totalTestCount;
var reporterStatus;

//
// Initial state is reset
dataReset();

//
// Cleanup data
function dataReset() {
    testData={};
    successCount=0;
    failureCount=0;
    totalTestCount=0;
    reporterStatus="";
}

function dataIncrementSuccess() {
    successCount++;
    console.log("[TestRunner] increased success counter: " + successCount);
}

function dataIncrementFailure() {
    failureCount++;
    console.log("[TestRunner] increased failure counter: " + failureCount);
}

function dataAddTotalTestCount(count) {
    totalTestCount += count;
}

export function readReportOutput() {
    return testData;
}

export function readReportSuccesses() {
    return successCount;
}

export function readReportFailures() {
    return failureCount;
}

export function readTotalTestCount() {
    return totalTestCount;
}

export function readReporterStatus() {
    return reporterStatus;
}

export function CustomReporter(runner) {
    runner.on("suite", function(suite){
        if(suite) {
            const parentReference = suite.parent;
            if(parentReference && parentReference.title) {
                const splitTitle = parentReference.title.split(": ");

                //
                // Extract title
                if(splitTitle[0] === "Test name") {
                    const key = splitTitle[1];

                    //
                    // Register test suite
                    const suiteTests = suite.tests;
                    if(suiteTests) {
                        const suiteLength = suiteTests.length;
                        if(key && suiteLength > 0) {
                            dataAddTotalTestCount(suiteLength);
                            console.log("[TestRunner] suite \"" + suite.title + "\" total test count: " + readTotalTestCount());
                            for(var i=0; i<suiteLength; i++) {
                                registerTestSuite(key, suite);
                            }
                        }
                    }
                } else {
                    console.error("Unexpected error. Parent reference title is not a valid test group: " + parentReference.title);
                }
            }
        }
    });

    runner.on("pass", function(test){
        if(test) {
            dataIncrementSuccess();
        }
    });

    runner.on("fail", function(test, error){
        if(test) {
            if(error) {
                console.error(error);
                dataIncrementFailure();

                var stack = null;
                const errorStack = error.stack;
                if(errorStack) {
                    stack = errorStack.split("\n").map(
                        function(line){
                            return line.trim();
                        }
                    );
                }

                var generatedError = null;
                if(stack !== null && stack[1]) {
                    generatedError = stack[1].split("<anonymous>:")[1];
                }

                if(generatedError !== null){
                    var reason = "unknown";
                    if(stack[0]) {
                        reason = stack[0].split("Error: ")[1];
                    }

                    const line=generatedError.split(":")[0];
                    const column=generatedError.split(":")[1].split(")")[0];
                    const errorOutput="Failure in line " + line + " column " + column + ". Reason: " + reason;

                    console.error(errorOutput);
                    reporterStatus = errorOutput;
                } else {
                    reporterStatus = error;
                }
            } else {
                console.error("Unexpected error data on failure. Test: ", test, " Error: ", error);
            }
        }
    });

    runner.on("start", function(){
        dataReset();
    });

    runner.on("end", function(){
        console.log("[TestRunner] ended test run with status: ", successCount, failureCount, testData);
        return successCount, failureCount, testData
    });

    // TODO:
    // control other events here
    //
    //start: Execution started
    //suite: Test suite execution started
    //suite end: All tests (and sub-suites) have finished
    //test: Test execution started
    //test end: Test completed
    //hook: Hook execution started
    //hook end: Hook complete
    //pending: Test pending
}
