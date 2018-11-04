/* global window */
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // default: localStorage if web
import thunk from 'redux-thunk';
import reducers from '../reducers';

// Redux Persist config
const config = {
    key: 'root',
    storage,
    blacklist: ['app'],
};

const reducer = persistCombineReducers(config, reducers);

const middleware = [thunk];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = () => {
    const store = createStore(
        reducer,
        composeEnhancers(
            applyMiddleware(...middleware)
        )
    );

    const persistor = persistStore(store);

    return { persistor, store };
};

export default configureStore;
