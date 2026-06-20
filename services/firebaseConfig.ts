import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyATSr9vJ1gnkRqcCe6NAyKMpGRCv_c9T-8",
  authDomain: "marketflow-dd22e.firebaseapp.com",
  projectId: "marketflow-dd22e",
  storageBucket: "marketflow-dd22e.firebasestorage.app",
  messagingSenderId: "187898962121",
  appId: "1:187898962121:web:fd2c2f4463e4d217d56d18",
};

const app = initializeApp(firebaseConfig);

const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };