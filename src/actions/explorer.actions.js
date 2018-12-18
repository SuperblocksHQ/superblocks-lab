export const explorerActions = {
    TOGGLE_TREE_ITEM: 'TOGGLE_TREE_ITEM',
    toggleTreeItem(id) {
        return {
            type: explorerActions.TOGGLE_TREE_ITEM,
            data: { id }
        }
    },

    OPEN_FILE: 'OPEN_FILE',
    openFile(id) {
        return {
            type: explorerActions.OPEN_FILE,
            data: { id }
        };
    },
    
    RENAME_FILE: 'RENAME_FILE',
    renameFile(id, name) {
        return {
            type: explorerActions.RENAME_FILE,
            data: { id, name }
        };
    },

    // --------- Contract specific

    CONFIGURE_CONTRACT: 'CONFIGURE_CONTRACT',
    configureContract(id, name) {
        return {
            type: explorerActions.CONFIGURE_CONTRACT,
            data: { id, name }
        };
    },

    COMPILE_CONTRACT: 'COMPILE_CONTRACT',
    compileContract(id, name) {
        return {
            type: explorerActions.COMPILE_CONTRACT,
            data: { id, name }
        };
    },

    DEPLOY_CONTRACT: 'DEPLOY_CONTRACT',
    deployContract(id, name) {
        return {
            type: explorerActions.DEPLOY_CONTRACT,
            data: { id, name }
        };
    },

    INTERACT_CONTRACT: 'INTERACT_CONTRACT',
    interactContract(id, name) {
        return {
            type: explorerActions.INTERACT_CONTRACT,
            data: { id, name }
        };
    },

    // ----- Context menu

    CREATE_FILE: 'CREATE_FILE',
    createFile(parentId) {
        return {
            type: explorerActions.CREATE_FILE,
            data: { parentId }
        };
    },

    IMPORT_FILE: 'IMPORT_FILE',
    importFile(parentId) {
        return {
            type: explorerActions.IMPORT_FILE,
            data: { parentId }
        };
    },

    CREATE_FOLDER: 'CREATE_FOLDER',
    createFolder(parentId) {
        return {
            type: explorerActions.CREATE_FOLDER,
            data: { parentId }
        };
    },

    RENAME_ITEM: 'RENAME_ITEM',
    renameItem(id) {
        return {
            type: explorerActions.RENAME_ITEM,
            data: { id }
        };
    },

    DELETE_ITEM: 'DELETE_ITEM',
    deleteItem(id) {
        return {
            type: explorerActions.DELETE_ITEM,
            data: { id }
        };
    }
};
