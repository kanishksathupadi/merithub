
'use server';

// This file contains server actions that can be called from client components.

import { findUserByEmail as dbFindUserByEmail, addUser as dbAddUser, updateUser as dbUpdateUser } from "./data";

export async function findUserByEmailAction(email: string) {
    console.log("SERVER ACTION: findUserByEmailAction called for", email);
    try {
        return await dbFindUserByEmail(email);
    } catch (error) {
        console.error("SERVER ACTION ERROR in findUserByEmailAction:", error);
        return null;
    }
}

export async function addUserAction(user: any) {
    console.log("SERVER ACTION: addUserAction called for user:", user.email);
    try {
        return await dbAddUser(user);
    } catch (error) {
        console.error("SERVER ACTION ERROR in addUserAction:", error);
        throw new Error("Failed to create a new user.");
    }
}

export async function updateUserAction(userId: string, data: any) {
    console.log("SERVER ACTION: updateUserAction called for userId:", userId);
    try {
        return await dbUpdateUser(userId, data);
    } catch (error) {
        console.error("SERVER ACTION ERROR in updateUserAction:", error);
        throw new Error("Failed to update user data.");
    }
}
