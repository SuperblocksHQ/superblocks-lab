import React from 'react';
import Caret from '../../../src/components/caret';
import style from './style.less';
import { IconTick, IconCross } from "../icons"
import classNames from "classnames";


// TODO: FIXME: Remove padding Left of ul;
// data structure for collapsible component
var TestData = [];

export function setTestData() {
    TestData = [
        {
            id: 1,
                name: "/test/contract.js",
                time:"10ms",
                children: [
                    [{
                        id: 3,
                        name: "FundRaise",
                        time:"4ms",
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
        },
        {
            id: 1,
            name: "/test/contract.js",
            time:"4ms",
            children: [
                [{
                    id: 3,
                    name: "FundRaise",
                    time:"4ms",
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
        }
    ];
}

export default class Test extends React.Component {
    render() {
        // loop through the persons array and create a new component for each, passing the current person (id and name) and it's children (Test.children) as props

        let nodes = TestData.map(function(person) {
            return (
                <div>
                <Node node={person} children={person.children} time={person.time} />
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
                    <div>{testPassed ? <IconTick /> : <IconCross />}<span className={classNames([style.testResults])}>{this.props.node.name}</span>
                    </div>
                        <span class={style.testTime}> {this.props.time} </span></div>
                { childnodes ?
                    <span><Caret styles={{ position: 'relative', bottom:'34px'}} expanded={this.state.open} onClick={()=>this.setState({open:!this.state.open})} /><ul>{childnodes}</ul></span>
                    : null }
            </span>
        );
    }
}
