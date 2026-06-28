// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';

// Nabha Dip Academy Secondary English School Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBhGb7bbzAu-Xq9u6wHvL8829EOcZ9yrwk",
  authDomain: "ndases.firebaseapp.com",
  projectId: "ndases",
  storageBucket: "ndases.appspot.com",
  messagingSenderId: "569939627268",
  appId: "1:569939627268:web:d8b60bb9adb286ea63d451",
  measurementId: "G-N182J0K9M3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (err) {
    console.warn('Firebase Analytics could not be initialized:', err);
  }
}

export { app, auth, db, analytics, storage };
