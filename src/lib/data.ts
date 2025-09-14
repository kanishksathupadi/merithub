
import { collection, doc, getDoc, getDocs, setDoc, query, where, orderBy, limit, updateDoc, increment } from "firebase/firestore";
import { db } from './firebase';
import { v4 as uuidv4 } from 'uuid';

// --- USER MANAGEMENT ---
export const findUserByEmail = async (email: string) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return null;
    }
    return querySnapshot.docs[0].data();
};

export const addUser = async (user: any) => {
    const userRef = doc(db, "users", user.userId);
    await setDoc(userRef, user);
    return user;
};

export const updateUser = async (userId: string, updatedData: any) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, updatedData);
    return { ...updatedData };
};


// --- STATS TRACKING ---
export const getGlobalStats = async () => {
    const statsRef = doc(db, "meta", "globalStats");
    const usersCollectionRef = collection(db, "users");

    const [statsSnap, usersSnap] = await Promise.all([
        getDoc(statsRef),
        getDocs(usersCollectionRef)
    ]);

    const studentCount = usersSnap.size;
    let stats = statsSnap.exists() ? statsSnap.data() : {};

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
};

export const incrementStat = async (statName: 'collegesFound' | 'essaysReviewed' | 'scholarshipsFound') => {
    const statsRef = doc(db, "meta", "globalStats");
    await updateDoc(statsRef, {
        [statName]: increment(1)
    }, { merge: true });
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
