
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc, getDocs, updateDoc, increment as firestoreIncrement, onSnapshot, query, orderBy, limit } from "firebase/firestore";

// --- USER MANAGEMENT ---

export const createUser = async (user: any) => {
  await setDoc(doc(db, "users", user.userId), user);
};

export const findUserByEmail = async (email: string) => {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => doc.data());
    const user = users.find(u => u.email === email);

    if (user) {
        const userDoc = await getDoc(doc(db, "users", user.userId));
        return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
};

export const getAllUsers = async () => {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


// --- STATS TRACKING ---

const statsDocRef = doc(db, 'stats', 'global');

// Initializes the stats document if it doesn't exist
const ensureStatsDoc = async () => {
    const docSnap = await getDoc(statsDocRef);
    if (!docSnap.exists()) {
        await setDoc(statsDocRef, {
            totalUsers: 0,
            collegesFound: 0,
            essaysReviewed: 0,
            scholarshipsFound: 0,
        });
    }
};

export const incrementStat = async (statName: 'totalUsers' | 'collegesFound' | 'essaysReviewed' | 'scholarshipsFound', value: number = 1) => {
    await ensureStatsDoc();
    await updateDoc(statsDocRef, {
        [statName]: firestoreIncrement(value)
    });
};

// Fetches stats once for server components
export const getGlobalStats = async () => {
    const docSnap = await getDoc(statsDocRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        const usersSnapshot = await getDocs(collection(db, 'users'));
        return {
            students: usersSnapshot.size, // Real-time user count
            colleges: data.collegesFound || 0,
            essays: data.essaysReviewed || 0,
            scholarships: data.scholarshipsFound || 0
        };
    }
    return { students: 0, colleges: 0, essays: 0, scholarships: 0 };
};

// Sets up a real-time listener for client components
export const getGlobalStatsRT = (callback: (stats: any) => void) => {
    let unsubs: (() => void)[] = [];

    const statsUnsub = onSnapshot(statsDocRef, (doc) => {
        const statsData = doc.data() || { collegesFound: 0, essaysReviewed: 0, scholarshipsFound: 0 };
         // We'll get total users from the other listener
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

    // Return a function that unsubscribes from all listeners
    return () => {
        unsubs.forEach(unsub => unsub());
    };
};


// --- OTHER DATA OPERATIONS ---

export const getForumPosts = async () => {
    const q = query(collection(db, "forumPosts"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createForumPost = async (post: any) => {
    await setDoc(doc(db, "forumPosts", post.id), post);
};

export const getForumPostById = async (id: string) => {
    const docRef = doc(db, "forumPosts", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const addForumReply = async (postId: string, replies: any[]) => {
    await updateDoc(doc(db, "forumPosts", postId), { replies });
};

export const saveRoadmapTasks = async (userId: string, tasks: any[]) => {
    await updateDoc(doc(db, "users", userId), { tasks: tasks });
};

export const saveSuggestion = async (userId: string, suggestion: any) => {
    await updateDoc(doc(db, "users", userId), { suggestion: suggestion });
};

export const saveOnboardingData = async (userId: string, data: any) => {
    await updateDoc(doc(db, "users", userId), { onboardingData: data });
};

export const getRecentSignupsRT = (callback: (users: any[]) => void) => {
    const q = query(collection(db, "users"), orderBy("signupTimestamp", "desc"), limit(4));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(users);
    });
    return unsubscribe;
};

export const getContactMessagesRT = (callback: (messages: any[]) => void) => {
    const q = query(collection(db, "contactMessages"), orderBy("submittedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(messages);
    });
    return unsubscribe;
};

export const saveContactMessage = async (message: any) => {
    await setDoc(doc(db, "contactMessages", message.id), message);
}

export const getJobApplicationsRT = (callback: (apps: any[]) => void) => {
    const q = query(collection(db, "jobApplications"), orderBy("submittedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(apps);
    });
    return unsubscribe;
};

export const getSupportRequestsRT = (callback: (reqs: any[]) => void) => {
    const q = query(collection(db, "supportRequests"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const reqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(reqs);
    });
    return unsubscribe;
};

export const saveSupportRequest = async (request: any) => {
    await setDoc(doc(db, "supportRequests", request.userId), request);
};
