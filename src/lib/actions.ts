
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

export async function addUserAction(user: any) {
    console.log("SERVER ACTION: addUserAction triggered for user:", user.email);
    if (!user || !user.userId) {
        throw new Error("A user object with a userId is required to add a user.");
    }
    try {
        console.log(`DATABASE: Attempting to write user ${user.userId} to Firestore directly in server action.`);
        const userRef = doc(db, "users", user.userId);
        await setDoc(userRef, user);
        console.log(`DATABASE: Successfully wrote user ${user.userId} to Firestore.`);
        return user;
    } catch (error) {
        console.error("SERVER ACTION ERROR in addUserAction:", error);
        throw new Error("Failed to create a new user. See server logs for details.");
    }
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
