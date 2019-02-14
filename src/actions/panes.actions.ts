import { IProjectItem } from '../models';

export const panesActions = {
    OPEN_FILE: 'OPEN_FILE',
    openFile(file: IProjectItem) {
        return {
            type: panesActions.OPEN_FILE,
            data: file
        };
    },

    CLOSE_PANE: 'CLOSE_PANE',
    closePane(fileId: string) {
        return {
            type: panesActions.CLOSE_PANE,
            data: { id: fileId }
        };
    },

    CLOSE_ALL_OTHER_PANES: 'CLOSE_ALL_OTHER_PANES',
    closeAllOtherPanes(fileId: string) {
        return {
            type: panesActions.CLOSE_ALL_OTHER_PANES,
            data: { id: fileId }
        };
    },

    CLOSE_ALL_PANES: 'CLOSE_ALL_PANES',
    closeAllPanes() {
        return {
            type: panesActions.CLOSE_ALL_PANES
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
