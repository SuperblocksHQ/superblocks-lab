export const panesActions = {
    OPEN_FILE: 'OPEN_FILE',
    openFile(id: string) {
        return {
            type: panesActions.OPEN_FILE,
            data: { id }
        };
    },

    ADD_PANE: 'ADD_PANE',
    addPane(id: string, name: string, fileId: string) {
        return {
            type: panesActions.ADD_PANE,
            data: { id, name, fileId }
        };
    },

    REMOVE_PANE: 'REMOVE_PANE',
    removePane(id: string) {
        return {
            type: panesActions.REMOVE_PANE,
            data: { id }
        };
    },

    SET_ACTIVE_PANE: 'SET_ACTIVE_PANE',
    setActivePane(id: string) {
        return {
            type: panesActions.SET_ACTIVE_PANE,
            data: { id }
        };
    }
};
