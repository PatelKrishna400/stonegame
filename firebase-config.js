// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgXkYDUXePRc64aM0hPwR1QBHI83RKLTc",
  authDomain: "earningstotap.firebaseapp.com",
  projectId: "earningstotap",
  storageBucket: "earningstotap.firebasestorage.app",
  messagingSenderId: "463829984556",
  appId: "1:463829984556:web:bb5e761f862a981a543889",
  measurementId: "G-79JRM4CK1Z"
};

// Initialize Firebase (using CDN version for simplicity in existing HTML files)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db, doc, setDoc, getDoc, updateDoc, getDocs, collection, analytics };
