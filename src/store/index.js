//import {createStore} from 'redux';
import AllReducers from "./reducers/AllReducers";
// import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'


// const store = createStore(AllReducers, initialStates,
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
//
//  export default store;

import {configureStore} from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';

const initialStates ={
    auth:{
        loggedIn : false,
        user: {name:null},
        test: 1,
        token: null,
        expires_in: null,
        exp_token: null,
        refresh: null
    }
};

const persistConfig = {
    key: 'root',
    storage
};

const persistedReducer = persistReducer(persistConfig, AllReducers);

const store = configureStore({
    reducer: persistedReducer,
    initialStates ,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunk]
});

export default store;