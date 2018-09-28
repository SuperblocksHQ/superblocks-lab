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
import classnames from 'classnames';
import PropTypes from 'prop-types';

import style from './style';
import Item from './item/item';
import ProjectItem from './item/projectItem';
import Backend from  './backend';
import Dappfile from './dappfile';
import NewDapp from '../../newdapp';
import Modal from '../../modal';
import TransactionLogData from '../../blockexplorer/transactionlogdata';
import NetworkAccountSelector from '../../networkAccountSelector';
import ItemContract from './itemContract';
import LearnAndResources from '../../learnAndResources';
import Caret from '../../caret';

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
} from '../../icons';


export default class Control extends Component {
    constructor(props) {
        super(props);
        this.backend = new Backend();
        this._projectsList = [];
        const menu = new Item({
            type: "top",
            classes: ["menutop"],
            render: this._menuTop,
            icon: null,
            toggable: false,
            state: {
                title: "Top menu",
                children: () => {
                    var children = [];
                    const project = this.getActiveProject();
                    if (project) children.push(project);
                    return children;
                }
            }
        });
        this.setState({
            menu: menu
        });
        props.router.register("control", this);
        console.log(this.redraw, this.redrawMain);
    }

    componentDidMount() {
        this._loadProjects( (status) => {
            if (status == 0) {
                //this._openLastProject();
                this._showWelcome();
            }
        });

        //this._reloadProjects(null, (status) => {
            //// NOTE: Ideally all this logic should not leave in the component itself but most likely in an epic
            //// which we can actually properly test
            //let { selectedProjectId } = this.props;
            //this._projectsList.forEach((project) => {
                //if (selectedProjectId && selectedProjectId === project.props.state.data.dir) {
                    //this.openProject(project);
                //}
            //});
            //this._showWelcome();
        //});
    }

    /**
     * Redraw this component.
     *
     */
    redraw = () => {
        this.setState();
    };

    /**
     * Redraw the Main component.
     *
     */
    redrawMain = (redrawAll) => {
        this.props.router.main.redraw(redrawAll);
    };

    /**
     * Load a light list of all projects in storage
     * and update the list of projects if necessary.
     *
     */
    _loadProjects = (cb) => {
        this.backend.loadProjects( (status, lightProjects) => {
            if (status != 0) {
                alert("Error: Could not load projects list.");
            }
            else {
                // Iterate over all loaded projects,
                // see if already loaded, else add it to the list.
                lightProjects.map( (lightProject) => {
                    const exists = this._projectsList.filter( (project) => {
                        return (project.getInode() == lightProject.inode);
                    }).length > 0;
                    if (!exists) {
                        const project = new ProjectItem({
                            inode: lightProject.inode,
                            state: {
                                name: lightProject.name,
                                title: lightProject.title
                            }
                        }, this.props.router);
                        this._projectsList.push(project);
                    }
                });
            }
            cb(status);
        });
    };

    /**
     * Try to reopen the last opened project.
     */
    _openLastProject = () => {
        let { selectedProjectId } = this.props;
        this._projectsList.forEach((project) => {
            if (selectedProjectId && selectedProjectId === project.getInode()) {
                this.openProject(project);
            }
        });
    };

    /**
     * If no project is open then
     * open a window with a welcome message.
     *
     */
    _showWelcome = () => {
        if(!this.getActiveProject()) {
            const item = new Item({
                type: "info",
                type2: "welcome",
                icon: <IconCube />,
                state: {
                    title: "Welcome",
                },
            });
            if(this.props.router.panes) this.props.router.panes.openItem(item);
        }
    };

    /**
     * Request to close all open windows,
     * if all windows successfully closed then remove project from explorer.
     */
    _closeProject = (cb) => {
        this.props.router.panes.closeAll((status) => {
            if(status==0) {
                this.setState({activeProject: null});
            }
            if(cb) cb(status);
        });
    };

    /**
     * Open a project in the explorer.
     * Request to close already open project, if any.
     */
    openProject = (project, cb) => {
        if (this.getActiveProject() === project) {
            if (cb) cb(0);
            return;
        }

        this._closeProject((status) => {
            if (status == 0) {
                project.load( (status) => {
                    if (status == 0) {
                        this._setProjectActive(project);
                        this.redrawMain(true);
                    }
                    if (cb) cb(status);
                });
            }
            else {
                this.redrawMain(true);
                if (cb) cb(status);
            }
        });
    };

    /**
     * Return the active project (as shown in the explorer).
     *
     */
    getActiveProject =() => {
        return this.state.activeProject;
    };

