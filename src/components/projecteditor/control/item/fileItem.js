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

import Item from './item';
import {
    IconTrash,
    IconGem,
    IconFile,
    IconFolder,
    IconFolderOpen,
    IconCube,
    IconConfigure,
    IconCompile,
    IconDeploy,
    IconClone,
    IconInteract,
    IconContract,
    IconAddContract,
    IconHtml,
    IconJS,
    IconCss,
    IconMd,
    IconShowPreview,
    IconMosaic,
} from '../../../icons';
import style from '../style';

export default class FileItem extends Item {
    constructor(props, router) {
        props.state = props.state || {};
        props.type = props.type || "file";
        props.lazy = (props.lazy === undefined) ? true : props.lazy;
        props.toggable = (props.toggable === undefined) ? (props.type == "folder") : props.toggable;
        props.state.open = (props.state.open === undefined) ? true : props.state.open;
        super(props, router);
        if (props.type == "folder") {
            props.state.children = (props.state.children === undefined ? this._renderChildren : props.state.children);
        }
        props.render = props.render || this._renderFileTitle;
    }

    getFile = () => {
        return this.props.state.file;
    };

    getPath = () => {
        return this.props.state.path;
    };

    getFullPath = () => {
        return this.props.state.fullpath;
    };

    /**
     * Load the contents of the file.
     * @param cb: callback
     * @param reload: force a reload of the data
     * @param stealth: if set then do not count this
     *
     */
    load = (cb) => {
        var project = this.getProject();
        project.loadFile(this.getFullPath(), (body) => {
            cb(body);
        });
        // TODO return Promise
    };

    /**
     * Save the contents of the file.
     * @param cb: callback
     * @param reload: force a reload of the data
     * @param stealth: if set then do not count this
     *
     */
    save = (body, cb) => {
        var project = this.getProject();
        project.saveFile(this.getFullPath(), body, cb);
    };

    /**
     * Rename the file in storage.
     *
     */
    rename = (newname, cb) => {
        var project = this.getProject();
        project.renameFile(this.getFullPath(), newname, cb);
    };

    /**
     * Delete the file in storage.
     *
     */
    del = (cb) => {
        var project = this.getProject();
        project.deleteFile(this.getFullPath(), newname, cb);
    };

    /**
     * Close the open file.
     *
     */
    close = (cb) => {
        var project = this.getProject();
        project.closeFile(this.getFullPath(), newname, cb);
    };

    _renderFileTitle = (level, index) => {
        var projectItem=this.getProject();
        if (this.getType() == "file") {
            return (<div class={style.projectContractsTitleContainer} onClick={(e)=>this._openItem(e, item)}>
                <div class={style.title}>
                    <a title={item.getTitle()} href="#">
                        {item.getTitle()}
                    </a>
                </div>
                <div class={style.buttons}>
                    <a href="#" title="Rename file" onClick={(e)=>{this._clickRenameFile(e, item);}}>
                        <IconClone />
                    </a>
                    <a href="#" title="Delete file" onClick={(e)=>{this._clickDeleteFile(e, item);}}>
                        <IconTrash />
                    </a>
                </div>
            </div>);
        }
        else if(this.getType() == "folder") {
            return (<div class={style.projectContractsTitleContainer} onClick={(e)=>this._angleClicked(e, item)}>
                <div class={style.title} title={item.getTitle()}>
                    <a href="#">{item.getTitle()}</a>
                </div>
                <div class={style.buttons}>
                    <a href="#" title="New..." onClick={(e)=>{this._clickNewFile(e, item);}}>
                        <IconFile />
                    </a>
                    {item.props.state.fullpath != "/" &&
                    <div style="display: inline;">
                        <a href="#" title="Rename directory" onClick={(e)=>{this._clickRenameFile(e, item);}}>
                            <IconClone />
                        </a>
                        <a href="#" title="Delete directory" onClick={(e)=>{this._clickDeleteFile(e, item);}}>
                            <IconTrash />
                        </a>
                    </div>
                    }
                </div>
            </div>);
        }
    };

    _renderChildren = (cb) => {
        console.log("render children", this);
        if (this.getType() == 'folder') {
            const project = this.getProject();
            const path = this.getFullPath();
            project.listFiles(path, (status, list) => {
                console.log(list);
                if (status == 0) {
                    const children=[];
                    list.map( (file) => {
                        if (file.type == "d") {
                            const fullpath = this.getFullPath() + file.name + '/';
                            var render = this._renderFileTitle;
                            //if (fullpath == "/app/") {
                                //render = this._renderApplicationSectionTitle;
                            //}
                            //if (this.props.filter) {
                                //render = this.
                            //}
                            children.push(new FileItem({
                                type: "folder",
                                key: fullpath,
                                render: render,
                                state: {
                                    open: false,
                                    title: file.name,
                                    file: file.name,
                                    path: path,
                                    fullpath: fullpath,
                                    project: this.getProject(),
                                }
                            }, this.router));
                        }
                        else if(file.type=="f") {
                            const fullpath = this.getFullPath() + file.name;
                            var icon = <IconFile />;
                            var type2 = "file";
                            var state = {};
                            var toggable = false;
                            //var a = fullpath.match(".*[.](.+)$");
                            //if(a) {
                                //const suffix=a[1].toLowerCase();
                                //switch (suffix) {
                                    //case 'html':
                                        //type2 = 'html';
                                        //icon = <IconHtml />;
                                        //break
                                    //case 'css':
                                        //type2 = 'css';
                                        //icon = <IconCss />;
                                        //break
                                    //case 'js':
                                        //type2 = 'js';
                                        //icon = <IconJS />;
                                        //break
                                    //case 'md':
                                        //type2 = 'md';
                                        //icon = <IconMd />;
                                        //break
                                    //case 'sol':
                                        //type2 = 'contract';
                                        //icon = <IconContract />;
                                        //toggable = true;
                                        //state = {
                                            //_tag: 0,
                                            //open: false,
                                            //children: [
                                                //new FileItem({
                                                    //type: "contract",
                                                    //type2: "configure",
                                                    //onClick: this.openContractItem,
                                                    //icon: <IconConfigure />,
                                                    //state: {
                                                        //title: "Configure",
                                                        //project: item.props.state.project,
                                                        //file: file.name,
                                                        //path: path,
                                                        //fullpath: fullpath,
                                                        //_tag: 1
                                                    //}
                                                //})
                                            //]
                                        //};
                                        //break
                                //}
                            //}
                            state.title = file.name;
                            state.file = file.name;
                            state.path = path;
                            state.fullpath = fullpath;
                            state.project = this.getProject();
                            children.push(new FileItem({
                                type: "file",
                                type2: type2,
                                key: fullpath,
                                icon: icon,
                                onClick: this._openItem,
                                toggable: toggable,
                                state: state
                            }, this.router));
                        }
                    });
                    console.log("children", children);
                    this._copyState(children, this.props.state._children || []);
                    this.props.state._children=children;
                    if (cb) cb();
                    return;
                }
            });
        }
        else {
            if (cb) cb();
        }
    };
}
