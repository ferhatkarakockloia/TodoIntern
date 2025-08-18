import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAScCUiDDU6TmyI7wv8HPk-A5ceXgiANBA",
  authDomain: "todoapp-96637.firebaseapp.com",
  projectId: "todoapp-96637",
  storageBucket: "todoapp-96637.firebasestorage.app",
  messagingSenderId: "1075917473960",
  appId: "1:1075917473960:web:a9e3669e66f96c1ebd1a9d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence);
const db = getFirestore(app);

export { app, auth , db};