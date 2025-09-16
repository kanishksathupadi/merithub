
import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";

// This file is now ONLY for client-side SDK initialization, if ever needed.
// All server-side Admin SDK logic has been removed to prevent build errors.

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Since we are not using Firebase Auth or Firestore anymore, we don't need to export db or auth.
// We keep the basic app initialization in case another library depends on it.

export { app };
