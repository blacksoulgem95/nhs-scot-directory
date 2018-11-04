import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase/app';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyA_pwB6XIcR_QymjMPCWi0IzQP9FB5emI4",
    authDomain: "nhs-scot-directory.firebaseapp.com",
    databaseURL: "https://nhs-scot-directory.firebaseio.com",
    projectId: "nhs-scot-directory",
    storageBucket: "nhs-scot-directory.appspot.com",
    messagingSenderId: "1073877889221"
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
