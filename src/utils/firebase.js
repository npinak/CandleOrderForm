import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "API_KEY", // from .env
  authDomain: "candleordering.firebaseapp.com",
  projectId: "candleordering",
  storageBucket: "candleordering.appspot.com",
  messagingSenderId: "1039747525001",
  appId: "1:1039747525001:web:3b7bd63d30eaca1a941958",
  measurementId: "G-MTDP2N40F3",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
