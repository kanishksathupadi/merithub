
"use client";

// This file contains data-access functions intended to be called from client components.
// It acts as a client-side layer that communicates with localStorage for session data,
// but uses server actions to interact with the central database (local-db.json).

// This is a prototype-only implementation.
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

// These functions call the server-side data functions by updating a master list
// in localStorage. In a real app, these would be proper server actions.
export const findUserByEmail = async (email: string) => {
    const allUsers = await getAllUsers();
    return allUsers.find((user: any) => user.email === email) || null;
};

export const addUser = async (newUser: any) => {
    let allUsers = await getAllUsers();
    allUsers.push(newUser);
    localStorage.setItem('allSignups', JSON.stringify(allUsers));
    // Dispatch a storage event to notify other components of the change
    window.dispatchEvent(new StorageEvent('storage', { key: 'allSignups' }));
    return newUser;
};

export const updateUser = async (updatedUser: any) => {
    let allUsers = await getAllUsers();
    const userIndex = allUsers.findIndex((u: any) => u.userId === updatedUser.userId);
    if (userIndex !== -1) {
        allUsers[userIndex] = updatedUser;
        localStorage.setItem('allSignups', JSON.stringify(allUsers));
        window.dispatchEvent(new StorageEvent('storage', { key: 'allSignups' }));
    }
    return updatedUser;
};


// Admin-specific client functions that read from the master list in localStorage
export const getAllUsers = async () => {
    return safeJSONParse('allSignups', []);
};
