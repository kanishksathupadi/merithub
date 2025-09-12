
import { doc, updateDoc, increment as firestoreIncrement, onSnapshot, query, orderBy, limit, collection, getDocs, setDoc, getDoc } from "firebase/firestore";
import { db } from '@/lib/firebase';

// --- USER MANAGEMENT ---

export const findUserByEmail = async (email: string) => {
    if (!db) return null;
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => doc.data());
    const user = users.find(u => u.email === email);

    if (user && user.userId) {
        const userDoc = await getDoc(doc(db, "users", user.userId));
        return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
};

export const getAllUsers = async () => {
    if (!db) return [];
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


// --- STATS TRACKING ---

// This function can only be used on the server, as it uses the Admin SDK.
// The `get-global-stats.ts` flow is the server-side entrypoint.
export const incrementStat = async (statName: 'totalUsers' | 'collegesFound' | 'essaysReviewed' | 'scholarshipsFound', value: number = 1) => {
    if (!db) return;
    const statsDocRef = doc(db, 'stats', 'global');
    try {
        const docSnap = await getDoc(statsDocRef);
        if (!docSnap.exists()) {
            await setDoc(statsDocRef, {
                collegesFound: 0,
                essaysReviewed: 0,
                scholarshipsFound: 0,
            });
        }
        await updateDoc(statsDocRef, {
            [statName]: firestoreIncrement(value)
        });
    } catch(e) {
        console.error("Could not increment stat", e);
    }
};

// Sets up a real-time listener for client components
export const getGlobalStatsRT = (callback: (stats: any) => void) => {
    if (!db) {
        callback({ students: 0, colleges: 0, essays: 0, scholarships: 0 });
        return () => {}; // Return an empty unsubscribe function
    }

    let unsubs: (() => void)[] = [];
    const statsDocRef = doc(db, 'stats', 'global');

    const statsUnsub = onSnapshot(statsDocRef, (doc) => {
        const statsData = doc.data() || { collegesFound: 0, essaysReviewed: 0, scholarshipsFound: 0 };
         callback({
            colleges: statsData.collegesFound,
            essays: statsData.essaysReviewed,
            scholarships: statsData.scholarshipsFound
        });
    });
    unsubs.push(statsUnsub);

    const usersUnsub = onSnapshot(collection(db, 'users'), (snapshot) => {
        callback({ students: snapshot.size });
    });
    unsubs.push(usersUnsub);

    return () => {
        unsubs.forEach(unsub => unsub());
    };
};


// --- OTHER DATA OPERATIONS ---

export const saveOnboardingData = async (userId: string, data: any) => {
    if (!db) return;
    try {
        // Persist to user's own document
        await updateDoc(doc(db, "users", userId), { onboardingData: data });

        // Also save to a separate collection for this specific user
        const onboardingDocRef = doc(db, `onboarding`, userId);
        await setDoc(onboardingDocRef, data);

        // This is a local-only operation for prototype convenience
        if (typeof window !== 'undefined') {
            localStorage.setItem(`onboarding-${userId}`, JSON.stringify(data));
        }

    } catch (e) {
        console.error("Failed to save onboarding data:", e);
    }
};

// The following functions are for prototype purposes and use localStorage.
// In a real app, these would be robust, secure, server-side operations.

export const getRecentSignupsRT = (callback: (users: any[]) => void) => {
    const allUsersStr = localStorage.getItem('allSignups');
    const allUsers = allUsersStr ? JSON.parse(allUsersStr) : [];
    const recent = allUsers.sort((a: any, b: any) => new Date(b.signupTimestamp).getTime() - new Date(a.signupTimestamp).getTime()).slice(0, 4);
    callback(recent);
    return () => {}; // No real-time listener for localStorage
};

export const getContactMessagesRT = (callback: (messages: any[]) => void) => {
    const messagesStr = localStorage.getItem('contactMessages');
    const messages = messagesStr ? JSON.parse(messagesStr) : [];
    callback(messages);
    return () => {};
};

export const getJobApplicationsRT = (callback: (apps: any[]) => void) => {
    const appsStr = localStorage.getItem('jobApplications');
    const apps = appsStr ? JSON.parse(appsStr) : [];
    callback(apps);
    return () => {};
};

export const getSupportRequestsRT = (callback: (reqs: any[]) => void) => {
    const reqsStr = localStorage.getItem('humanChatRequests');
    const reqs = reqsStr ? JSON.parse(reqsStr) : [];
    callback(reqs);
    return () => {};
};