    /**
     * Return the list of loaded projects.
     *
     */
    getProjects = () => {
        return this._projectsList;
    };

    /**
     * Set a project as active in the explorer.
     */
    _setProjectActive = (project) => {
        this.setState({activeProject: project});
        this.props.selectProject(project);
    };

    openProjectConfig = (item) => {
        this.backend.loadProject(item.props.state.data.dir, (status, project)=>{
            if(status==0) {
                item.props.state.dappfilejson=project;
                if(this.props.router.panes) this.props.router.panes.openItem(item);
            }
        });
    };

    /**
     * Open the dialog about creating a new project.
     * Create the new project and open it.
     */
    newDapp = (e) => {
        e.preventDefault();
        const project = this.getActiveProject();
        if (project && !project.isSaved()) {
            alert("Please save the current project first.");
            return;
        }
        const cb = (status, code) => {
            if(code == 0) {
                this._loadProjects( (status) => {
                    if (status == 0) {
                        const project = this._projectsList[this._projectsList.length-1];
                        if (project) {
                            this.openProject(project);
                        }
                    }
                });
            }
            else {
                alert("A DApp with that name already exists, please choose a different name.");
            }
        };
        const modal={};
        modal.render=() => {return (<NewDapp backend={this.backend} router={this.props.router} functions={this.props.functions} modal={modal} cb={cb} />)};
        this.props.functions.modal.show(modal);
    };























