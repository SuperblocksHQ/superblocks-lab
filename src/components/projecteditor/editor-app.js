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

import React, { Component } from 'react';
import style from './style-editor-contract.less';
import Backend from './control/backend';

export default class AppEditor extends Component {
    constructor(props) {
        super(props);
        this.backend = new Backend();
        this.id = props.id + '_editor';
        this.props.parent.childComponent = this;

        this.setState({
            form: {
                title: this.props.item.getProject().getTitle(),
                name: this.props.item.getProject().getName(),
            },
            isDirty: false,
        });
    }

    componentWillReceiveProps(props) {}

    componentDidMount() {}

    redraw = () => {
        this.setState();
    };

    focus = rePerform => {};

    canClose = (cb, silent) => {
        if (this.state.isDirty && !silent) {
            const flag = confirm(
                'There is unsaved data. Do you want to close tab and loose the changes?'
            );
            cb(flag ? 0 : 1);
            return;
        }
        cb(0);
    };

    save = e => {
        e.preventDefault();
        if (this.state.form.title.length == 0) {
            alert('Please give the project a snappy title.');
            return false;
        }
        if (!this.state.form.name.match(/^([a-zA-Z0-9-]+)$/)) {
            alert(
                'Illegal projectname. Only A-Za-z0-9 and dash (-) allowed. Max 30 characters.'
            );
            return false;
        }
        this.props.item.getProject().setName(this.state.form.name);
        this.props.item.getProject().setTitle(this.state.form.title);
        this.props.item
            .getProject()
            .saveDappfile()
            .then(() => {
                this.setState({ isDirty: false });
                this.props.router.control.redrawMain(true);
            });
    };

    onChange = (e, key) => {
        var value = e.target.value;
        const form = this.state.form;
        form[key] = value;
        this.setState({ isDirty: true, form: form });
    };

    render() {
        return (
            <div id={this.id} class={style.main}>
                <div class="scrollable-y" id={this.id + '_scrollable'}>
                    <div class={style.inner}>
                        <h1 class={style.title}>Edit DApp Configuration</h1>
                        <div class={style.form}>
                            <form action="">
                                <div class={style.field}>
                                    <p>Name:</p>
                                    <input
                                        maxLength="30"
                                        type="text"
                                        value={this.state.form.name}
                                        onKeyUp={e => {
                                            this.onChange(e, 'name');
                                        }}
                                        onChange={e => {
                                            this.onChange(e, 'name');
                                        }}
                                    />
                                </div>
                                <div class={style.field}>
                                    <p>Title:</p>
                                    <input
                                        maxLength="100"
                                        type="text"
                                        value={this.state.form.title}
                                        onKeyUp={e => {
                                            this.onChange(e, 'title');
                                        }}
                                        onChange={e => {
                                            this.onChange(e, 'title');
                                        }}
                                    />
                                </div>
                                <button
                                    href="#"
                                    class="btn2"
                                    disabled={!this.state.isDirty}
                                    onClick={this.save}
                                >
                                    Save
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
