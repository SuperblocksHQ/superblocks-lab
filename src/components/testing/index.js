import React from 'react';
import Caret from '../../../src/components/caret';
import style from './../projecteditor/style.less'; // TODO: FIXME: move test-specific style to ./style.less
import classNames from "classnames";
import { IconClose, IconTest, IconPlay, IconStop, IconRun, IconTick, IconCross } from '../icons';
import { testRunnerBridge } from "../testing/bridge";

export const ConsoleTopBar =(props)=>
{
    return(
        <div className={style.consoleTopBar}>
            <span className={style.testBar}>
                <IconTest className={style.icon}  />
                <span className={style.testText}>
                    Tests
                </span>
            </span>
            <div className={style.closeIcon}>
                <button className="btnNoBg">
                    <IconClose className={style.closeIcon} onClick={props.closeTestPanel} />
                </button>
            </div>
        </div>
    );
}

export const TestControls =(props)=>{
    return(
        <div className={style.testControls}>
            <span className={style.icons}>
                <div>
                    <button className="btnNoBg" title="Run" onClick={props.onClickPlay}>
                        <IconPlay className={style.iconPlay} />
                    </button>
                </div>
                <div>
                    <button className="btnNoBg" title="Refresh" onClick={props.onClickRetry}>
                        <IconRun  />
                    </button>
                </div>
                <div className={style.buttons}>
                    <button className="btnNoBg" title="Stop" onClick={
                        () => {
                            {
                                // TODO: FIXME: being used as a way to debug data
                                // TODO: FIXME: remove debugging code
                                console.warn(testRunnerBridge.readData());
                            }
                        }
                    }>
                        <IconStop />
                    </button>
                </div>
            </span>
        </div>
    );
};

export const TestFilesHeader =(props)=>{
    const { total, totalDone, time } = props;
    return(
        <div className={style.testFile }>
            <span className={style.bartext}>
                Done {totalDone} of {total} tests
            </span>
            <span>
                {time}
            </span>
        </div>
    );
};


// TODO: FIXME: Remove padding Left of ul;
// data structure for collapsible component

export default class Test extends React.Component {
    constructor(props){
        super(props);

        this.state ={
            selected: null
        }
    }

    storeSelection = (node) => {
        testRunnerBridge.setSelectedTestId(node.id);

        this.setState({
            selected: node.uiCounter
        });
    };

    readSelection = () => {
        return this.state.selected;
    }

    render() {
        const thisReference = this;
        const testData = testRunnerBridge.readTestData();

        var nodes;
        if(typeof testData === "string") {
            // TODO: FIXME: reconsider feedback
            nodes = (
                <div style={{color: "white", marginLeft: "10px"}}><p>{testData}</p></div>
            );
        } else if(testData.length > 0) {
            // loop through the array and create a new component for each, passing the current data and its children (Test.children) as props
            nodes = testData.map(function(data) {
                return (
                    <div key={data.id}>
                        <Node readSelection={thisReference.readSelection} storeSelection={thisReference.storeSelection} node={data} children={data.children} time={data.time} />
                    </div>
                );
            });
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

        //
        // Set test state flag
        var testPassed = false;
        const testState = this.props.node.state;
        if(testState === "passed" || testState !== "failed") {
            testPassed = true;
        }

        // the Node component calls itself if there are children
        if(this.props.children) {
            const thisReference = this;
            childnodes = this.props.children.map((childnode)=> {
                var node = childnode;
                if(!node.id) {
                    node = childnode[0];
                }

                // Invalid outter Node group on failure
                if(node.state === "failed") {
                    testPassed = false;
                }

                return (
                    this.state.open &&
                    <Node key={"node_" + node.id} readSelection={thisReference.props.readSelection} storeSelection={thisReference.props.storeSelection} node={node} children={node.children} time={node.time}/>
                );
            });
        }

        // return our list element
        // display children if there are any

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
