

import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// This prototype now uses a local JSON file as a database.
// This is NOT suitable for production but allows for a shared data source in development
// without requiring a cloud database setup.

const dbPath = path.join(process.cwd(), 'local-db.json');

const readDb = () => {
    try {
        if (fs.existsSync(dbPath)) {
            const data = fs.readFileSync(dbPath, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading local DB:', error);
    }
    // Default structure if file doesn't exist or is corrupt
    return { users: [], stats: { collegesFound: 0, essaysReviewed: 0, scholarshipsFound: 0 }, humanChatRequests: [], contactMessages: [], jobApplications: [] };
};

const writeDb = (data: any) => {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing to local DB:', error);
    }
};

// --- USER MANAGEMENT ---
export const getAllUsers = async () => {
    const db = readDb();
    return db.users || [];
};

export const findUserByEmail = async (email: string) => {
    const users = await getAllUsers();
    return users.find((user: any) => user.email === email) || null;
}

export const addUser = async (user: any) => {
    const db = readDb();
    db.users.push(user);
    writeDb(db);
    return user;
};

export const updateUser = async(updatedUser: any) => {
    const db = readDb();
    const userIndex = db.users.findIndex((u: any) => u.userId === updatedUser.userId);
    if (userIndex !== -1) {
        db.users[userIndex] = updatedUser;
        writeDb(db);
    }
    return updatedUser;
};


// --- STATS TRACKING ---
export const incrementStat = async (statName: 'collegesFound' | 'essaysReviewed' | 'scholarshipsFound', value: number = 1) => {
    const db = readDb();
    db.stats[statName] = (db.stats[statName] || 0) + value;
    writeDb(db);
};

export const getGlobalStats = async () => {
    const db = readDb();
    return {
        students: db.users.length,
        colleges: db.stats.collegesFound || 0,
        scholarships: db.stats.scholarshipsFound || 0,
        essays: db.stats.essaysReviewed || 0,
    };
};


// --- ADMIN DATA ---
export const getRecentSignups = async () => {
    const users = await getAllUsers();
    return users.sort((a: any, b: any) => new Date(b.signupTimestamp).getTime() - new Date(a.signupTimestamp).getTime()).slice(0, 4);
};

export const getContactMessages = async () => {
    const db = readDb();
    return db.contactMessages || [];
};

export const addContactMessage = async (message: any) => {
    const db = readDb();
    db.contactMessages.push(message);
    writeDb(db);
};

export const getJobApplications = async () => {
    const db = readDb();
    return db.jobApplications || [];
};

export const addJobApplication = async (application: any) => {
    const db = readDb();
    db.jobApplications.push(application);
    writeDb(db);
};


export const getSupportRequests = async () => {
    const db = readDb();
    return db.humanChatRequests || [];
}

export const updateSupportRequests = async (requests: any[]) => {
    const db = readDb();
    db.humanChatRequests = requests;
    writeDb(db);
}


// These functions are no longer "RT" (real-time) as we're not using a real-time database like Firestore.
// They are here to keep the component-side API the same. In a real app, you'd implement polling or WebSockets.
export const getGlobalStatsRT = (callback: (stats: any) => void) => {
    // This now just fetches once.
    getGlobalStats().then(callback);
    // Return an empty unsubscribe function
    return () => {};
};

export const getRecentSignupsRT = (callback: (users: any[]) => void) => {
    getRecentSignups().then(callback);
    return () => {};
};

export const getContactMessagesRT = (callback: (messages: any[]) => void) => {
    getContactMessages().then(callback);
    return () => {};
};

export const getJobApplicationsRT = (callback: (apps: any[]) => void) => {
    getJobApplications().then(callback);
    return () => {};
};

export const getSupportRequestsRT = (callback: (reqs: any[]) => void) => {
    getSupportRequests().then(callback);
    return () => {};
};
