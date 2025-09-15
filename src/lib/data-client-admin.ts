
"use client";

// This file contains data-access functions specifically for the admin dashboard.
// These functions are now wrappers around server actions to interact with Firestore.

import { 
    getGlobalStats as getGlobalStatsServer,
    getAllUsersForAdmin,
    getRecentSignupsForAdmin,
    getAllContactMessages,
    getAllJobApplications,
    getAllSupportRequests,
    updateSupportRequest as updateSupportRequestServer,
    addContactMessage as addContactMessageServer,
    addJobApplication as addJobApplicationServer,
    incrementStat as incrementStatServer
} from './data';


// --- USER MANAGEMENT ---
export const getAllUsers = async () => {
    // This is a direct server call, fine for admin client components.
    // In a real app with many users, you'd want pagination here.
    return await getAllUsersForAdmin();
};

// --- STATS ---
export const getGlobalStats = async () => {
    return await getGlobalStatsServer();
};

export const incrementStat = async (statName: 'collegesFound' | 'essaysReviewed' | 'scholarshipsFound', value: number = 1) => {
    // This function will now directly call the server-side increment logic.
    try {
        for (let i = 0; i < value; i++) {
           await incrementStatServer(statName);
        }
    } catch (error) {
        console.error(`Failed to increment stat '${statName}':`, error);
    }
};

// --- ADMIN DATA ---
export const getRecentSignups = async () => {
    return await getRecentSignupsForAdmin();
};

export const getContactMessages = async () => {
    return await getAllContactMessages();
};

export const addContactMessage = async (message: any) => {
    return await addContactMessageServer(message);
};

export const getJobApplications = async () => {
    return await getAllJobApplications();
};

export const addJobApplication = async (application: any) => {
    return await addJobApplicationServer(application);
};

export const getSupportRequests = async () => {
    return await getAllSupportRequests();
}

export const updateSupportRequests = async (requests: any[]) => {
    // In a real DB, you'd iterate and update each request individually.
    // For this prototype, we'll assume we're updating one at a time if needed.
    for (const req of requests) {
        await updateSupportRequestServer(req.userId, req);
    }
}
