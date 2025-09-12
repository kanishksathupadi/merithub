
"use client";

// This file contains data-access functions intended to be called from client components.
// It acts as a client-side layer that communicates with localStorage.
// This is a prototype-only implementation.

const safeJSONParse = (key: string, defaultValue: any) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error);
        return defaultValue;
    }
}

const getAllUsersClient = () => {
    return safeJSONParse('allSignups', []);
}

const saveAllUsersClient = (users: any[]) => {
    localStorage.setItem('allSignups', JSON.stringify(users));
     // Dispatch storage event to notify other tabs/components
    window.dispatchEvent(new StorageEvent('storage', { key: 'allSignups' }));
}

export const findUserByEmail = async (email: string) => {
    const allUsers = getAllUsersClient();
    return allUsers.find((user: any) => user.email === email) || null;
};

export const addUser = async (newUser: any) => {
    const allUsers = getAllUsersClient();
    allUsers.push(newUser);
    saveAllUsersClient(allUsers);
    return newUser;
};

export const updateUser = async (updatedUser: any) => {
    let allUsers = getAllUsersClient();
    const userIndex = allUsers.findIndex((u: any) => u.userId === updatedUser.userId);
    if (userIndex !== -1) {
        allUsers[userIndex] = updatedUser;
        saveAllUsersClient(allUsers);
    }
    return updatedUser;
};
