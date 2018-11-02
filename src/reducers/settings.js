import Store from '../store/settings';

export const initialState = Store;

export default function settingsReducer(state = initialState, action) {
    switch (action.type) {
        case 'SHOW_SPLASH': {
            return {
                ...state,
                showSplash: action.data,
            };
        }
        case 'SAVE_PREFERENCES': {
            return {
                ...state,
                preferences: {
                    chain: {
                        gasLimit: action.data.chain.gasLimit ? action.data.chain.gasLimit : initialState.preferences.chain.gasLimit, // Make sure to fallback into the default when left empty
                        gasPrice: action.data.chain.gasPrice ? action.data.chain.gasPrice : initialState.preferences.chain.gasPrice // Make sure to fallback into the default when left empty
                    }
                },
            };
        }
        default:
            return state;
    }
}
