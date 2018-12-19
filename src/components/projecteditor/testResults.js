import React from 'react';
import Caret from '../../../src/components/caret';
import style from './style.less';
import { IconTick, IconCross } from "../icons"
import classNames from "classnames";


// TODO: FIXME: Remove padding Left of ul;
// data structure for collapsible component
var TestData = [];
var selectedTestId = null;
var totalTestDataTime = 0;

export function readSelectedTestId() {
    return selectedTestId;
}

export function readTotalTestDataTime() {
    return totalTestDataTime;
}

export function setTestData(data) {
    // TODO: FIXME: add support to "Suites" (describe)
    // TODO: FIXME: automatically iterate over all tests
    TestData = [];
    totalTestDataTime = 0;
    var uiCounter = 0;

    if(data.length <= 0) {
        //
        // Early exit in case there is no data
        return;
    } else if(typeof data === "string") {
        //
        // ... or take the input as a string message, if applicable
        TestData = data;
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

                const testEntry = {
                    uiCounter: uiCounter++,
                    id: uiCounter,
                    name: testName,
                    time: testTimeString,
                };

                //
                // Update data
                contractTotalTime += testTime;
                testEntries.push(testEntry);
            }

        }

        totalTestDataTime += contractTotalTime;

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
        TestData.push(newTest);
    }

    const totalDummyTestTime = 5*4;
    totalTestDataTime += totalDummyTestTime;

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
                    },
                    {
                        uiCounter: 103,
                        id: 5,
                        name: "has an Owner",
                        time:"4ms",
                    },
                    {
                        uiCounter: 104,
                        id: 6,
                        name: "accepts fund",
                        time:"4ms",
                    },
                    {
                        uiCounter: 105,
                        id: 7,
                        name: "Is able to pause or unpause",
                        time:"4ms",
                    },
                    {
                        uiCounter: 106,
                        id: 8,
                        name: "permits owner to receive funds",
                        time:"4ms",
                    },
                ]
            }]
        ],
    };

    //
    // Update data
    TestData.push(dummyTest);
}

export default class Test extends React.Component {
    constructor(props){
        super(props);

        this.state ={
            selected: null
        }
    }

    storeSelection = (node) => {
        selectedTestId = node.id;

        this.setState({
            selected: node.uiCounter
        });
    };

    readSelection = () => {
        return this.state.selected;
    }

    render() {
        const thisReference = this;

        var nodes;
        if(typeof TestData === "string") {
            // TODO: FIXME: reconsider feedback
            nodes = (
                <div style={{color: "white", marginLeft: "10px"}}><p>{TestData}</p></div>
            );
        } else if(TestData.length > 0) {
            // loop through the array and create a new component for each, passing the current data and its children (Test.children) as props
            nodes = TestData.map(function(data) {
                return (
                    <div key={data.id}>
                        <Node readSelection={thisReference.readSelection} storeSelection={thisReference.storeSelection} node={data} children={data.children} time={data.time} />
                    </div>
                );
            });
        } else {
            // TODO: FIXME: reconsider feedback
            nodes = (
                <div style={{color: "white", marginLeft: "10px"}}><p>Press the green Play button to start.</p></div>
            );
        }

        return (
            <div>
                <ul className="org">
                    {nodes}
                </ul>
            </div>
        );
    }
}


class Node extends React.Component {
    constructor(props){
        super(props);

        this.state ={
            open: true,
        }
    }

    changeColor=(node)=>{
        if(this.props.storeSelection) {
            this.props.storeSelection(node);
        }
    };

    render() {
        let childnodes = null;

        // the Node component calls itself if there are children
        if(this.props.children) {
            const thisReference = this;
            childnodes = this.props.children.map((childnode)=> {
                var node = childnode;
                if(!node.id) {
                    node = childnode[0];
                }
                return (
                    this.state.open &&
                    <Node key={"node_" + node.id} readSelection={thisReference.props.readSelection} storeSelection={thisReference.props.storeSelection} node={node} children={node.children} time={node.time}/>
                );
            });
        }

        // return our list element
        // display children if there are any
        const testPassed = true;
        const backgroundColorGreen = 'rgba(126, 211, 33,0.4)';
        const backgroundColorRed = 'rgba(255, 69, 92, 0.4)';
        const selectionBackgroundColor = this.props.readSelection() === this.props.node.uiCounter ? (testPassed ?  backgroundColorGreen : backgroundColorRed ) : null;
        // TODO: FIXME: inline styles should be defined elsewhere in a separate file (less)
        return (
            <span key={this.props.node.id}>
                <div className={style.testColorChange} onClick={()=>this.changeColor(this.props.node)}  style={{ border: '1px solid #252525', backgroundColor: selectionBackgroundColor}}>
                    <div>{testPassed ? <IconTick /> : <IconCross />}
                        <span className={classNames([style.testResults])}>
                            {this.props.node.name}
                        </span>
                    </div>

                    <span className={style.testTime}>
                        {this.props.time}
                    </span>
                </div>

                {
                    childnodes ?
                    <span>
                        <Caret styles={{ position: 'relative', bottom:'34px', cursor: 'pointer'}} expanded={this.state.open} onClick={()=>this.setState({open:!this.state.open})} />
                        <ul>
                            {childnodes}
                        </ul>
                    </span>
                    : null
                }
            </span>
        );
    }
}