    _newProject = (rawProject) => {
        var children=[];
        const nonMenuItems = {};
        var state={
            open: true,
            status: 'idle',
            data: {
            },
            children: children,
            nonMenuItems: nonMenuItems,
        };
        var projectItem = new Item({
            inode: rawProject.inode,
            type: "project",
            classes: ["project"],
            render: this._renderProjectTitle,
            icon: null,
            toggable: false,
            state: state,
        });
        projectItem.props._project=projectItem;
        state.txlog = new TransactionLogData({functions:this.props.functions, project:projectItem});

        // TODO: these operations will be replaced by general filesystem operations.
        projectItem.save=(cb) => {this._saveProject(projectItem, cb)};
        projectItem.delete=(cb) => {this._deleteProject(projectItem, cb)};
        projectItem.loadFile=(file, cb, stealth) => {this._loadFile(project, file, cb, false, stealth)};
        projectItem.saveFile=(file, cb) => {this._saveFile(project, file, cb)};
        projectItem.closeFile=(file) => {this._closeFile(project, file)};
        projectItem.deleteFile=(file, cb) => {this._deleteFile(project, file, cb)};
        projectItem.renameFile=(path, file, cb) => {this._renameFile(project, path, file, cb)};
        projectItem.filterNonMenuItem=(key, filter) => {return this._filterNonMenuItem(nonMenuItems, key, filter)};
        projectItem.reKeyNonMenuItem=(key, filter, key2, value) => {return this._reKeyNonMenuItem(nonMenuItems, key, filter, key2, value)};

        //var transactionlog=this._newItem({ classes: ["hidden"], title: "Transaction history", type: "transaction_log", icon: <IconCube />, onClick:this._openItem, _project: projectItem });
        //children.push(transactionlog);


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////// Files Section //////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //var filesChildren = [];

        //var contractsChildren=(item) => {
            //// Upvalue: state.
            //var contracts=state.data.dappfile.contracts();
            //var children=[];
            //var _children=item.props.state._children || [];
            //for(var index=0;index<contracts.length;index++) {
                //var contract=contracts[index];

                //const contractChildChildren=[];
                //var contractChild=this._newItem({title: contract.name+".sol", _index: index, _nrContracts: contracts.length, _key: contract.name+":"+contract.source, render: this._renderContractTitle, icon: <IconContract />, _project: projectItem, _contract: contract, type: "file", type2: "contract", file: contract.source, toggable: true, state:{_tag: 0, open: index == 0 ? true : false, children: contractChildChildren}});

                //var contractConfig=this._newItem({title: "Configure", _contract: contract.name, _project: projectItem, type: "contract", type2: "configure", onClick: this._openItem, icon: <IconConfigure />, state: {_tag: 1}});
                //var contractInteract=this._newItem({title: "Interact", _parentItem: contractChild, _contract: contract.name, _project: projectItem, type: "contract", type2: "interact", onClick: this._openItem, icon: <IconInteract /> , state: {_tag: 2}});
                //var contractCompile=this._newItem({title: "Compile", _contract: contract.name, _project: projectItem, type: "contract", type2: "compile", onClick: this._openItem, icon: <IconCompile />, state: {_tag: 3}});
                //var contractDeploy=this._newItem({title: "Deploy", _parentItem: contractChild, _contract: contract.name, _project: projectItem, type: "contract", type2: "deploy", onClick: this._openItem, icon: <IconDeploy />, state: {_tag: 4}});

                //contractChildChildren.push(contractConfig);
                //contractChildChildren.push(contractCompile);
                //contractChildChildren.push(contractDeploy);
                //contractChildChildren.push(contractInteract);
                //children.push(contractChild);
            //}
            //// Add invisible items
            //const invsMake=this._newItem({title: "Make", icon: <IconDeploy />, _project: projectItem, _key: "make", type: "make", type2: "contracts", _hidden: true});
            //children.push(invsMake);
            //this._copyState(children, _children);
            //item.props.state._children=children;
            //return children;
        //};
        //var contracts=this._newItem({ title: "contracts", type: "folder", type2: "contracts", _project: projectItem, render: this._renderContractsSectionTitle, toggable: true, iconCollapsed: <IconFolder />, icon: <IconFolderOpen />, state: { open: true, children: contractsChildren }});
        //filesChildren.push(contracts);

        //var constantsChildren=(item) => {
            //// Upvalue: state.

            //// Cached children, we want to keep the state.
            //var _children=item.props.state._children || [];

            //// Newly generated children, which we copy state over to.
            //var children=[];
            //var constants=state.data.dappfile.constants();
            //for(var index=0;index<constants.length;index++) {
                //var constant=constants[index];
                //var childItem = this._newItem({title: constant.name, _key: constant.name, _index: index, _project: projectItem, _constant: constant.name, icon: <IconGem />, onClick:this._openItem, render: this._renderConstantTitle, type: "constant"});
                //children.push(childItem);
            //}
            //this._copyState(children, _children);

            //// Cache generated.
            //item.props.state._children=children;
            //return children;
        //};

        //var constants=this._newItem({classes: ["hidden"], title: "Constants", type: "folder", type2: "constants", _project: projectItem, render:this._renderConstantsTitle ,toggable: true, state:{open: false, children: constantsChildren}});
        //filesChildren.push(constants);

        //var app=this._newItem({title: "app", type: "app", type2: "folder", render: this._renderApplicationSectionTitle, _project: projectItem, toggable: true, iconCollapsed: <IconFolder />, icon: <IconFolderOpen />, state:{ open: true, children: [
            //this._newItem({title: "app.html", _project: projectItem, type: "file", type2: 'html', _project: projectItem, file: "/app/app.html", onClick: this._openItem, icon: <IconHtml />, state: { _tag:0 }}),
            //this._newItem({title: "app.js", _project: projectItem, type: "file", type2: 'js', _project: projectItem, file:'/app/app.js', onClick: this._openItem, icon: <IconJS />, state:{ _tag:3 }}),
            //this._newItem({title: "app.css", _project: projectItem, type: "file", type2: 'css', _project: projectItem, file: '/app/app.css', onClick: this._openItem, icon: <IconCss />, state:{ _tag:2 }}),
            //this._newItem({classes: ["hidden"], title: "Show Preview", _project: projectItem, type: "app", type2: "view", _project: projectItem, onClick: this._openItem, icon: <IconShowPreview />, state:{ _tag:1 }}),
        //]}});
        //filesChildren.push(app);

        //let readme = this._newItem({title: "README.md", _project: projectItem, type: "file", type2: 'md', _project: projectItem, file: "/README.md", onClick: this._openItem, icon: <IconMd />, state: { }});
        //filesChildren.push(readme);

        //var files = this._newItem({ title: "Files", type: "app", type2: "folder", render: this._renderLearnSectionTitle, _project: projectItem, toggable: true, icon: null, state: { open: true, children: filesChildren }});
        //children.push(files);


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////// Accounts Section (Hidden) //////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //nonMenuItems['accounts'] = accounts;

        //var files = new FileItem({
            //classes: ["files"],
            //type: "folder",
            //type2: "files",
            //_lazy: true,
            //_key: '/',
            //toggable: true,
            //render: this._renderFileTitle,
            //state: {
                //title: "Files",
                //project: projectItem,
                //open: true,
                //fullpath: '/',
                //children: this._renderFilesChildren
            //}
        //});
        children.push(files);

        if(!this._updateProject(projectItem, project)) return null;
        return projectItem;
    };


    //_shortenSourceName = (path) => {
        //return path.match("([^/]*)$")[0];
    //};

    // Find same Item and copy the state.

