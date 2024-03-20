// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKkVrqws9DgTYlT8savM9v9ILhHiQ6w14",
  authDomain: "candleordering.firebaseapp.com",
  projectId: "candleordering",
  storageBucket: "candleordering.appspot.com",
  messagingSenderId: "1039747525001",
  appId: "1:1039747525001:web:3b7bd63d30eaca1a941958",
  measurementId: "G-MTDP2N40F3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
