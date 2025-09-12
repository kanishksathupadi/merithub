
// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
let db: any = {}; // Use a dummy object when not initialized

try {
    if (!getApps().length) {
        // Avoid initialization if config is just a placeholder
        if (firebaseConfig.projectId !== "YOUR-PROJECT-ID") {
            app = initializeApp(firebaseConfig);
            db = getFirestore(app);
        } else {
            console.warn("Firebase config is not set. Database features will be disabled.");
        }
    } else {
        app = getApps()[0];
        db = getFirestore(app);
    }
} catch (error) {
    console.error("Firebase initialization failed:", error);
}


export { db };
