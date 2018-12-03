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
    const testFileName = "/test/HelloWorld.js";
    var contractName;
    var contractTotalTime = 0;
    var testEntries = [];
    for(var i=0; i<data.length; i++) {

        //
        // Take into account empty parent means this is a new contract node
        if(data[i].parent && data[i].parent.title === "") {
            contractName = data[i].title.split(":")[1];
        } else {

            //
            // Considers duration to be a condition that is only
            // present for tests (not suites or describe)
            if(data[i] && data[i].duration !== undefined) {
                const testId = i;
                const testName = data[testId].title;
                const testTime = data[testId].duration;
                const testTimeString = testTime + " ms";

                const testEntry = {
                    uiCounter: uiCounter++,
                    id: testId,
                    name: testName,
                    time: testTimeString,
                };

                //
                // Update data
                contractTotalTime += testTime;
                testEntries.push(testEntry);
            }
        }
    }

    totalTestDataTime += contractTotalTime;

    const contractTotalTimeString = contractTotalTime + " ms";

    const testTotalTime = contractTotalTime;
    const testTotalTimeString = contractTotalTime + " ms";

    const newTest = {
        uiCounter: uiCounter++,
        id: -2,
        name: testFileName,
        time: testTotalTimeString,
        children: [
            [{
                uiCounter: uiCounter++,
                id: -1,
                name: contractName,
                time: contractTotalTimeString,
                children: testEntries
            }]
        ]
    };
    TestData.push(newTest);

    const totalDummyTestTime = 5*4;
    totalTestDataTime += totalDummyTestTime;

    const totalDummyTestTimeString = totalDummyTestTime + " ms";
    const dummyTest = {
        uiCounter: 100,
        id: 1,
        name: "/test/contract.js",
        time: totalDummyTestTimeString,
        children: [
            [{
                uiCounter: 101,
                id: 3,
                name: "FundRaise",
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

        // loop through the array and create a new component for each, passing the current data and its children (Test.children) as props
        let nodes = TestData.map(function(data) {
            return (
                <div key={data.id}>
                    <Node readSelection={thisReference.readSelection} storeSelection={thisReference.storeSelection} node={data} children={data.children} time={data.time} />
                </div>
            );
        });

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
                return (
                    this.state.open &&
                    <Node key={"node_" + childnode.id} readSelection={thisReference.props.readSelection} storeSelection={thisReference.props.storeSelection} node={childnode} children={childnode.children} time={childnode.time}/>
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
