import React, { Component } from 'react'
import App from 'base-shell/lib'
import liff from '@line/liff';
import _config from './config'


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const local = window.location.href.includes('ngrok')
const firebaseConfig = {
  apiKey: "AIzaSyAgs5Y_9TxW-9PR8DSa_TEmE9QbP5kdJQA",
  authDomain: "tamniyombot65-eafd4.firebaseapp.com",
  databaseURL: local ? "https://098a-27-55-86-69.ap.ngrok.io/?ns=tamniyombot65-eafd4-default-rtdb" : "https://tamniyombot65-eafd4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tamniyombot65-eafd4",
  storageBucket: "tamniyombot65-eafd4.appspot.com",
  messagingSenderId: "121184932080",
  appId: "1:121184932080:web:161e2e014381f611ad7235",
  measurementId: "G-9WMNQ47H4Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default class Demo extends Component {


  componentDidMount() {

    liff.init({
      liffId: window.location.href.includes('ngrok') ?  '1657071212-rR1Jeza6' : '1657071212-D1LxVWKg',
      withLoginOnExternalBrowser: true, // Enable automatic login process
    })
    
  }


  render() {
    return <App config={_config} />
  }
}
