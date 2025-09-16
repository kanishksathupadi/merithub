
"use client";

// This file contains functions for client-side data management using localStorage.

import { v4 as uuidv4 } from "uuid";

const getUsers = () => {
    if (typeof window === 'undefined') return [];
    const usersStr = localStorage.getItem('users');
    return usersStr ? JSON.parse(usersStr) : [];
};

const saveUsers = (users: any[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('users', JSON.stringify(users));
};

export const findUserByEmail = async (email: string) => {
    const users = getUsers();
    return users.find((user: any) => user.email === email) || null;
};

export const addUser = async (user: any) => {
    const users = getUsers();
    const newUser = { ...user, userId: user.userId || uuidv4() };
    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    return newUser;
};

export const updateUser = async (userId: string, data: any) => {
    let users = getUsers();
    let userUpdated = false;
    const updatedUsers = users.map((user: any) => {
        if (user.userId === userId) {
            userUpdated = true;
            return { ...user, ...data };
        }
        return user;
    });

    if (!userUpdated) {
        // If user not found, it might be a new session, let's add them.
        // This can happen if localStorage was cleared but sessionStorage persists.
        const sessionUserStr = sessionStorage.getItem('user');
        if (sessionUserStr) {
            const sessionUser = JSON.parse(sessionUserStr);
            if (sessionUser.userId === userId) {
                updatedUsers.push({ ...sessionUser, ...data });
            }
        }
    }
    
    saveUsers(updatedUsers);

    // Also update session storage if it exists
    if (typeof window !== 'undefined') {
        const sessionUserStr = sessionStorage.getItem('user');
        if (sessionUserStr) {
            const sessionUser = JSON.parse(sessionUserStr);
            if (sessionUser.userId === userId) {
                const updatedSessionUser = { ...sessionUser, ...data };
                sessionStorage.setItem('user', JSON.stringify(updatedSessionUser));
                // Dispatch event to notify other components like the sidebar
                window.dispatchEvent(new Event('sessionStorageUpdated'));
            }
        }
    }
    
    return { userId, ...data };
};

export const findUserById = async (userId: string) => {
    const users = getUsers();
    return users.find((user: any) => user.userId === userId) || null;
}
