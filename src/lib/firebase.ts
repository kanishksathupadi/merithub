
import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import * as admin from 'firebase-admin';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase client app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);


// Initialize Firebase Admin SDK for server-side operations
// This prevents initialization on the client side.
if (typeof window === 'undefined' && !admin.apps.length) {
    try {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;
        if (process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: privateKey.replace(/\\n/g, '\n'),
                }),
            });
            console.log('Firebase Admin SDK initialized successfully.');
        } else {
            console.warn('Firebase Admin credentials are not set. Skipping Admin SDK initialization.');
        }
    } catch (error) {
        console.error('Firebase Admin SDK initialization error:', error);
    }
}

const adminDb = admin.apps.length ? admin.firestore() : null;

if (process.env.NODE_ENV === 'development' && typeof window === 'undefined' && !adminDb) {
    console.warn('Firebase Admin SDK is not initialized. Some server-side operations might fail if they rely on admin privileges.');
}


export { app, db, auth, adminDb };
