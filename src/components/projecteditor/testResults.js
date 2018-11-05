import React from 'react';
import Caret from '../../../src/components/caret';
import style from './style.less';
import { IconTick, IconCross } from "../icons"
// data structure for collapsible component
const people = [
    {
    id: 1,
    name: "/test/contract.js",
    people: [
        [{
            id: 3,
            name: "FundRaise",
            people: [
                        {
                            id: 4,
                            name: "has an Owner"
                        },
                        {

                            id: 5,
                            name: "has an Owner"
                        },
                        {
                            id: 6,
                            name: "accepts fund"
                        },
                        {

                            id: 5,
                            name: "Is able to pause or unpause"
                        },
                        {

                            id: 5,
                            name: "permits owner to receive funds"
                        },

            ]
        }]
],
},
    {
        id: 1,
        name: "/test/contract.js",
        people: [
            [{
                id: 3,
                name: "FundRaise",
                people: [

                    {

                        id: 4,
                        name: "has an Owner"
                    },
                    {

                        id: 5,
                        name: "has an Owner"
                    },
                    {
                        id: 6,
                        name: "accepts fund"
                    },
                    {

                        id: 5,
                        name: "Is able to pause or unpause"
                    },
                    {

                        id: 5,
                        name: "permits owner to receive funds"
                    },

                ]
            }]
        ],
    }
];
export default class Test extends React.Component {
    render() {
        // loop through the persons array and create a new component for each, passing the current person (id and name) and it's children (person.people) as props

        let nodes = people.map(function(person) {
            return (
                <Node node={person} children={person.people} />
            );
        });

        return (
            <div>
                <ul className="org" style={{color:'#fff'}}>
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
                <div><Node node={childnode} children={childnode.people}/><br/></div>

                );
            });
        }
        // return our list element
        // display children if there are any
        const testPassed = true;
        return (
            <span key={this.props.node.id}>
                {testPassed ? <IconTick /> : <IconCross />} <span class={style.testResults}>{this.props.node.name}</span>
                { childnodes ?
                    <span><Caret expanded={this.state.open} onClick={()=>this.setState({open:!this.state.open})} /><ul>{childnodes}</ul></span>
                    : null }
            </span>
        );
    }
}
