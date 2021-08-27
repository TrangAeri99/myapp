import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store/index';
import {Provider} from "react-redux";
import axios from "axios";
import cookie from 'js-cookie';
import jwt from 'jsonwebtoken';
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react';

const jwt_secret = 'FhENB7OSbPjcSErlFILwN4QyATEQPOu4aAxB4vcZQv0ARBCXVRNU5wrTy8MZTKHv';
let persistor = persistStore(store);
//let token1 = cookie.get('token');


ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App/>
            </PersistGate>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);






// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    reportWebVitals();

