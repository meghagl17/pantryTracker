// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_sYggX-4c1zgRUqcDNJripR23CaGEr4c",
  authDomain: "pantry-tracker-60bee.firebaseapp.com",
  projectId: "pantry-tracker-60bee",
  storageBucket: "pantry-tracker-60bee.appspot.com",
  messagingSenderId: "218975271371",
  appId: "1:218975271371:web:01ecc23bbfbe119a029e4e",
  measurementId: "G-LDQJB85JNK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}