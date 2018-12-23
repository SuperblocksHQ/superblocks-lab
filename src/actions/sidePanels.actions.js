export const sidePanelsActions = {
    CLOSE_ALL_PANELS: 'CLOSE_ALL_PANELS',
    closeAllPanels() {
        return {
            type: sidePanelsActions.CLOSE_ALL_PANELS
        };
    },

    TOGGLE_TRANSACTIONS_HISTORY_PANEL: 'TOGGLE_TRANSACTIONS_HISTORY_PANEL',
    toggleTransactionsHistoryPanel() {
        return { type: sidePanelsActions.TOGGLE_TRANSACTIONS_HISTORY_PANEL };
    },

    OPEN_TRANSACTIONS_HISTORY_PANEL: 'OPEN_TRANSACTIONS_HISTORY_PANEL',
    openTransactionsHistoryPanel() {
        return { type: sidePanelsActions.OPEN_TRANSACTIONS_HISTORY_PANEL };
    },

    CLOSE_TRANSACTIONS_HISTORY_PANEL: 'CLOSE_TRANSACTIONS_HISTORY_PANEL',
    closeTransactionsHistoryPanel() {
        return { type: sidePanelsActions.CLOSE_TRANSACTIONS_HISTORY_PANEL };
    },

    SHOW_PREVIEW_PANEL: 'SHOW_PREVIEW_PANEL',
    showPreviewPanel() {
        return {
            type: sidePanelsActions.SHOW_PREVIEW
        };
    },

    TOGGLE_PREVIEW_PANEL: 'TOGGLE_PREVIEW_PANEL',
    togglePreviewPanel() {
        return {
            type: sidePanelsActions.TOGGLE_PREVIEW_PANEL
        };
    }
};
