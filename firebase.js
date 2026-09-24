import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAl1I-6zDNuiZ2IMpfSsjhIyPWpJrJM1qA",
    authDomain: "cyberakshak-c02c2.firebaseapp.com",
    projectId: "cyberakshak-c02c2",
    storageBucket: "cyberakshak-c02c2.firebasestorage.app",
    messagingSenderId: "943821986123",
    appId: "1:943821986123:web:8ce0d14d1e0b349d4b70ce",
    measurementId: "G-R2S5SDQTY7",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export default app;