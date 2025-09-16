
'use server';

// This file contains server actions that can be called from client components.

import { doc, setDoc } from "firebase/firestore";
import { db } from './firebase';
import { findUserByEmail as dbFindUserByEmail, updateUser as dbUpdateUser } from "./data";


export async function findUserByEmailAction(email: string) {
    console.log("SERVER ACTION: findUserByEmailAction triggered for email:", email);
    try {
        const user = await dbFindUserByEmail(email);
        console.log("SERVER ACTION: findUserByEmailAction completed successfully.");
        return user;
    } catch (error) {
        console.error("SERVER ACTION ERROR in findUserByEmailAction:", error);
        return null;
    }
}

// This server action is no longer needed as user creation is handled on the client.
// It is kept here to avoid breaking imports but it does nothing.
export async function addUserAction(user: any) {
    console.warn("SERVER ACTION: addUserAction is deprecated and should not be used. User creation is handled client-side.");
    return;
}


export async function updateUserAction(userId: string, data: any) {
    console.log("SERVER ACTION: updateUserAction triggered for userId:", userId);
    try {
        const result = await dbUpdateUser(userId, data);
        console.log("SERVER ACTION: updateUserAction completed successfully.");
        return result;
    } catch (error) {
        console.error("SERVER ACTION ERROR in updateUserAction:", error);
        throw new Error("Failed to update user data. See server logs for details.");
    }
}
