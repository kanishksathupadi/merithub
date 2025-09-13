
"use client";

// This file contains data-access functions specifically for the admin dashboard.
// It ensures that even though it's a client component, it reads the "master" list of data
// from localStorage, simulating a connection to a central database.

const safeJSONParse = (key: string, defaultValue: any) => {
    if (typeof window === 'undefined') return defaultValue;
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error);
        return defaultValue;
    }
}

// --- USER MANAGEMENT ---
export const getAllUsers = async () => {
    return safeJSONParse('allSignups', []);
};

// --- STATS ---
export const getGlobalStats = async () => {
    const allUsers = safeJSONParse('allSignups', []);
    const globalStats = safeJSONParse('globalStats', { collegesFound: 0, essaysReviewed: 0, scholarshipsFound: 0 });
    
    return {
        students: allUsers.length,
        colleges: globalStats.collegesFound,
        essays: globalStats.essaysReviewed,
        scholarships: globalStats.scholarshipsFound,
    };
};

export const incrementStat = async (statName: 'collegesFound' | 'essaysReviewed' | 'scholarshipsFound', value: number = 1) => {
    const stats = safeJSONParse('globalStats', { collegesFound: 0, essaysReviewed: 0, scholarshipsFound: 0 });
    stats[statName] = (stats[statName] || 0) + value;
    localStorage.setItem('globalStats', JSON.stringify(stats));
    window.dispatchEvent(new StorageEvent('storage', { key: 'globalStats' }));
};

// --- ADMIN DATA ---
export const getRecentSignups = async () => {
    const allUsers = await getAllUsers();
    // Ensure signupTimestamp is valid before sorting
    return allUsers
        .filter((user: any) => user.signupTimestamp)
        .sort((a: any, b: any) => new Date(b.signupTimestamp).getTime() - new Date(a.signupTimestamp).getTime())
        .slice(0, 4);
};

export const getContactMessages = async () => {
    return safeJSONParse('contactMessages', []);
};

export const addContactMessage = async (message: any) => {
    const messages = await getContactMessages();
    messages.push(message);
    localStorage.setItem('contactMessages', JSON.stringify(messages));
    window.dispatchEvent(new StorageEvent('storage', { key: 'contactMessages' }));
};

export const getJobApplications = async () => {
    return safeJSONParse('jobApplications', []);
};

export const addJobApplication = async (application: any) => {
    const applications = await getJobApplications();
    applications.push(application);
    localStorage.setItem('jobApplications', JSON.stringify(applications));
    window.dispatchEvent(new StorageEvent('storage', { key: 'jobApplications' }));
};

export const getSupportRequests = async () => {
    return safeJSONParse('humanChatRequests', []);
}

export const updateSupportRequests = async (requests: any[]) => {
    localStorage.setItem('humanChatRequests', JSON.stringify(requests));
    window.dispatchEvent(new StorageEvent('storage', { key: 'humanChatRequests' }));
}
