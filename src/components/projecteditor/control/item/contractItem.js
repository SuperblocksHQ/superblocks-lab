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
        this.getProject().deleteContract(this.getSource());
    }

    /**
     * Notifies us the contract file has been renamed.
     * Tell the project to update the dappfile.
     *
     */
    notifyMoved = (oldPath, cb) => {
        this.getProject().moveContract(oldPath, this.getFullPath(), cb);
    }

    /**
     * Return the source path for the contract file.
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
