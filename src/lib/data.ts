

import { v4 as uuidv4 } from 'uuid';
// No longer importing from Firebase as we are using localStorage for the prototype.

// --- USER MANAGEMENT ---

export const getAllUsers = async () => {
    if (typeof window === 'undefined') return [];
    try {
        const allUsersStr = localStorage.getItem('allSignups');
        return allUsersStr ? JSON.parse(allUsersStr) : [];
    } catch (e) {
        console.error("Failed to get all users:", e);
        return [];
    }
};


// --- STATS TRACKING ---

// This function now uses localStorage for the prototype.
export const incrementStat = (statName: 'collegesFound' | 'essaysReviewed' | 'scholarshipsFound', value: number = 1) => {
    if (typeof window === 'undefined') return;
    try {
        const statsStr = localStorage.getItem('globalStats');
        const stats = statsStr ? JSON.parse(statsStr) : {
            collegesFound: 0,
            essaysReviewed: 0,
            scholarshipsFound: 0,
        };
        stats[statName] = (stats[statName] || 0) + value;
        localStorage.setItem('globalStats', JSON.stringify(stats));

        // Dispatch a storage event to notify other components that stats have changed.
        window.dispatchEvent(new StorageEvent('storage', { key: 'globalStats' }));

    } catch(e) {
        console.error("Could not increment stat", e);
    }
};

// Sets up a "real-time" listener for client components using localStorage
export const getGlobalStatsRT = (callback: (stats: any) => void) => {
    if (typeof window === 'undefined') {
        callback({ students: 0, colleges: 0, essays: 0, scholarships: 0 });
        return () => {};
    }

    const updateStats = () => {
        const allUsersStr = localStorage.getItem('allSignups');
        const allUsers = allUsersStr ? JSON.parse(allUsersStr) : [];
        
        const statsStr = localStorage.getItem('globalStats');
        const statsData = statsStr ? JSON.parse(statsStr) : {
            collegesFound: 0,
            essaysReviewed: 0,
            scholarshipsFound: 0,
        };

        callback({
            students: allUsers.length,
            colleges: statsData.collegesFound,
            essays: statsData.essaysReviewed,
            scholarships: statsData.scholarshipsFound
        });
    };

    updateStats(); // Initial call

    const storageListener = (e: StorageEvent) => {
        if (e.key === 'allSignups' || e.key === 'globalStats') {
            updateStats();
        }
    };
    
    window.addEventListener('storage', storageListener);
    
    return () => {
        window.removeEventListener('storage', storageListener);
    };
};


// --- OTHER DATA OPERATIONS ---

// The following functions are for prototype purposes and use localStorage.

export const getRecentSignupsRT = (callback: (users: any[]) => void) => {
    if (typeof window === 'undefined') {
        callback([]);
        return () => {};
    }
    
    const updateSignups = () => {
        const allUsersStr = localStorage.getItem('allSignups');
        const allUsers = allUsersStr ? JSON.parse(allUsersStr) : [];
        const recent = allUsers.sort((a: any, b: any) => new Date(b.signupTimestamp).getTime() - new Date(a.signupTimestamp).getTime()).slice(0, 4);
        callback(recent);
    };

    updateSignups();

    const storageListener = (e: StorageEvent) => {
        if (e.key === 'allSignups') {
            updateSignups();
        }
    };

    window.addEventListener('storage', storageListener);
    return () => window.removeEventListener('storage', storageListener);
};

export const getContactMessagesRT = (callback: (messages: any[]) => void) => {
    if (typeof window === 'undefined') {
        callback([]);
        return () => {};
    }
    const updateMessages = () => {
        const messagesStr = localStorage.getItem('contactMessages');
        const messages = messagesStr ? JSON.parse(messagesStr) : [];
        callback(messages);
    };

    updateMessages();
    const storageListener = (e: StorageEvent) => { if (e.key === 'contactMessages') updateMessages() };
    window.addEventListener('storage', storageListener);
    return () => window.removeEventListener('storage', storageListener);
};

export const getJobApplicationsRT = (callback: (apps: any[]) => void) => {
    if (typeof window === 'undefined') {
        callback([]);
        return () => {};
    }
    const updateApps = () => {
        const appsStr = localStorage.getItem('jobApplications');
        const apps = appsStr ? JSON.parse(appsStr) : [];
        callback(apps);
    }
    updateApps();
    const storageListener = (e: StorageEvent) => { if (e.key === 'jobApplications') updateApps() };
    window.addEventListener('storage', storageListener);
    return () => window.removeEventListener('storage', storageListener);
};

export const getSupportRequestsRT = (callback: (reqs: any[]) => void) => {
    if (typeof window === 'undefined') {
        callback([]);
        return () => {};
    }
    const updateReqs = () => {
        const reqsStr = localStorage.getItem('humanChatRequests');
        const reqs = reqsStr ? JSON.parse(reqsStr) : [];
        callback(reqs);
    }
    updateReqs();
    const storageListener = (e: StorageEvent) => { if (e.key === 'humanChatRequests') updateReqs() };
    window.addEventListener('storage', storageListener);
    return () => window.removeEventListener('storage', storageListener);
};
