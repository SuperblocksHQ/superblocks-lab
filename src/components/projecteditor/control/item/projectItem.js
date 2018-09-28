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
import FileItem from './fileItem';
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

import Backend from  '../backend';

export default class ProjectItem extends Item {
    constructor(props, router) {
        props.state = props.state || {};
        props.type = props.type || "project";
        props.classes = props.classes || ["project"];
        super(props, router);
        this.backend = new Backend();
    }

    getInode = () => {
        return this.props.inode;
    };

    getTitle = () => {
        return this.props.state.title || "";
    };

    getName = () => {
        return this.props.state.name || "";
    };

    getEnvironment = () => {
        return "browser";
    };

    isSaved = () => {
        // TODO:
        return false;
    };

    /**
     * Prepare the project for being used by
     * loading the dappfile into cache and initializing the filesystem.
     *
     */
    load = (cb) => {
        console.log("load");
        //if (this.dappfile) {
            //cb(0);
            //return;
        //}
        //this.openFile("/dappfile.json", (status, body) => {
            //if (status != 0) {
                //cb(1);
                //return;
            //}
        //});
        const fileItem = new FileItem({
            type: "folder",
            key: "/",
            lazy: true,
            classes: ["files"],
            state: {
                open: false,
                title: "Files",
                project: this,
                fullpath: '/',
            }
        }, this.router);
        this.setChildren([fileItem]);
        //const accounts = this._accounts();
        //this.setHiddenItem('accounts', accounts);
        cb(0);
    };

    /**
     * List files below path.
     *
     */
    listFiles = (path, cb) => {
        this.backend.listFiles(this.getInode(), path, cb);
    };

    _accounts = () => {
        var accountsChildren=(item) => {
            // Upvalue: state.

            // Cached children, we want to keep the state.
            var _children=item.props.state._children || [];

            // Newly generated children, which we copy state over to.
            var children=[];
            var accounts=state.data.dappfile.accounts();
            for(var index=0;index<accounts.length;index++) {
                var account=accounts[index];
                var childItem = new AccountItem({
                    type: "account",
                    key: account.name,
                    index: index,
                    icon: <IconGem />,
                    onClick: this._openItem,
                    //render: this._renderAccountTitle,
                    state: {
                        title: account.name,
                        project: projectItem,
                        account: account.name,
                    }
                });
                children.push(childItem);
            }
            this._copyState(children, _children);

            // Cache generated.
            item.props.state._children=children;
            return children;
        };

        var accounts = new Item({
            type: "folder",
            type2: "accounts",
            state: {
                title: "Accounts",
                project: projectItem,
                children: accountsChildren
            }
        });
    };

    closeFile = (project, file, cb) => {
        if (cb) cb(0);
    };

    newFile = (path, file, cb) => {
        this.backend.newFile(this.getInode(), path, file, cb);
    };

    renameFile = (fullpath, newname, cb) => {
        this.backend.renameFile(this.getInode(), fullpath, newname, cb);
    };

    delFile = (fullpath, cb) => {
        this.backend.deleteFile(this.getInode(), fullpath, cb);
    };

    loadFile = (file, cb) => {
        //if(!reload && this._filecache[file] != null) {
            //const body=this._filecache[file];
            //if(!stealth) body.openCount++;
            //cb(body);
            //return;
        //}
        this.backend.loadFile(this.getInode(), file, cb);
            //if(!stealth) {
                //if(body.openCount===undefined) body.openCount=1;
                //this._filecache[file]=body;
            //}
            //if(body.status==0) {
                //body.state=0;
            //}
            //else {
                //body.state=-1;
            //}
    };

    saveFile = (file, body, cb) => {
        console.log("save", file, body);
        this.backend.saveFile(this.getInode(), {contents:body.contents,hash:body.hash,path:file}, (ret) => {
            if(ret.status==0) {
                body.state=0;
                body.status=0;
                body.hash=ret.hash;
            }
            else if(ret.status==2) {
                alert('File ' + file + ' could not be saved since it has been changed on disk.');
            }
            else {
                alert('File ' + file + ' could not be saved.');
            }
            cb(ret);
        });
    };












    //_saveProject = (projectItem, cb) => {
        //this.backend.saveProject(projectItem.props.state.data.dir, {
            //dappfile:projectItem.props.state.data.dappfile.getObj(),
            //hash:projectItem.props.state.data.dappfile_hash,
        //}, (body) => {
            //if(body.status==0) {
                //projectItem.props.state.data.dappfile_hash = body.hash;
            //}
            //else if(body.status==2) {
                //alert('Project Dappfile.yaml has changed on disk. You need to reload the project now!');
            //}
            //else {
                //alert('Project could not be saved.');
            //}
            //this.redrawMain();
            //if(cb) cb(body.status);
        //});
    //};
}
