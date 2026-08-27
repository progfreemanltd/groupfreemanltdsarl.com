// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCngoFylxxSqOwggReYP1_pXz4XvnQl0ec",
  authDomain: "groupfreemanltd.firebaseapp.com",
  projectId: "groupfreemanltd",
  storageBucket: "groupfreemanltd.firebasestorage.app",
  messagingSenderId: "1039716180912",
  appId: "1:1039716180912:web:33ae82e563c34a24962c75",
  measurementId: "G-XDNFTVEJ9F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// Analytics conditionally initialized (only supported in browser environments)
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
