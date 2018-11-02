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
            console.log(action.data);
            console.log(action);
            return {
            ...state,
            preferences: action.data,
            };
        }
        default:
            return state;
    }
}
