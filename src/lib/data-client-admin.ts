
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
    
    // Define the baseline stats
    const baselineStats = {
        students: 10,
        collegesFound: 4,
        essaysReviewed: 10,
        scholarshipsFound: 8,
    };

    let globalStats = safeJSONParse('globalStats', baselineStats);

    // --- Ensure all stats are at least the baseline ---
    let needsUpdate = false;

    // Students
    const studentCount = allUsers.length;
    const finalStudentCount = studentCount > baselineStats.students ? studentCount : baselineStats.students;

    // Other stats
    if (!globalStats.collegesFound || globalStats.collegesFound < baselineStats.collegesFound) {
        globalStats.collegesFound = baselineStats.collegesFound;
        needsUpdate = true;
    }
    if (!globalStats.essaysReviewed || globalStats.essaysReviewed < baselineStats.essaysReviewed) {
        globalStats.essaysReviewed = baselineStats.essaysReviewed;
        needsUpdate = true;
    }
     if (!globalStats.scholarshipsFound || globalStats.scholarshipsFound < baselineStats.scholarshipsFound) {
        globalStats.scholarshipsFound = baselineStats.scholarshipsFound;
        needsUpdate = true;
    }

    if (needsUpdate) {
         localStorage.setItem('globalStats', JSON.stringify(globalStats));
    }
    
    return {
        students: finalStudentCount,
        colleges: globalStats.collegesFound,
        essays: globalStats.essaysReviewed,
        scholarships: globalStats.scholarshipsFound,
    };
};

export const incrementStat = async (statName: 'collegesFound' | 'essaysReviewed' | 'scholarshipsFound', value: number = 1) => {
    const stats = await getGlobalStats(); // Use this to get initialized stats
    const newStats = {
        collegesFound: stats.colleges,
        essaysReviewed: stats.essays,
        scholarshipsFound: stats.scholarships,
    };
    newStats[statName] = (newStats[statName] || 0) + value;
    localStorage.setItem('globalStats', JSON.stringify(newStats));
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
