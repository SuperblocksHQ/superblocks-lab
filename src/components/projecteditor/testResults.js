import React from 'react';
import Caret from '../../../src/components/caret';
import style from './style.less';
import { IconTick, IconCross } from "../icons"
import classNames from "classnames";
// data structure for collapsible component
const TestData = [
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
export default class Test extends React.Component {
    render() {
        // loop through the persons array and create a new component for each, passing the current person (id and name) and it's children (person.people) as props

        let nodes = TestData.map(function(person) {
            return (
                <div>
                <Node class={style.testColorChange} node={person} children={person.children} time={person.time} />
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

    render() {
        let childnodes = null;
        // the Node component calls itself if there are children
        if(this.props.children) {
            childnodes = this.props.children.map((childnode)=> {
                return (
                    this.state.open &&
                <div><Node node={childnode} children={childnode.children} time={childnode.time}/>
                </div>

                );
            });
        }
        // return our list element
        // display children if there are any
        const testPassed = true;
        return (
            <span key={this.props.node.id}>
                <div class={style.testColorChange}>
                    <div>{testPassed ? <IconTick /> : <IconCross />}<span className={classNames([style.testResults])}>{this.props.node.name}</span>
                    </div>
                        <span class={style.testTime}> {this.props.time} </span></div>
                { childnodes ?
                    <span><Caret expanded={this.state.open} onClick={()=>this.setState({open:!this.state.open})} /><ul>{childnodes}</ul></span>
                    : null }
            </span>
        );
    }
}
