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

import { h, Component } from 'preact';
import classnames from 'classnames';
import style from './style';
import Templates from '../templates';
import Modal from '../modal';

export default class DevkitNewDapp extends Component {
    constructor(props) {
        super(props);
        this.setState({projectTemplate:"HelloWorld"});
        this.setState({
            projectName: "",
            projectTitle: "",
            projectGitUrl: ""
        });
        this.templates=new Templates();
        this.props.modal.cancel=this.props.modal.cancel||this.cancel;
    }

    add = (evt, dappfileJSONObj) => {
        if(evt) evt.preventDefault();
        var title=this.state.projectTitle;
        if(dappfileJSONObj) {
            // We assume it's validity is checked already.
            title=dappfileJSONObj.dappfile.project.info.title;
        }
        var project=this.state.projectName;
        if(project=="") {
            alert("Please give the project a name.");
            return;
        }
        if(!project.match(/^([a-zA-Z0-9-]+)$/)) {
            alert('Illegal projectname. Only A-Za-z0-9 and dash (-) allowed.');
            return;
        }
        if(title=="") {
            alert("Please give the project a snappy title.");
            return;
        }
        if(title.match(/([\"\']+)/)) {
            alert('Illegal title. No special characters allowed.');
            return;
        }
        if(project.length>20 || title.length>30) {
            return;
        }
        const cb=(status, code) => {
            if(this.props.cb) {
                const index=this.props.functions.modal.getCurrentIndex();
                if(this.props.cb(status, code) !== false) this.props.functions.modal.close(index);
            }
            else {
                this.props.functions.modal.close();
            }
        };
        if(dappfileJSONObj) {
            this.props.backend.saveProject(project, {dappfile:dappfileJSONObj.dappfile}, (o)=>{cb(o.status,o.code)}, true, dappfileJSONObj.files)
        }
        else if(this.state.projectTemplate=="blank") {
            const tpl=Templates.tplBlank(project, title);
            const dappfile=tpl[0];
            const files=tpl[1];
            this.props.backend.saveProject(project, {dappfile:dappfile}, (o)=>{cb(o.status,o.code)}, true, files)
        }
        else if(this.state.projectTemplate=="HelloWorld") {
            const tpl=Templates.tplHelloWorld(project, title);
            const dappfile=tpl[0];
            const files=tpl[1];
            this.props.backend.saveProject(project, {dappfile:dappfile}, (o)=>{cb(o.status,o.code)}, true, files)
        }
        else if(this.state.projectTemplate=="RaiseToSummon") {
            const tpl=Templates.tplRaiseToSummon(project, title);
            const dappfile=tpl[0];
            const files=tpl[1];
            this.props.backend.saveProject(project, {dappfile:dappfile}, (o)=>{cb(o.status,o.code)}, true, files)
        }
        else if(this.state.projectTemplate=="NewsFeed") {
            const tpl=Templates.tplNewsFeed(project, title);
            const dappfile=tpl[0];
            const files=tpl[1];
            this.props.backend.saveProject(project, {dappfile:dappfile}, (o)=>{cb(o.status,o.code)}, true, files)
        }
        else {
            cb(1, 1);
        }
    };

    import = (evt) => {
        evt.preventDefault();
        var project=this.state.projectName;
        if(project=="") {
            alert("Please give the project a name.");
            return;
        }
        if(!project.match(/^([a-zA-Z0-9-]+)$/)) {
            alert('Illegal projectname. Only A-Za-z0-9 and dash (-) allowed.');
            return;
        }
        var contentJSON="";
        const ok=(e)=>{
            e.preventDefault();
            if(!contentJSON) {
                alert("No JSON provided. Paste it into the text area and try again.");
                return;
            }
            var dappfileJSONObj;
            try {
                dappfileJSONObj=JSON.parse(contentJSON);
            }
            catch(e) {
                alert("Could not parse JSON, is it properly pasted?");
                return;
            }
            console.log("import", dappfileJSONObj);
            // TODO: FIXME: validate the object.
            this.add(null, dappfileJSONObj);
            this.props.functions.modal.close();
        };
        const handleContentChange=(e)=> {
            contentJSON=e.target.value;
        };
        const body=(
            <div>
                <p>Paste your DAppfile.json contents below and press 'Import'.</p>
                <div><textarea id="dappfilejsonimport" name="" onChange={handleContentChange} style="width:100%;height:200px;"></textarea></div>
                <div style="margin-top: 10px;">
                    <a class="btn2" style="float: left; margin-right: 30px;" onClick={this.props.functions.modal.cancel}>Cancel</a>
                    <a class="btn2 filled" style="float: left;" onClick={ok}>Import</a>
                </div>
            </div>
        );
        const modalData={
            title: "Import DAppfile.json",
            body: body,
            style: {"text-align":"center",height:"400px"},
        };
        const modal=(<Modal data={modalData} />);
        this.props.functions.modal.show({render: () => {return modal;}});
    }

    handleNameChange = changeEvent => {
        this.setState({
            projectName: changeEvent.target.value
        });
    }

    handleTitleChange = changeEvent => {
        this.setState({
            projectTitle: changeEvent.target.value
        });
    };

    handleGitUrlChange = changeEvent => {
        this.setState({
            projectGitUrl: changeEvent.target.value
        });
    };

    handleTemplateChange = changeEvent => {
        changeEvent.preventDefault();
        // It can't be in the same cycle???
        setTimeout(()=>{this.setState({projectTemplate:changeEvent.target.value})},1);
    };

    cancel = () => {
    };

    render() {
        const cls={};
        const clsnew=style.newDapp;
        cls[clsnew]=true;
        return (
            <div className={classnames(cls)}>
                <div class={style.footer}>
                    <a onClick={this.props.functions.modal.cancel} class="btn2" style="float: left; margin-right: 30px;" href="#">Cancel</a>
                    <a onClick={this.add} class="btn2 filled" style="float: left;"  href="#">Create</a>
                    <a onClick={this.import} class="" style="float: right;margin-top: 20px;margin-right: 10px;" href="#">Import DAppfile.json...</a>
                </div>
                <div class={style.area}>
                    <div class={style.form}>
                        <p>
                            You are about to create a DApp - a Decentralized Application.
                        </p>
                        <p>
                            A DApp has two parts:
                            <ul>
                                <li>The Smart Contracts making up the "back-end" of the DApp.</li>
                                <li>The front-end web application running in the users browser.</li>
                            </ul>
                        </p>
                        <p>
                            In Superblocks Studio you can create your full DApp, deploy the contracts and then export the html source to be served as you wish, it's aiming to be the full experience!

                        </p>
                        <div class={style.info}>
                                <div>
                                    <div class={style.input}>
                                        <p>Project name: </p><input type="text"
                                                        maxLength="20"
                                                        value={this.state.projectName}
                                                        onChange={this.handleNameChange}
                                                        />
                                    </div>
                                    <div class={style.input}>
                                        <p>DApp (HTML) Title: </p><input type="text"
                                                        maxLength="30"
                                                        value={this.state.projectTitle}
                                                        onChange={this.handleTitleChange}
                                                        />
                                    </div>
                                </div>
                            <p>
                                Choose a template to start out with:
                            </p>
                            <ul>
                                <li>
                                    <label>
                                        <input checked={this.state.projectTemplate=="HelloWorld"} value="HelloWorld" onClick={this.handleTemplateChange} type="radio" /> HelloWorld - Simple starter DApp
                                    </label>
                                </li>
                                <li>
                                    <label>
                                        <input checked={this.state.projectTemplate=="NewsFeed"} value="NewsFeed" onClick={this.handleTemplateChange} type="radio" /> Uncensorable News Feed - Publish news that nobody can remove
                                    </label>
                                </li>
                                <li>
                                    <label>
                                        <input checked={this.state.projectTemplate=="RaiseToSummon"} value="RaiseToSummon" onClick={this.handleTemplateChange} type="radio" /> Raise to Summon - Raise Funds to Summon a V.I.P. to your meetup
                                    </label>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
