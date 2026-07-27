import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2upjhuJjtL-uUlqTtgooHo7MwhySWDB8",
  authDomain: "stavya-dcpl.firebaseapp.com",
  projectId: "stavya-dcpl",
  storageBucket: "stavya-dcpl.firebasestorage.app",
  messagingSenderId: "498555229494",
  appId: "1:498555229494:web:238f7e4f485b5b417acf97",
  measurementId: "G-3G7RXQ6R5Z"
};

// Initialize Firebase only if it hasn't been initialized already (fixes Next.js HMR issues)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
