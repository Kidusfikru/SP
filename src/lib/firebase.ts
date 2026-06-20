import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';

// Default configuration from firebase-applet-config.json
const defaultFirebaseConfig = {
  projectId: "gen-lang-client-0287166169",
  appId: "1:864916821781:web:1b5e8a3f06cf37fe9c3b1c",
  apiKey: "AIzaSyAABfR2b3Am__YF1h8sYrlk6tmilR0FOEU",
  authDomain: "gen-lang-client-0287166169.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-e2277c81-afa8-4ca3-bd79-6ac241b0aeca",
  storageBucket: "gen-lang-client-0287166169.firebasestorage.app",
  messagingSenderId: "864916821781",
};

// Flexible config choosing environment variables or fallback values
const metaEnv = (import.meta as any).env || {};
const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || defaultFirebaseConfig.apiKey,
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || defaultFirebaseConfig.authDomain,
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || defaultFirebaseConfig.projectId,
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || defaultFirebaseConfig.storageBucket,
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultFirebaseConfig.messagingSenderId,
  appId: metaEnv.VITE_FIREBASE_APP_ID || defaultFirebaseConfig.appId,
};

// Since we have a custom database id in some settings, we handle it if specified
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Firestore (handling custom databaseId if configured)
export const db = getFirestore(app, defaultFirebaseConfig.firestoreDatabaseId || "default");

export {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit
};