    _updateProject = (item, project) => {
        item.props.state.title = project.dir;
        item.props.state.data.dir = project.dir;
        item.props.state.data.dappfile = new Dappfile({dappfile:project.dappfile});
        //this._testar(item.props.state.data.dappfile);
        item.props.state.data.dappfile_hash = project.dappfile_hash;

        // Set a default env.
        if(item.props.state.data.dappfile.environments().length == 0) {
            return false
        }
        var defenv = item.props.state.data.dappfile.environments()[0].name;
        var found=false;
        for(var index=0;index<item.props.state.data.dappfile.environments().length;index++) {
            if(item.props.state.data.dappfile.environments()[index].name == item.props.state.data.env) {
                found=true;
                break;
            }
        }
        if(!found) {
            item.props.state.data.env = defenv;
        }

        // Refresh the file explorer.
        const itemFiles=this._filterItem(item, {type2: "files"});
        var crazyRecurser;
        crazyRecurser= (item) =>{
            const childrn=item.props.state._children || [];
            for(var index=0;index<childrn.length;index++) {
                crazyRecurser(childrn[index]);
            }
            if(childrn.length>0 || item.props.state.open) {
                item.getChildren(true);
            }
        };
        crazyRecurser(itemFiles);
        return true;
    };

    //_newItem = (props) => {
        //if(props.state == null) props.state={};
        //if(props.state.id == null) props.state.id=this.props.functions.generateId();
        //if(props.toggable && props.state.open == null) props.state.open=true;
        //return new Item(props);
    //};

    _openAppPreview = (e, item) => {
        e.stopPropagation();

        if (!this.props.router.panes) return;
        var item2 = this._filterItem(item, {type2: "view"});
        this.props.router.panes.openItem(item2);
    };

    _openAppComposite = (e,item) => {
        e.stopPropagation();

        if (!this.props.router.panes) return;
        var item2 = this._filterItem(item, {type2: "html"});

        if (!this.props.router.panes.openItem(item2)) return;

        var { pane, winId } = this.props.router.panes.getWindowByItem(item2);

        var item2 = this._filterItem(item, {type2: "js"});
        this.props.router.panes.openItem(item2, pane.id);

        var item2 = this._filterItem(item, {type2: "css"});
        this.props.router.panes.openItem(item2, pane.id);

        var item2 = this._filterItem(item, {type2: "view"});
        this.props.router.panes.openItem(item2, pane.id);
    };

    _openItem = (e, item) => {
        e.preventDefault();
        e.stopPropagation();

        console.log("open", item);
        if(this.props.router.panes) this.props.router.panes.openItem(item);
    };

    openContractItem = (e, item, id) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const fullpath = item.props.state.fullpath;
        const dappfile = item.props.state.project.props.state.data.dappfile;
        // Check so that the contract file is represented in the Dappfile, otherwise create that representation.
        var contract=dappfile.contracts().filter( (c) => {
            return (c.source == fullpath)
        })[0];

        if (!contract) {
            var name = fullpath.match(".*[/](.+)[.]([^.]+)$")[1];
            contract =
                {
                    name: name,
                    args: [],
                    source: fullpath,
                    blockchain: "ethereum",
                }
            dappfile.contracts().push(contract);
            // TODO: new to save the file.
        }

        item.props.state.contract = contract;

