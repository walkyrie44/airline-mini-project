import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBSXXrHVv5-IFkmwKTxsEpov9_S32wOeB4",
    authDomain: "bear-wings.firebaseapp.com",
    projectId: "bear-wings",
    storageBucket: "bear-wings.appspot.com",
    messagingSenderId: "632946914078",
    appId: "1:632946914078:web:16adcab55de1b5fc910f0f"
};

initializeApp(firebaseConfig)

const db = getFirestore()
export default db