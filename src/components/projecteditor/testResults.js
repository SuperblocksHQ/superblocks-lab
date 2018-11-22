import React from 'react';
import Caret from '../../../src/components/caret';
import style from './style.less';
import { IconTick, IconCross } from "../icons"
import classNames from "classnames";


// TODO: FIXME: Remove padding Left of ul;
// data structure for collapsible component
var TestData = [];

export function setTestData(data) {
    // TODO: FIXME: add support to "Suites" (describe)
    // TODO: FIXME: automatically iterate over all tests

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


    const contractTotalTimeString = contractTotalTime + " ms";

    const testTotalTime = contractTotalTime;
    const testTotalTimeString = contractTotalTime + " ms";

    const newTest = {
        id: -1,
        name: testFileName,
        time: testTotalTimeString,
        children: [
            [{
                id: -1,
                name: contractName,
                time: contractTotalTimeString,
                children: testEntries
            }]
        ]
    };
    TestData.push(newTest);

    const totalDummyTestTime = 5*4;
    const totalDummyTestTimeString = totalDummyTestTime + " ms";
    const dummyTest = {
        id: 1,
        name: "/test/contract.js",
        time: totalDummyTestTimeString,
        children: [
            [{
                id: 3,
                name: "FundRaise",
                time: totalDummyTestTimeString,
                children: [
                    {
                        id: 4,
                        name: "has an Owner",
                        time:"4ms",
                    },
                    {
                        id: 5,
                        name: "has an Owner",
                        time:"4ms",
                    },
                    {
                        id: 6,
                        name: "accepts fund",
                        time:"4ms",
                    },
                    {
                        id: 5,
                        name: "Is able to pause or unpause",
                        time:"4ms",
                    },
                    {
                        id: 5,
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
    render() {

        // loop through the array and create a new component for each, passing the current data and its children (Test.children) as props
        let nodes = TestData.map(function(data) {
            return (
                <div>
                    <Node node={data} children={data.children} time={data.time} />
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
            selected: null
        }
    }

    changeColor=(node)=>{
        this.setState({selected: node.id})
    };

    render() {
        let childnodes = null;

        // the Node component calls itself if there are children
        if(this.props.children) {
            childnodes = this.props.children.map((childnode)=> {
                return (
                    this.state.open &&
                    <Node node={childnode} children={childnode.children} time={childnode.time}/>
                );
            });
        }

        // return our list element
        // display children if there are any
        const testPassed = true;
        const backgroundColorGreen = 'rgba(126, 211, 33,0.4)';
        const backgroundColorRed = 'rgba(255, 69, 92, 0.4)';
        const selectionBackgroundColor = this.state.selected ? (testPassed ?  backgroundColorGreen : backgroundColorRed ) : null;
        return (
            <span key={this.props.node.id}>
                <div class={style.testColorChange} onClick={()=>this.changeColor(this.props.node)}  style={{ border: '1px solid #252525', backgroundColor: selectionBackgroundColor}}>
                    <div>{testPassed ? <IconTick /> : <IconCross />}
                        <span className={classNames([style.testResults])}>
                            {this.props.node.name}
                        </span>
                    </div>

                    <span class={style.testTime}>
                        {this.props.time}
                    </span>
                </div>

                {
                    childnodes ?
                    <span>
                        <Caret styles={{ position: 'relative', bottom:'34px'}} expanded={this.state.open} onClick={()=>this.setState({open:!this.state.open})} />
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
