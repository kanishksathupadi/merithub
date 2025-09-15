
'use server';

// This file contains server actions that can be called from client components.

import { findUserByEmail as dbFindUserByEmail, addUser as dbAddUser, updateUser as dbUpdateUser } from "./data";

export async function findUserByEmailAction(email: string) {
    return dbFindUserByEmail(email);
}

export async function addUserAction(user: any) {
    return dbAddUser(user);
}

export async function updateUserAction(userId: string, data: any) {
    return dbUpdateUser(userId, data);
}

    