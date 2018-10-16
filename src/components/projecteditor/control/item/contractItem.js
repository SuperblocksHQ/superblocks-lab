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

import FileItem from './fileItem';

export default class ContractItem extends FileItem {
    constructor(props, router) {
        props.type2 = props.type2 || "contract";
        super(props, router);
    }

    /**
     * Notifies us the contract file has been deleted.
     * Tell the project to delete it from the dappfile.
     *
     */
    notifyDeleted = () => {
        return new Promise( (resolve) => {
            this.getProject().deleteContract(this.getSource(), () => {
                // Close the contract item if open
                if(this.router.panes) this.router.panes.closeItem(this, null, true);

                // Close the child items if open
                this.getChildren().map( (item) => {
                    if(this.router.panes) this.router.panes.closeItem(item, null, true);
                });

                this._deleteContractBuildFiles(this.getSource());
                resolve();
            });
        });
    }

    /**
     * Delete the build directory for this contract source file.
     *
     */
    _deleteContractBuildFiles = (source, cb) => {
        const a = source.match(/^(.*\/)([^/]+)$/);
        const dir=a[1];
        const filename=a[2];
        const a2 = filename.match(/^([^.]+)\.sol$/);
        const contractName = a2[1];
        const path = "/build" + dir + contractName;

        this.getProject().getItemByPath(path.split('/'), this.getProject())
            .then( (item) => {
                item.delete()
                    .then( () => {if (cb) cb(0)});
            })
            .catch( () => {if (cb) cb(0)});
    };

    _moveContractBuildFiles = (source) => {
        // TODO
    };

    /**
     * Notifies us the contract file has been renamed.
     * Tell the project to update the dappfile.
     *
     */
    notifyMoved = (oldPath, cb) => {
        return new Promise( (resolve) => {
            console.log("notify moved", oldPath, this.getFullPath());
            this.getProject().moveContract(oldPath, this.getFullPath(), resolve);
            this._setSource(this.getFullPath());
            this._moveContractBuildFiles(this.getSource());
        });
    }

    /**
     * Set the source of the contract.
     * Note when renaming we must update this so that it matches the getFullPath of the parent fileItem.
     */
    _setSource = (source) => {
        this.props.state.source = source;
    };

    /**
     * Return the source path for the contract file, as defined in the dappfile.
     */
    getSource = () => {
        return this.props.state.source;
    };

    /**
     * Return the arguments for this contract.
     */
    getArgs = () => {
        return this.props.state.args;
    };

    /**
     * Set the arguments for the contract.
     */
    setArgs = (args) => {
        this.props.state.args = args;
    };

    /**
     * Set this items key values to a new key.
     *
     */
    reKey = (newkey, newFullPath) => {
        this.props.state.source = newFullPath;
        this.props.state.key = newkey;
    };
}
