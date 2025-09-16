
'use server';

// This file contains server actions that can be called from client components.

import { dbFindUserByEmail, dbAddUser } from "./data";


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
