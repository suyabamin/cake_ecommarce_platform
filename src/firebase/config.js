import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAU7jeg9jAyU44HeLdB5tDbUZYMGsePUGA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "velvet-frost-cakes.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "velvet-frost-cakes",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "velvet-frost-cakes.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "323995076270",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:323995076270:web:30638f6c34c079af090f3f"
};

// Initialize Firebase App safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
