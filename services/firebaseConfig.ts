import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
<<<<<<< HEAD
import { getFirestore } from "firebase/firestore";
=======
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
>>>>>>> 42690ce0d4878a0ec6d7df8560ebcde8b52428b2

const firebaseConfig = {
  apiKey: "AIzaSyATSr9vJ1gnkRqcCe6NAyKMpGRCv_c9T-8",
  authDomain: "marketflow-dd22e.firebaseapp.com",
  projectId: "marketflow-dd22e",
  storageBucket: "marketflow-dd22e.firebasestorage.app",
  messagingSenderId: "187898962121",
  appId: "1:187898962121:web:fd2c2f4463e4d217d56d18",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
<<<<<<< HEAD
export const db = getFirestore(app);
=======
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
>>>>>>> 42690ce0d4878a0ec6d7df8560ebcde8b52428b2
