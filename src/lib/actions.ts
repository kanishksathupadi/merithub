
'use server';

// This file contains server actions that can be called from client components.

import { doc, setDoc } from "firebase/firestore";
import { db } from './firebase';
import { findUserByEmail as dbFindUserByEmail, updateUser as dbUpdateUser, addUser as dbAddUser } from "./data";


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
    console.log("SERVER ACTION: addUserAction triggered for userId:", user.userId);
    try {
        await dbAddUser(user);
        console.log("SERVER ACTION: addUserAction completed successfully.");
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
