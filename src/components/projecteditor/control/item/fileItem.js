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
        props.state.toggable = (props.state.toggable === undefined) ? (props.type == "folder") : props.state.toggable;
        props.state.open = (props.state.open === undefined) ? true : props.state.open;
        props.state.readonly = props.state.readonly===undefined ? true : props.state.readonly;
        super(props, router);
        if (props.type == "folder") {
            props.state.children = (props.state.children === undefined ? this._renderChildren : props.state.children);
        }
        props.state.isSaved = true;
        props.state.contents = "";
        props.state.savedContents = "";
        props.render = props.render || this._renderFileTitle;

        if (props.type == 'file') {
            var icon = <IconFile />;
            var type2 = "file";
            var a = (props.state.file || "").match(".*[.](.+)$");
            if(a) {
                const suffix = a[1].toLowerCase();
                switch (suffix) {
                    case 'html':
                        type2 = 'html';
                        icon = <IconHtml />;
                        break
                    case 'css':
                        type2 = 'css';
                        icon = <IconCss />;
                        break
                    case 'js':
                        type2 = 'js';
                        icon = <IconJS />;
                        break
                    case 'md':
                        type2 = 'md';
                        icon = <IconMd />;
                        break
                    case 'sol':
                        type2 = 'contract';
                        icon = <IconContract />;
                        break
                }
            }
            props.type2 = props.type2 || type2;
            props.icon = props.icon || icon;
        }
    }

    /**
     * Return the file/dir name.
     */
    getFile = () => {
        return this.props.state.file;
    };

    /**
     * Return the full path of the file/dir.
     */
    getFullPath = () => {
        var s = (this.props.state.__parent ? this.props.state.__parent.getFullPath() : "") + "/" + this.props.state.file;
        if (s.substr(0,2) == '//') {
            s = s.substr(1);
        }
        return s;
    };

    /**
     * Load the contents of the file.
     * @param reload: force reload
     * @return Promise
     */
    load = (reload) => {
        if (!this.isSaved() && !reload) {
            return new Promise( (resolve, reject) => {
                console.log("File not saved, cannot reload it without force flag.");
                reject();
            });
        }

        return new Promise( (resolve, reject) => {
            const project = this.getProject();
            project.loadFile(this.getFullPath(), (ret) => {
                if (ret.status != 0 ) {
                    reject();
                }
                else {
                    this.props.state.savedContents = ret.contents;
                    this.setContents(ret.contents);
                    resolve();
                }
            });
        });
    };

    /**
     * Save the contents of the file.
     * @return: Promise
     *
     */
    save = () => {
        return new Promise( (resolve, reject) => {
            if (this.isDeleted()) {
                reject();
                return;
            }
            const project = this.getProject();
            project.saveFile(this.getFullPath(), this.getContents(), (ret) => {
                if (ret.status != 0 ) {
                    reject();
                }
                else {
                    this.props.state.savedContents = this.getContents();
                    this.props.state.isSaved = true;
                    resolve();
                }
            });
        });
    };

    setContents = (contents) => {
        this.props.state.contents = contents;
        this.props.state.isSaved = (this.props.state.contents == this.props.state.savedContents);
    };

    getContents = () => {
        return this.props.state.contents;
    };

    isSaved = () => {
        return this.props.state.isSaved;
    };

    isReadOnly = () => {
        return this.props.state.isReadOnly == true;
    };

    setReadOnly = (flag) => {
        this.props.state.isReadOnly = flag;
    };

    /**
     * Move/Rename this file in storage.
     *
     */
    mv = (newFullPath) => {
        if (newFullPath[newFullPath.length - 1] == '/') {
            // Cannot end with slash (nor be Lonesome Cowboy Slash).
            return new Promise( (resolve, reject) => {
                reject();
            });
        }
        return new Promise( (resolve, reject) => {
            const project = this.getProject();
            project.moveFile(this.getFullPath(), newFullPath, (status) => {
                if (status != 0 ) {
                    reject(status);
                }
                else {
                    // Update this item with new filename.
                    // Move item and change parent.
                    const a = newFullPath.match("^(.*)/([^/]+)$");
                    const newPath = a[1];
                    const filename = a[2];
                    this.reKey(filename);
                    this.props.state.file = filename;
                    this.props.state.title = filename;

                    // Disconnect item from cached children list in parent.
                    const children = this.props.state.__parent.getChildren();  // This will already be loaded and cached, otherwise we wouldn't be here.
                    for(let index=0; index < children.length; index++) {
                        if (children[index].props.state.key == this.props.state.key) {
                            children.splice(index);
                            break;
                        }
                    }

                    const project = this.getProject();
                    const newPathArray = newPath.split('/');
                    project._getItemByPath(newPathArray, this.getProject()).then( (newParent) => {
                        // Set new parent
                        this.props.state.__parent = newParent;
                        newParent.getChildren(true, () => {
                            const children2 = newParent.getChildren();
                            this._copyState(children2, [this]);
                            resolve();
                        });
                    }).catch( () => {
                        alert("Error: Unexpected error when moving file.");
                        location.reload();
                        return;
                    });
                }
            });
        });
    };

    /**
     * Delete the file in storage.
     *
     */
    del = (cb) => {
        const project = this.getProject();
        project.deleteFile(this.getFullPath(), newname, cb);
    };

    /**
     * Close the open file.
     * This means reverting the buffer to it's last saved state.
     *
     */
    close = (cb) => {
        this.revert();
    };

    revert = () => {
        this.setContents(this.props.state.savedContents);
    };

    setDeleted = () => {
        this.props.state.isDeleted = true;
    };

    isDeleted = () => {
        return this.props.state.isDeleted;
    };

    _clickNewFile = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if(this.getType() == "folder") {
            const project = this.getProject();
            const file = prompt("Enter new name of file or folder. If folder last character must be a slash (/).");
            if(file) {
                if(!file.match("(^[a-zA-Z0-9-_\.]+[/]?)$")) {
                    alert("Illegal filename.");
                    return false;
                }
                project.newFile(this.getFullPath(), file, (status) => {
                    if (status == 0) {
                        this.getChildren(true, () => {
                            this.redrawMain(true);
                        });
                    }
                    else {
                        alert("Could not create file/folder.", status);
                    }
                });
            }
        }
    };

    _clickDeleteFile = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm("Are you sure to delete " + this.getFullPath() + "?")) {
            return false;
        }
        const project = this.getProject();
        project.deleteFile(this.getFullPath(), (status) => {
            if (status == 0) {
                this.setDeleted();
                this.props.state.__parent.getChildren(true, () => {
                    this.redrawMain(true);
                });
            }
            else {
                alert("Could not delete file/folder.", status);
            }
        });
    };

    _clickRenameFile = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const project = this.getProject();
        const newFile = prompt("Enter new name.", this.getFullPath());
        if (newFile) {
            //if (!newFile.match("(^[a-zA-Z0-9-_\.]+)$")) {
                //alert("Illegal filename.");
                //return false;
            //}
            const newFullPath = newFile;
            this.mv(newFile).then( () => {
                this.redrawMain(true);
            }).catch( (err) => {
                alert("Error: Could not move file.");
                return;
            });
        }
    };

    _renderFileTitle = (level, index) => {
        if (this.getType() == "file") {
            return (<div class={style.projectContractsTitleContainer} onClick={this._openItem}>
                <div class={style.title}>
                    <a title={this.getTitle()} href="#">
                        {this.getTitle()}
                    </a>
                </div>
                {!this.isReadOnly() && <div class={style.buttons}>
                    <a href="#" title="Rename file" onClick={this._clickRenameFile}>
                        <IconClone />
                    </a>
                    <a href="#" title="Delete file" onClick={this._clickDeleteFile}>
                        <IconTrash />
                    </a>
                </div>}
            </div>);
        }
        else if(this.getType() == "folder") {
            return (<div class={style.projectContractsTitleContainer} onClick={this._angleClicked}>
                <div class={style.title} title={this.getTitle()}>
                    <a href="#">{this.getTitle()}</a>
                </div>
                <div class={style.buttons}>
                    <a href="#" title="New..." onClick={this._clickNewFile}>
                        <IconFile />
                    </a>
                    {this.getFullPath() != "/" &&
                    <div style="display: inline;">
                        <a href="#" title="Rename directory" onClick={this._clickRenameFile}>
                            <IconClone />
                        </a>
                        <a href="#" title="Delete directory" onClick={this._clickDeleteFile}>
                            <IconTrash />
                        </a>
                    </div>
                    }
                </div>
            </div>);
        }
    };

    _renderChildren = (cb) => {
        if (this.getType() == 'folder') {
            const project = this.getProject();
            project.listFiles(this.getFullPath(), (status, list) => {
                if (status == 0) {
                    const children=[];
                    list.map( (file) => {
                        if (file.type == "d") {
                            var render;
                            //if (fullpath == "/app/") {
                                //render = this._renderApplicationSectionTitle;
                            //}
                            //if (this.props.filter) {
                                //render = this.
                            //}
                            children.push(new FileItem({
                                type: "folder",
                                render: render,
                                state: {
                                    key: file.name,
                                    open: false,
                                    title: file.name,
                                    file: file.name,
                                    __parent: this,
                                    project: this.getProject(),
                                }
                            }, this.router));
                        }
                        else if(file.type=="f") {
                            var fileItem;
                            if (this.getFullPath() == '/' && file.name == 'dappfile.json') {
                                fileItem = this.getProject().getHiddenItem("dappfile");
                                fileItem.props.onClick = this._openItem;
                                fileItem.props.state.__parent = this;
                                fileItem.props.state._tag = 0;
                            }
                            else {
                                fileItem = new FileItem({
                                    type: "file",
                                    onClick: this._openItem,
                                    state: {
                                        key: file.name,
                                        title: file.name,
                                        file: file.name,
                                        __parent: this,
                                        project: this.getProject(),
                                        _tag: 0
                                    }
                                }, this.router);
                            }

                            if (fileItem.getType2() == 'contract') {
                                const contractChildren = [
                                    new Item({
                                        type: "contract",
                                        type2: "configure",
                                        onClick: this._openItem,
                                        icon: <IconConfigure />,
                                        state: {
                                            title: "Configure",
                                            project: this.getProject(),
                                            __parent: fileItem,
                                            _tag: 1
                                        }
                                    })
                                ];
                                fileItem.setChildren(contractChildren);
                            }

                            children.push(fileItem);
                        }
                    });
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
