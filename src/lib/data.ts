
'use server';
import { collection, doc, getDoc, getDocs, setDoc, query, where, orderBy, limit, updateDoc, increment } from "firebase/firestore";
import { db } from './firebase';
import { v4 as uuidv4 } from 'uuid';

// This file directly interacts with Firebase Firestore.
// It should only be called from Server Actions or other server-side code.

// --- USER MANAGEMENT ---
export const findUserByEmail = async (email: string) => {
    console.log("DATABASE: findUserByEmail called for", email);
    if (!email) return null;
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        console.log("DATABASE: No user found with email", email);
        return null;
    }
    console.log("DATABASE: User found with email", email);
    return querySnapshot.docs[0].data();
};

export const findUserById = async (userId: string) => {
    if (!userId) return null;
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return userSnap.data();
    }
    return null;
};

export const updateUser = async (userId: string, updatedData: any) => {
    if (!userId) throw new Error("User ID is required to update.");
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, updatedData);
    return { userId, ...updatedData };
};


// --- STATS TRACKING ---
export const getGlobalStats = async () => {
    const statsRef = doc(db, "meta", "globalStats");
    const usersCollectionRef = collection(db, "users");

    try {
        const [statsSnap, usersSnap] = await Promise.all([
            getDoc(statsRef),
            getDocs(usersCollectionRef)
        ]);

        const studentCount = usersSnap.size;
        let stats = statsSnap.exists() ? statsSnap.data() : {};

        // This object defines the minimum value for each stat.
        const baseline = {
            students: 10,
            collegesFound: 4,
            essaysReviewed: 10,
            scholarshipsFound: 8,
        };
        
        return {
            students: Math.max(studentCount, baseline.students),
            colleges: Math.max(stats.collegesFound || 0, baseline.collegesFound),
            scholarships: Math.max(stats.scholarshipsFound || 0, baseline.scholarshipsFound),
            essays: Math.max(stats.essaysReviewed || 0, baseline.essaysReviewed),
        };
    } catch (error) {
        console.error("Error fetching global stats:", error);
        // Return baseline if Firestore fails
        return { students: 10, colleges: 4, scholarships: 8, essays: 10 };
    }
};

export const incrementStat = async (statName: 'collegesFound' | 'essaysReviewed' | 'scholarshipsFound') => {
    const statsRef = doc(db, "meta", "globalStats");
    try {
        // This atomically increments the value in Firestore.
        await updateDoc(statsRef, {
            [statName]: increment(1)
        });
    } catch (error) {
        // If the document doesn't exist, create it.
        if ((error as any).code === 'not-found') {
            await setDoc(statsRef, { [statName]: increment(1) }, { merge: true });
        } else {
            console.error(`Failed to increment stat '${statName}':`, error);
        }
    }
};


// --- ADMIN DATA ---
export const getAllUsersForAdmin = async () => {
    const usersCollectionRef = collection(db, "users");
    const usersSnap = await getDocs(usersCollectionRef);
    return usersSnap.docs.map(doc => doc.data());
};

export const getRecentSignupsForAdmin = async () => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("signupTimestamp", "desc"), limit(4));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
};

export const getAllContactMessages = async () => {
    const messagesRef = collection(db, "contactMessages");
    const q = query(messagesRef, orderBy("submittedAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
};

export const addContactMessage = async (message: any) => {
    const messageId = uuidv4();
    const messageRef = doc(db, "contactMessages", messageId);
    await setDoc(messageRef, { ...message, id: messageId });
};

export const getAllJobApplications = async () => {
    const appsRef = collection(db, "jobApplications");
    const q = query(appsRef, orderBy("submittedAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
};

export const addJobApplication = async (application: any) => {
    const appId = uuidv4();
    const appRef = doc(db, "jobApplications", appId);
    await setDoc(appRef, { ...application, id: appId });
};

export const getAllSupportRequests = async () => {
    const requestsRef = collection(db, "supportRequests");
    const snapshot = await getDocs(requestsRef);
    return snapshot.docs.map(doc => doc.data());
};

export const updateSupportRequest = async (userId: string, requestData: any) => {
    const requestRef = doc(db, "supportRequests", userId);
    await setDoc(requestRef, requestData, { merge: true });
};
