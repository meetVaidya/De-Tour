import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyANnRIFcoWkivMBzKBKnXqmMm_9LVdxpaE",

  authDomain: "detour-a4970.firebaseapp.com",

  projectId: "detour-a4970",

  storageBucket: "detour-a4970.firebasestorage.app",

  messagingSenderId: "403703017604",

  appId: "1:403703017604:web:f52a5ea23fb33d5fbf92d1",

  measurementId: "G-KVRRY14CZJ",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
