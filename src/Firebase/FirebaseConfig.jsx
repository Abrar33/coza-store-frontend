// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBRHC42s061LYxvpbriSdrHK2VFxfAjnU",
  authDomain: "react-hooks-cd40c.firebaseapp.com",
  databaseURL: "https://react-hooks-cd40c-default-rtdb.firebaseio.com",
  projectId: "react-hooks-cd40c",
  storageBucket: "react-hooks-cd40c.firebasestorage.com",
  messagingSenderId: "49246439323",
  appId: "1:49246439323:web:fbaeb6a97d984131d9433e",
  measurementId: "G-S40PEFVJLG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);