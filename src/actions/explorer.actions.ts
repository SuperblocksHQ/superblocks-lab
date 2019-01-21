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

export const explorerActions = {
    RENAME_FILE: 'RENAME_FILE',
    renameFile(id: any, name: string) { // maybe should use filepath instead
        return {
            type: explorerActions.RENAME_FILE,
            data: { id, name }
        };
    },

    TOGGLE_TREE_ITEM: 'TOGGLE_TREE_ITEM',
    toggleTreeItem(id: any) {
        return {
            type: explorerActions.TOGGLE_TREE_ITEM,
            data: { id }
        };
    },

    OPEN_FILE: 'OPEN_FILE',
    openFile(id: any) {
        return {
            type: explorerActions.OPEN_FILE,
            data: { id }
        };
    },

    // --------- Contract specific

    CONFIGURE_CONTRACT: 'CONFIGURE_CONTRACT',
    configureContract(id: any, name: string) {
        return {
            type: explorerActions.CONFIGURE_CONTRACT,
            data: { id, name }
        };
    },

    COMPILE_CONTRACT: 'COMPILE_CONTRACT',
    compileContract(id: any, name: string) {
        return {
            type: explorerActions.COMPILE_CONTRACT,
            data: { id, name }
        };
    },

    DEPLOY_CONTRACT: 'DEPLOY_CONTRACT',
    deployContract(id: any, name: string) {
        return {
            type: explorerActions.DEPLOY_CONTRACT,
            data: { id, name }
        };
    },

    INTERACT_CONTRACT: 'INTERACT_CONTRACT',
    interactContract(id: any, name: string) {
        return {
            type: explorerActions.INTERACT_CONTRACT,
            data: { id, name }
        };
    },

    // ----- Context menu

    CREATE_FILE: 'CREATE_FILE',
    createFile(parentId: any) {
        return {
            type: explorerActions.CREATE_FILE,
            data: { parentId }
        };
    },

    IMPORT_FILE: 'IMPORT_FILE',
    importFile(parentId: any) {
        return {
            type: explorerActions.IMPORT_FILE,
            data: { parentId }
        };
    },

    CREATE_FOLDER: 'CREATE_FOLDER',
    createFolder(parentId: any) {
        return {
            type: explorerActions.CREATE_FOLDER,
            data: { parentId }
        };
    },

    RENAME_ITEM: 'RENAME_ITEM',
    renameItem(id: any) {
        return {
            type: explorerActions.RENAME_ITEM,
            data: { id }
        };
    },

    DELETE_ITEM: 'DELETE_ITEM',
    deleteItem(id: any) {
        return {
            type: explorerActions.DELETE_ITEM,
            data: { id }
        };
    }
};
