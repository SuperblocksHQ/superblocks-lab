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
    }
};
