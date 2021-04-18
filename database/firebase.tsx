// https://www.positronx.io/react-native-firebase-login-and-user-registration-tutorial/

import * as fire from "firebase";
import "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZDQthfbetEIBp_Ej5ZdjKObbkJpJ1sdE",
  authDomain: "travler-b7ef2.firebaseapp.com",
  databaseURL:
    "https://travler-b7ef2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "travler-b7ef2",
  storageBucket: "travler-b7ef2.appspot.com",
  messagingSenderId: "883985629751",
  appId: "1:883985629751:web:3b089bcce3c31531a235b2",
  measurementId: "G-VZBV3SL2ES",
};

export const firebase = fire.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();
