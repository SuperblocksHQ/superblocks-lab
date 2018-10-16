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

import { h, Component } from 'preact';
import Item from './item';
import {
    IconTrash,
    IconFile,
    IconConfigure,
    IconCompile,
    IconDeploy,
    IconInteract,
    IconContract,
    IconAddFile,
    IconAddFolder,
    IconHtml,
    IconJS,
    IconCss,
    IconMd,
    IconShowPreview,
    IconMosaic,
    IconEdit,
} from '../../../icons';
import style from '../style';
import { DropdownContainer } from '../../../dropdown';

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
/*
    state = {
        showActions: false
    };

    showActions = () => {
        this.setState({
            showActions: true
        })
    };

    hideActions = () => {
        this.setState({
            showActions: false
        })
    };
*/

    /**
     * Move/Rename this file in storage.
     *
     */
    mv = (newFullPath) => {
        if (newFullPath[newFullPath.length - 1] == '/') {
            // Cannot end with slash (nor be a (Lonesome) Cowboy Slash).
            return new Promise( (resolve, reject) => {
                reject();
            });
        }
        return new Promise( (resolve, reject) => {
            const project = this.getProject();
            const oldPath = this.getFullPath();
            project.moveFile(oldPath, newFullPath, (status) => {
                if (status != 0 ) {
                    reject(status);
                }
                else {
                    // Update this item with new filename.
                    // Move item and change parent.
                    const a = newFullPath.match("^(.*)/([^/]+)$");
                    const newPath = a[1];
                    const filename = a[2];
                    this.reKey(filename, newFullPath);
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
                    project.getItemByPath(newPathArray, this.getProject()).then( (newParent) => {
                        // Set new parent
                        this.props.state.__parent = newParent;

                        // Update the dappfile
                        if (this.notifyMoved) {
                            this.notifyMoved(oldPath, () => { });
                        }

                        // Recache the children
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

        if (this.getType() == "folder") {
            const project = this.getProject();
            const file = prompt("Enter the new file's name");

            if (file) {
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
                        alert("Could not create the file.", status);
                    }
                });
            }
        }
    };

    _clickNewFolder = (e) => {
        e.preventDefault();

        if (this.getType() == "folder") {
            const project = this.getProject();
            const file = prompt("Enter the new folder's name");

            if (file) {
                if(!file.match("(^[a-zA-Z0-9-_\.]+)$")) {
                    alert("Illegal foldername.");
                    return false;
                }

                project.newFolder(this.getFullPath(), file, (status) => {
                    if (status == 0) {
                        this.getChildren(true, () => {
                            this.redrawMain(true);
                        });
                    }
                    else {
                        alert("Could not create the folder.", status);
                    }
                });
            }
        }
    };

    _clickDeleteFile = (e) => {
        e.preventDefault();

        if (!confirm("Are you sure to delete " + this.getFullPath() + "?")) {
            return false;
        }
        const project = this.getProject();
        project.deleteFile(this.getFullPath(), (status) => {
            if (status == 0) {
                this.setDeleted();
                if (this.notifyDeleted) this.notifyDeleted();
                if(this.router.panes) this.router.panes.closeItem(this, null, true);
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

        const project = this.getProject();
        const newFile = prompt("Enter new name.", this.getFullPath());
        if (newFile) {
            // TODO: we should only allow file name change here, not path move. Move we want drag and drop for.
            // but until we have that we allow for giving paths here in the rename function.
            //if (!newFile.match("(^[a-zA-Z0-9-_\.]+)$")) {
                //alert("Illegal filename.");
                //return false;
            //}
            const suffix1 = (this.getFullPath().match("^(.*)/[^/]+[.](.+)$") || [])[2] || "";
            const suffix2 = (newFile.match("^(.*)/[^/]+[.](.+)$") || [])[2] || "";
            if (suffix1.toLowerCase() == 'sol' && suffix1.toLowerCase() != suffix2.toLowerCase()) {
                alert('A contract must have the .sol file ending.');
                return;
            }
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
            return (
                <FileEntry
                   openItem={this._openItem}
                   title={this.getTitle()}
                   isReadOnly={this.isReadOnly()}
                   clickRenameFile={this._clickRenameFile}
                   clickDeleteFile={this._clickDeleteFile}
               />
            );
        } else if (this.getType() == "folder") {
            const contextMenu=(
                <div class={style.contextMenu}>
                    <div onClick={this._clickNewFile}>
                        <div class={style.icon} >
                            <IconAddFile />
                        </div>
                        Create File
                    </div>
                    <div onClick={this._clickNewFolder}>
                        <div class={style.icon} >
                            <IconAddFolder />
                        </div>
                        Create Folder
                    </div>
                    <div onClick={this._clickRenameFile}>
                        <div class={style.icon}>
                            <IconEdit />
                        </div>
                        Rename
                    </div>
                    <div onClick={this._clickDeleteFile}>
                        <div class={style.icon}>
                            <IconTrash />
                        </div>
                        Delete
                    </div>
                </div>
            );
            return (
                <DropdownContainer dropdownContent={contextMenu} useRightClick={true}>
                    <div class={style.projectContractsTitleContainer} onClick={this._angleClicked} onContextMenu={(e) => e.preventDefault()}>
                        <div class={style.title} title={this.getTitle()}>
                            <a href="#">{this.getTitle()}</a>
                        </div>
                        <div class={style.buttons} onClick={(e) => e.stopPropagation()}>
                            <a href="#" title="New File" onClick={this._clickNewFile}>
                                <IconAddFile />
                            </a>
                            <a href="#" title="New Folder" onClick={this._clickNewFolder}>
                                <IconAddFolder />
                            </a>
                            {
                                this.getFullPath() != "/" &&
                                    <div style="display: inline;">
                                        <a href="#" title="Rename directory" onClick={this._clickRenameFile}>
                                            <IconEdit />
                                        </a>
                                        <a href="#" title="Delete directory" onClick={this._clickDeleteFile}>
                                            <IconTrash />
                                        </a>
                                    </div>
                            }
                        </div>
                    </div>
                </DropdownContainer>
            );
        }
    };

    // Just gonna put this here for now
    _renderApplicationSectionTitle = (level, index, item) => {
        return (
            <div class={style.projectContractsTitleContainer} onClick={item._angleClicked}>
                <div>
                    { item.getTitle() }
                </div>
                <div class={style.buttons}>
                    <button class="btnNoBg" onClick={(e)=>{ item._openAppPreview(e, item)} } title="Show Preview">
                        <IconShowPreview />
                    </button>
                    <button class="btnNoBg" onClick={(e)=>{ item._openAppComposite(e, item)} } title="Mosaic View">
                        <IconMosaic />
                    </button>
                </div>
            </div>
        );
    };

    _openAppPreview = (e, item) => {
        e.stopPropagation();
        e.preventDefault();

        const view = item.getProject().getHiddenItem("app_preview");

        if(this.router.panes) this.router.panes.openItem(view);
    };

    _openAppComposite = (e,item) => {
        e.stopPropagation();
        e.preventDefault();

        const html = item.getProject().getItemByPath(['app.html'], item);
        const css = item.getProject().getItemByPath(['app.css'], item);
        const js = item.getProject().getItemByPath(['app.js'], item);
        const view = item.getProject().getHiddenItem("app_preview");
        Promise.all([html, js, css, view]).then( (a) => {
            if(this.router.panes) {
                for (let index=0; index < a.length; index++) {
                    var item = a[index];
                    var { pane, winId } = this.router.panes.getWindowByItem(a[0]);
                }
                if (! winId) {
                    this.router.panes.openItem(a[0]);
                    var { pane, winId } = this.router.panes.getWindowByItem(a[0]);
                }
                for (let index=0; index < a.length; index++) {
                    var item = a[index];
                    var o = this.router.panes.getWindowByItem(item);
                    if (o.winId && o.pane.id != pane.id) {
                        this.router.panes.closeItem(item, null, true);
                        o.winId = null;
                    }
                    if (! o.winId) {
                        this.router.panes.openItem(item, pane.id);
                    }
                }
            }
        }).catch( (e) => {
            const path = item.getFullPath();
            alert("Could not find " + path + "/app.{html,css,js} files.");
        });
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
                            if (this.getFullPath() == "/" && file.name == "app") {
                                console.log(this.getFullPath(), file.name);
                                render = this._renderApplicationSectionTitle;
                            }
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
                                fileItem.props.onClick = fileItem._openItem;
                                fileItem.props.state.__parent = this;
                                fileItem.props.state._tag = 0;
                            }
                            else {
                                fileItem = new FileItem({
                                    type: "file",
                                    state: {
                                        key: file.name,
                                        title: file.name,
                                        file: file.name,
                                        __parent: this,
                                        project: this.getProject(),
                                        _tag: 0
                                    }
                                }, this.router);
                                fileItem.props.onClick = fileItem._openItem;
                            }

                            if (fileItem.getType2() == 'contract') {
                                // WOHA! This is a contract, let's get the ContractItem representation of it.
                                var contractItem = this.getProject().getContract(fileItem.getFullPath());
                                if (contractItem) {
                                    // Replace file item with contract item.
                                    fileItem = contractItem;
                                    fileItem.props.onClick = fileItem._openItem;
                                    fileItem.props.state.__parent = this;
                                    fileItem.props.state._tag = 0;
                                    fileItem.props.state.project = this.getProject();
                                    fileItem.props.state.toggable = true;

                                }

                                // Set child items of the contract.
                                const configureItem = new Item({
                                    type: "contract",
                                    type2: "configure",
                                    icon: <IconConfigure />,
                                    state: {
                                        key: "configure",
                                        title: "Configure",
                                        __parent: fileItem,
                                        project: this.getProject(),
                                        _tag: 1
                                    }
                                }, this.router);
                                configureItem.props.onClick = configureItem._openItem;

                                const interactItem = new Item({
                                    type: "contract",
                                    type2: "interact",
                                    icon: <IconInteract />,
                                    state: {
                                        key: "interact",
                                        title: "Interact",
                                        __parent: fileItem,
                                        project: this.getProject(),
                                        _tag: 2
                                    }
                                }, this.router);
                                interactItem.props.onClick = interactItem._openItem;

                                const compileItem = new Item({
                                    type: "contract",
                                    type2: "compile",
                                    icon: <IconCompile />,
                                    state: {
                                        key: "compile",
                                        title: "Compile",
                                        __parent: fileItem,
                                        project: this.getProject(),
                                        _tag: 3
                                    }
                                }, this.router);
                                compileItem.props.onClick = compileItem._openItem;

                                const deployItem = new Item({
                                    type: "contract",
                                    type2: "deploy",
                                    icon: <IconDeploy />,
                                    state: {
                                        key: "deploy",
                                        title: "Deploy",
                                        __parent: fileItem,
                                        project: this.getProject(),
                                        _tag: 4
                                    }
                                }, this.router);
                                deployItem.props.onClick = deployItem._openItem;

                                const contractChildren = [configureItem, compileItem, deployItem, interactItem];
                                //fileItem.setChildren(contractChildren);
                                this._copyState(contractChildren, fileItem.props.state.children || []);
                                fileItem.props.state.children=contractChildren;
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


class FileEntry extends Component {
    render() {
        const {
            openItem,
            title,
            isReadOnly,
            clickRenameFile,
            clickDeleteFile,
        } = this.props;

        const contextMenu = (
            <div class={style.contextMenu}>
                <div onClick={clickRenameFile}>
                    <div class={style.icon}>
                        <IconEdit />
                    </div>
                    Rename
                </div>
                <div onClick={clickDeleteFile}>
                    <div class={style.icon}>
                        <IconTrash />
                    </div>
                    Delete
                </div>
            </div>
        );

        return (
            <DropdownContainer
                dropdownContent={contextMenu}
                useRightClick={true}
                onContextMenu={e => e.preventDefault()}
            >

                <div
                    class={style.projectContractsTitleContainer}
                    onClick={openItem}
                >
                    <ShowActions
                        isReadOnly={isReadOnly}
                        actionContainer={
                            <FadeInComponent>
                                <div class={style.buttons} onClick={e => e.stopPropagation()}>
                                    <a href="#" title="Rename file" onClick={clickRenameFile}>
                                        <IconEdit />
                                    </a>
                                    <a href="#" title="Delete file" onClick={clickDeleteFile} >
                                        <IconTrash />
                                    </a>
                                </div>  
                            </FadeInComponent>
                        }
                    >
                        <div>
                            <div class={style.title}>
                                <a title={title} href="#">
                                    {title}
                                </a>
                            </div>
                        </div>
                    </ShowActions>
                </div>
            </DropdownContainer>
        );
    }
}

class ShowActions extends Component {
    state = {
        showActions: false
    }

    showActions = () => {
        this.setState({ showActions: true });
    }

    hideActions = () => {
        this.setState({ showActions: false });
    }

    render() {
        const { actionContainer, isReadOnly } = this.props;

        return(
            <div onMouseEnter={this.showActions} onMouseLeave={this.hideActions}>
                { this.props.children }
                { !isReadOnly && 
                    this.state.showActions ? actionContainer : null }
            </div>

        );
    }
}

class FadeInComponent extends Component {
    state = {
        animate: false
    }

    componentDidMount() {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.setState({ animate: true });
            });
        });
    } 

    render() {
        return(
            <div style={{
                opacity: this.state.animate ? 1 : 0,
                transition: 'opacity .3s',
            }}>
                { this.props.children }
            </div>
        );
    }
}