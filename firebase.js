import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA-liJPrVjhV5t3jCdS4akImjOFq69RtyE",
  authDomain: "cyberakshak-d71e9.firebaseapp.com",
  projectId: "cyberakshak-d71e9",
  storageBucket: "cyberakshak-d71e9.firebasestorage.app",
  messagingSenderId: "122273195929",
  appId: "1:122273195929:web:aa4d7820c674cf37109508",
  measurementId: "G-FH0GXQVHW3",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export default app;
