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
import Dappfile from '../dappfile';

export default class DappfileItem extends FileItem {
    constructor(props, router) {
        props.type2 = props.type2 || "dappfile";
        props.state.file = props.state.file || "dappfile.json";
        props.state.title = props.state.title || "dappfile.json";
        super(props, router);

        this.props.state.contents = "{}";
        this.setReadOnly(true);

        // NOTE (FIXME): this is how I shadow parent functions. simply `super.load()` didn't work for me.
        this._load = this.load;
        this.load = this.__load;
        delete this.__load;
        this._save = this.save;
        this.save = this.__save;
        delete this.__save;
    }

    /**
     * Load the Dappfile.json contents from storage.
     * Note: This actually shadows super.load.
     *
     */
    __load = () => {
        return new Promise( (resolve, reject) => {
            this._load().then( () => {
                // Decode JSON
                try {
                    const dappfileObj = JSON.parse(this.getContents());
                    if (!Dappfile.validateDappfile(dappfileObj)) {
                        throw("Invalid dappfile.json.");
                    }
                    this.props.state.dappfile = new Dappfile(dappfileObj);
                }
                catch (e) {
                    console.error(e);
                    this.props.state.dappfile = new Dappfile();
                }
                resolve();
            }).catch( () => {
                this.props.state.dappfile = new Dappfile(this._getDefaultDappfile());
                this.save().then( () => {
                    resolve();
                }).catch( () => {
                    reject();
                });
            });
        })
    };

    /**
     * Save the Dappfile.json contents to storage.
     * Note: This actually shadows super.save.
     *
     */
    __save = () => {
        this.setContents(this.getDappfile().dump());
        return this._save();
    }

    getDappfile = () => {
        return this.props.state.dappfile;
    };

    _getDefaultDappfile = () => {
        const obj = {
            "environments": [
                {
                    "name": "browser"
                },
                {
                    "name": "custom"
                },
                {
                    "name": "rinkeby"
                },
                {
                    "name": "ropsten"
                },
                {
                    "name": "kovan"
                },
                {
                    "name": "infuranet"
                },
                {
                    "name": "mainnet"
                }
            ],
            "contracts": [
                {
                    "source": "/contracts/MyContract.sol",
                    "args": [],
                    "blockchain": "ethereum",
                    "name": "MyContract",
                    "network": "browser"
                }
            ],
            "wallets": [
                {
                    "desc": "This is a wallet for local development",
                    "name": "development",
                    "blockchain": "ethereum"
                },
                {
                    "desc": "A private wallet",
                    "name": "private",
                    "blockchain": "ethereum"
                },
                {
                    "desc": "External wallet integrating with Metamask and other compatible wallets",
                    "name": "external",
                    "blockchain": "ethereum",
                    "type": "external"
                }
            ],
            "accounts": [
                {
                    "name": "Default",
                    "blockchain": "ethereum",
                    "_environments": [
                        {
                            "name": "browser",
                            "data": {
                                "wallet": "development",
                                "index": 0
                            }
                        },
                        {
                            "name": "custom",
                            "data": {
                                "wallet": "private",
                                "index": 0
                            }
                        },
                        {
                            "name": "rinkeby",
                            "data": {
                                "wallet": "external",
                                "index": 0
                            }
                        },
                        {
                            "name": "ropsten",
                            "data": {
                                "wallet": "external",
                                "index": 0
                            }
                        },
                        {
                            "name": "kovan",
                            "data": {
                                "wallet": "external",
                                "index": 0
                            }
                        },
                        {
                            "name": "infuranet",
                            "data": {
                                "wallet": "external",
                                "index": 0
                            }
                        },
                        {
                            "name": "mainnet",
                            "data": {
                                "wallet": "external",
                                "index": 0
                            }
                        }
                    ]
                }
            ]
        };
        return obj;
    };
}
