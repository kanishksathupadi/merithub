'use server';

// This file contains server actions that can be called from client components.

import { findUserByEmail as dbFindUserByEmail, addUser as dbAddUser, updateUser as dbUpdateUser } from "./data";

export async function findUserByEmailAction(email: string) {
    try {
        return await dbFindUserByEmail(email);
    } catch (error) {
        console.error("Server Action Error in findUserByEmailAction:", error);
        return null;
    }
}

export async function addUserAction(user: any) {
    try {
        return await dbAddUser(user);
    } catch (error) {
        console.error("Server Action Error in addUserAction:", error);
        // It's often better to throw the error here to be caught by the form handler
        // so the UI can show a meaningful error message.
        throw new Error("Failed to create a new user.");
    }
}

export async function updateUserAction(userId: string, data: any) {
    try {
        return await dbUpdateUser(userId, data);
    } catch (error) {
        console.error("Server Action Error in updateUserAction:", error);
        throw new Error("Failed to update user data.");
    }
}
