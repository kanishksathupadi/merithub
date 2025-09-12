
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration - REPLACE WITH YOUR CONFIG
// You can get this from your project's settings in the Firebase console
const firebaseConfig = {
  // This is a placeholder configuration.
  // To use Firebase features, you will need to replace this
  // with your own project's configuration from the Firebase console.
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "YOUR-PROJECT-ID.firebaseapp.com",
  projectId: "YOUR-PROJECT-ID",
  storageBucket: "YOUR-PROJECT-ID.appspot.com",
  messagingSenderId: "YOUR-SENDER-ID",
  appId: "1:YOUR-SENDER-ID:web:XXXXXXXXXXXXXXXXXXXXXX",
  measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase
let app;
if (firebaseConfig.projectId !== "YOUR-PROJECT-ID" && getApps().length === 0) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else if (getApps().length > 0) {
  app = getApps()[0];
}

const db = app ? getFirestore(app) : {};

export { db };
