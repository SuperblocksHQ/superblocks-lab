import { sidePanelsActions } from '../actions';

export const initialState = {
    showTransactionsHistory: false,
    showPreview: false
};

export default function sidePanelsReducer(state = initialState, action) {
    switch (action.type) {
        case sidePanelsActions.CLOSE_ALL_PANELS: {
            return {
                ...state,
                showTransactionsHistory: false,
                showPreview: false
            };
        }
        case sidePanelsActions.TOGGLE_TRANSACTIONS_HISTORY_PANEL: {
            return {
                ...state,
                showTransactionsHistory: !state.showTransactionsHistory,
                showPreview: false
            };
        }
        case sidePanelsActions.OPEN_TRANSACTIONS_HISTORY_PANEL: {
            return {
                ...state,
                showTransactionsHistory: true,
                showPreview: false
            };
        }
        case sidePanelsActions.CLOSE_TRANSACTIONS_HISTORY_PANEL: {
            return {
                ...state,
                showTransactionsHistory: false
            };
        }
        case sidePanelsActions.TOGGLE_PREVIEW_PANEL:
            return {
                ...state,
                showTransactionsHistory: false,
                showPreview: !state.showPreview
            };
        default:
            return state;
    }
}