        if(this.props.router.panes) this.props.router.panes.openItem(item, id);
    };

    _closeAnyContractItemsOpen = (contractName, includeConfigure, cb) => {
        const project = this.getActiveProject();
        if(project) {
            // TODO: this lookup is bad since it depends on the order of the menu items.
            // TODO: look through project object for the contract named contractName, then get the item for the Editor, Compiler, Deployer and Interact window.
            const items = [];
            const item = project.props.state.children[1].getChildren()[0].props.state._children.filter( (item) => {
                return item.props.state.contract && item.props.state.contract.name == contractName;
            })[0];
            if (!item) {
                if (cb) cb(2);
                    return;
            }
            items.push(item);
            if (includeConfigure) {
                items.push(item.props.state.children[0]);  // Configure item
            }
            items.push(item.props.state.children[1]);
            items.push(item.props.state.children[2]);
            items.push(item.props.state.children[3]);

            const close = (items, cb) => {
                if (items.length == 0) {
                    if (cb) cb(0);
                    return;
                }
                const item = items.pop();
                const {pane, winId} = this.props.router.panes.getWindowByItem(item);
                if (pane && winId) {
                    this.props.router.panes.closeWindow(pane.id, winId, (status) => {
                        if (status != 0) {
                            if (cb) cb(status);
                            return;
                        }
                        close(items, cb);
                    });
                }
                else {
                    close(items, cb);
                }
            };
            close(items, cb);
            return;
        }
        if (cb) cb(1);
    };

    //_downloadWorkspace = e => {
        //e.preventDefault();
        //this.backend.downloadWorkspace(e);
    //}

    //_clickWorkspace = (e) => {
        //e.preventDefault();
        //document.querySelector('#wsFileInput').dispatchEvent(new MouseEvent('click')); // ref does not work fhttps://github.com/developit/preact/issues/477
    //}
    //_uploadWorkspace = (e) => {
        //e.preventDefault();
        //var files = document.querySelector('#wsFileInput').files;
        //var file = files[0];

        //const uploadConfirm = e => {
            //e.preventDefault()
            //this.backend.uploadWorkspace(file, err => {
                //if(err) {
                    //alert(err);
                    //this.props.functions.modal.close();
                //}
                //else this._reloadProjects(e, this.props.functions.modal.close)
            //});
        //}

        //const body=(
            //<div>
                //<p>Warning, this will overwrite the entire workspace, press 'Import' to confirm.</p>
                //<div style="margin-top: 10px;">
                    //<a class="btn2" style="float: left; margin-right: 30px;" onClick={this.props.functions.modal.cancel}>Cancel</a>
                    //<a class="btn2 filled" style="float: left;" onClick={uploadConfirm}>Import</a>
                //</div>
            //</div>
        //);
        //const modalData={
            //title: "Import Saved Workspace",
            //body: body,
            //style: {"text-align":"center",height:"400px"},
        //};
        //const modal=(<Modal data={modalData} />);
        //this.props.functions.modal.show({render: () => {return modal;}});

        //e.target.value = '';
    //}

    deleteProject = (project, cb) => {
        if(confirm("Are you sure you want to delete this project?")) {
            const delFn = (cb) => {
                project.delete((status)=>{
                    if(cb) cb(status);
                });
            };

            if (this.getActiveProject() == project) {
                this._closeProject((status) => {
                    if(status==0) {
                        delFn((status) => {
                            // Open project if any
                            if(this._projectsList.length) {
                                this.openProject(this._projectsList[this._projectsList.length-1]);
                            }
                            else {
                                this._showWelcome();
                            }
                            if(cb) cb(status);
                        });
                    }
                    else {
                        if(cb) cb(status);
                    }
                });
            }
            else {
                delFn();
            }
        }
        else {
            if(cb) cb(1);
        }
    };

    downloadProject = (project, keepState) => {
        this.backend.downloadProject(project.props.state.data.dir, keepState);
    };

    _openContractMake = (e, item) => {
        e.preventDefault();
        const item2=this._filterItem(item, {type: "make"});
        if(item2 && this.props.router.panes) this.props.router.panes.openItem(item2);
    };

    _reKeyNonMenuItem = (root, key, filter, key2, value) => {
        const item = this._filterNonMenuItem(root, key, filter);
        if (item) item.props[key2] = value;
        return item;
    };

    _reKeyItem = (root, key, filter, key2, value) => {
        const item = this._filterNonMenuItem(root, key, filter);
        if (item) item.props[key2] = value;
        return item;
    };

    _filterNonMenuItem = (root, key, filter) => {
        return this._filterItem(root[key], filter);
    };

    _filterItem = (root, filter) => {
        if (this._filterItemCmp(root, filter)) {
            return root;
        }
        return root.getChildren().filter((item)=>{
            return this._filterItemCmp(item, filter);
        })[0];
    };

    _filterItemCmp = (item, filter) => {
        const keys=Object.keys(filter);
        for(var index=0;index<keys.length;index++) {
            const key=keys[index];
            if(item.props[key] != filter[key]) return false;
        }
        return true;
    };

    //_renderContractsSectionTitle = (level, index, item) => {
        //var projectItem = item.props.state.project;
        //return (
            //<div class={classnames([style.projectContractsTitleContainer])} onClick={(e)=>this._angleClicked(e, item)}>
                //<div>
                    //<div>{item.getTitle()}</div>
                //</div>
                //<div class={style.buttons}>
                    //<button class="btnNoBg" title="New contract" onClick={(e)=>{this._clickNewContract(e, projectItem);}}>
                        //<IconAddContract />
                    //</button>
                //</div>
            //</div>
        //);
    //};

    //_renderLearnSectionTitle = (level, index, item) => {
        //return (
            //<div class={classnames([style.projectContractsTitleContainer, 'mt-4'])} onClick={ (e)=>this._angleClicked(e, item) }>
                //<div>
                    //{ item.getTitle() }
                //</div>
            //</div>
        //);
    //};

    openTransactionHistory = () => {
        // Open the transaction history tab for the open project.
        const project = this.getActiveProject();
        if(project) {
            //TODO: this lookup is bad since it depends on the order of the menu items.
            if(this.props.router.panes) this.props.router.panes.openItem(project.props.state.children[0]);
        }
    };

    // Called from accounts dropdown
    _clickNewAccount = (e, projectItem) => {
        e.preventDefault();

        var name;
        for(var index=1;index<100000;index++) {
            name="Account"+index;
            if(projectItem.props.state.data.dappfile.accounts().filter((c)=>{
                return c.name==name;
            }).length==0) {
                break;
            }
        }

        var browserIndex=0;
        var customIndex=0;
        var dirty;
        do {
            dirty=false;
            projectItem.props.state.data.dappfile.accounts().map((item)=>{
                const account=projectItem.props.state.data.dappfile.getItem("accounts", [{name: item.name}]);
                var index=parseInt(account.get("index", "browser"));
                if(!isNaN(index) && index==browserIndex) {
                    browserIndex=index+1;
                    dirty=true;
                }
                var index=parseInt(account.get("index", "custom"));
                if(!isNaN(index) && index==customIndex) {
                    customIndex=index+1;
                    dirty=true;
                }
            });
        } while(dirty);

        //const wallet=projectItem.props.state.data.dappfile.wallets()[0].name;
        projectItem.props.state.data.dappfile.accounts().push({
            name: name,
            blockchain: "ethereum",
            address: "0x0",
        });
        const account=projectItem.props.state.data.dappfile.getItem("accounts", [{name: name}]);
        account.set("wallet", "development", "browser");
        account.set("index", browserIndex, "browser");
        account.set("wallet", "private", "custom");
        account.set("index", browserIndex, "custom");
        projectItem.props.state.data.dappfile.setItem("accounts", [{name: name}], account);

        projectItem.save((status)=>{
            if(status==0) {
                const account = projectItem.filterNonMenuItem('accounts', {_key: name});
                if(this.props.router.panes) this.props.router.panes.openItem(account);
            }
        });
        this.redrawMain(true);
    };

    _clickNewContract = (e, projectItem) => {
        e.preventDefault();
        e.stopPropagation();

        var name;
        name = prompt("Please give the contract a name:");
        if (!name) return;
        if(!name.match(/^([a-zA-Z0-9-_]+)$/) || name.length > 16) {
            alert('Illegal contract name. Only A-Za-z0-9, dash (-) and underscore (_) allowed. Max 16 characters.');
            return;
        }
        if(projectItem.props.state.data.dappfile.contracts().filter((c)=>{
            return c.name==name;
        }).length>0) {
            alert("A contract by this name already exists, choose a different name, please.");
            return;
        }
        //for(var index=0;index<100000;index++) {
            //name="Contract"+index;
            //if(projectItem.props.state.data.dappfile.contracts().filter((c)=>{
                //return c.name==name;
            //}).length==0) {
                //break;
            //}
        //}
        var account="";
        if(projectItem.props.state.data.dappfile.accounts().length>0) account=projectItem.props.state.data.dappfile.accounts()[0].name
        projectItem.props.state.data.dappfile.contracts().push({
            name: name,
            account: account,
            source: "/contracts/"+name+".sol",
            blockchain: "ethereum",
        });
        projectItem.save((status)=>{
            if(status==0) {
                // Note: children[0] holds the "Transaction Logs", so the actual starting
                //       position for contracts starts at children index 1.
                //
                // TODO: this lookup is bad.
                const ctrs=projectItem.props.state.children[1].props.state._children;

                // Note: The following check asserts there exists at least 1 valid element plus one.
                //       The extra position (plus one) is reserved to the "make contract" prop, appended to the end
                //       of the contracts array (ctrs).
                //       The extra position is the last valid element at index ctrs.length-1
                //       The last valid contract element is at index ctrs.length-2
                if(ctrs && ctrs.length >= 2) {
                    const contract=ctrs[ctrs.length-2];
                    const item=contract.props.state.children[0];
                    if(this.props.router.panes) this.props.router.panes.openItem(item);
                }
            }
        });
        this.redrawMain(true);
    };

    _clickDeleteContract = (e, projectItem, contractIndex) => {
        e.preventDefault();
        e.stopPropagation();
        if(!confirm("Really delete contract?")) return;
        const contract=projectItem.props.state.data.dappfile.contracts()[contractIndex];
        this._closeAnyContractItemsOpen(contract.name, true, (status) => {
            if (status != 0) {
                alert("Could not delete contract, close editor/compiler/deployer/interaction windows and try again.");
                return;
            }
            projectItem.deleteFile(contract.source, (status)=>{
                if(status>0) {
                    alert("Could not delete contract, close editor and try again.");
                    return;
                }
                projectItem.props.state.data.dappfile.contracts().splice(contractIndex,1);
                projectItem.save();
                this.redrawMain(true);
            });
        });
    };

    //_clickDownContract = (e, projectItem, contractIndex) => {
        //e.preventDefault();
        //e.stopPropagation();
        //const c1 = projectItem.props.state.data.dappfile.contracts()[contractIndex];
        //const c2 = projectItem.props.state.data.dappfile.contracts()[contractIndex+1];
        //projectItem.props.state.data.dappfile.contracts()[contractIndex] = c2;
        //projectItem.props.state.data.dappfile.contracts()[contractIndex+1] = c1;
        //projectItem.save();
        //this.redrawMain(true);
    //};

    //_clickUpContract = (e, projectItem, contractIndex) => {
        //e.preventDefault();
        //e.stopPropagation();
        //const c1 = projectItem.props.state.data.dappfile.contracts()[contractIndex];
        //const c2 = projectItem.props.state.data.dappfile.contracts()[contractIndex-1];
        //projectItem.props.state.data.dappfile.contracts()[contractIndex] = c2;
        //projectItem.props.state.data.dappfile.contracts()[contractIndex-1] = c1;
        //projectItem.save();
        //this.redrawMain(true);
    //};

    //_clickDeleteConstant = (e, projectItem, constantIndex) => {
        //e.preventDefault();
        //e.stopPropagation();
        //projectItem.props.state.data.dappfile.constants().splice(constantIndex,1);
        //projectItem.save();
        //this.setState();
    //};

    _clickEditAccount = (e, projectItem, accountIndex) => {
        const account = projectItem.filterNonMenuItem('accounts', {_index: accountIndex});
        this._openItem(e, account);
    };

    _clickDeleteAccount = (e, projectItem, accountIndex) => {
        if(accountIndex==0) {
            alert("You cannot delete the default account.");
            return;
        }
        if(!confirm("Are you sure to delete account?")) return;
        projectItem.props.state.data.dappfile.accounts().splice(accountIndex,1);
        projectItem.save();
        this.redrawMain(true);
    };

    //_renderAccountTitle = (level, index, item) => {
        //var projectItem=item.props.state.project;
        //var accountIndex=item.props.state.index;
        //return (<div class={style.projectContractsTitleContainer} onClick={(e)=>this._openItem(e, item)}>
            //<div>
                //<a href="#">
                    //{item.getTitle()}
                //</a>
            //</div>
            //<div class={style.buttons}>
                //<a href="#" title="Delete account" onClick={(e)=>{this._clickDeleteAccount(e, projectItem, accountIndex);}}>
                    //<IconTrash />
                //</a>
            //</div>
        //</div>);
    //};

    //_renderContractTitle = (level, index, item) => (
        //<ItemContract
            //item={item}
            //openItem={this._openItem}
            //clickUpContract={this._clickUpContract}
            //clickDownContract={this._clickDownContract}
            //clickDeleteContract={this._clickDeleteContract}
        ///>
    //);

    _clickNewFile = (e, item) => {
        e.preventDefault();
        var projectItem=item.props.state.project;
        if(item.props.type=="folder") {
            const file = prompt("Enter new name of file or folder. If folder last character must be a slash (/).");
            if(file) {
                if(!file.match("(^[a-zA-Z0-9-_\.]+[/]?)$")) {
                    alert("Illegal filename.");
                    return false;
                }
                this.backend.newFile(projectItem.props.state.data.dir, item.props.state.path, file, (status) => {
                    if(status==0) {
                        this._reloadProjects();
                    }
                    else {
                        alert("Could not create file/folder.");
                    }
                });
            }
        }
    };

    _clickDeleteFile = (e, item) => {
        e.preventDefault();
        var projectItem=item.props._project;
        if(!confirm("Are you sure to delete " + item.props.state.fullpath + "?")) return false;
        this.backend.deleteFile(projectItem.props.state.data.dir, item.props.state.fullpath, (status) => {
            if(status==0) {
                this._reloadProjects();
            }
            else {
                alert("Could not delate file/folder.");
            }
        });
    };

    _clickRenameFile = (e, item) => {
        e.preventDefault();
        var projectItem=item.props.state.project;
        const file = prompt("Enter new name.", item.props.state.file);
        if(file) {
            if(!file.match("(^[a-zA-Z0-9-_\.]+)$")) {
                alert("Illegal filename.");
                return false;
            }
            this.backend.renameFile(projectItem.props.state.data.dir, item.props.state.fullpath, file, (status) => {
                if(status==0) {
                    const oldFullpath = item.props.state.fullpath;
                    const project = item.props.state.project;
                    const fullpath = item.props.state.path + file + (item.props.type=="folder" ? "/":"");
                    item.props.state.fullpath = fullpath;
                    item.props.state.file = file;
                    item.props.state.title = file;
                    item.reKey(fullpath);
                    console.log("renaming", fullpath, item, project._filecache);
                    if(project._filecache && project._filecache[oldFullpath]) {
                        console.log("move cache");
                        project._filecache[fullpath] = project._filecache[oldFullpath];
                        delete project._filecache[oldFullpath];
                    }
                    this._reloadProjects();
                }
                else {
                    alert("Could not rename file/folder.");
                }
            });
        }
    };

    _validateProject = (project) => {
        // TODO: not complete
        var valid=true;
        if(! (project.dappfile.environments instanceof Array)) {
            valid=false;
        }

        if(!valid) {
            const name = project.dir || "<unknown>";
            console.log("Invalid format of project " + name + ", ignoring.");
            return false;
        }

        return true;
    };

    _xxxreloadProjects = (e, cb, redrawAll) => {
        if(e) e.preventDefault();
        this.backend.loadProjects((status, projects) => {
            if(status!=0) {
                alert('Could not load projects.');
                return;
            }

            for(var index=0;index<projects.length;index++) {
                var project=projects[index];
                if(!this._validateProject(project)) {
                    continue;
                }
                var found=false;
                for(var index2=0;index2<this._projectsList.length;index2++) {
                    var existingItem=this._projectsList[index2];
                    if(project.inode == existingItem.props.inode) {
                        // Update object, keep state.
                        this._updateProject(existingItem, project);
                        found=true;
                        break;
                    }
                }
                if(!found) {
                    var newProject = this._newProject(project);
                    if(newProject) {
                        this._projectsList.push(newProject);
                    }
                }
            }

            for(var index2=0;index2<this._projectsList.length;index2++) {
                var existingItem=this._projectsList[index2];
                var found=false;
                for(var index=0;index<projects.length;index++) {
                    var project=projects[index];
                    if(project.inode == existingItem.props.inode) {
                        found=true;
                        break;
                    }
                }
                if(!found) {
                    this._removeProject(existingItem);
                }
            }

            if(cb) cb(0);
            this.redrawMain(redrawAll);
        });
    };

    _removeProject = (item) => {
        item.props.state.status='removed';
        const index=this._projectsList.indexOf(item);
        if(index>-1) {
            this._projectsList.splice(index,1);
        }
    };

    _deleteProject = (projectItem, cb) => {
        this.backend.deleteProject(projectItem.props.state.data.dir, ()=>{
            this._reloadProjects(null, (status) => {
                cb(status);
            });
        });
    };

    //_getProjectWindowCount=(projectItem)=> {
        //var count=0;
        //if(this.props.router.panes) {
            //this.props.router.panes.panes.map((pane, index)=> {
                //pane.windows.map((win, index2)=> {
                    //if(win.props.item.props.state.project && win.props.item.props.state.project.getId()==projectItem.getId()) {
                        //count++;
                    //}
                //});
            //});
        //}

        //return count;
    //};
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    

    _menuTop = (level, index, item) => <NetworkAccountSelector router={this.props.router} item={item} functions={this.props.functions} />;

    _renderApplicationSectionTitle = (level, index, item) => {
        var projectItem = item.props.state.project;
        return (
            <div class={style.projectContractsTitleContainer} onClick={ (e)=>this._angleClicked(e, item) }>
                <div>
                    { item.getTitle() }
                </div>
                <div class={style.buttons}>
                    <button class="btnNoBg" onClick={(e)=>{ this._openAppPreview(e, item)} } title="Show Preview">
                        <IconShowPreview />
                    </button>
                    <button class="btnNoBg" onClick={(e)=>{ this._openAppComposite(e, item)} } title="Mosaic View">
                        <IconMosaic />
                    </button>
                </div>
            </div>
        );
    };






    render() {
        //const item=this._renderItem(0, 0, this.state.menu);
        const item = this.state.menu.render();
        //item.key="controltree";
        return (
            <div class="full">
                <div class={style.treemenu}>
                    {item}
                    <LearnAndResources class="mt-3"/>
                </div>
            </div>
        );
    }
}

Control.propTypes = {
    appVersion: PropTypes.string.isRequired,
    selectProject: PropTypes.func.isRequired,
    selectedProjectId: PropTypes.number
}
