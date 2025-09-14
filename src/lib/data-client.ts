
'use server';

// This file is now intended to be a layer of server actions.
// Components will call these functions, which then interact with the database.

import { findUserByEmail as dbFindUserByEmail, addUser as dbAddUser, updateUser as dbUpdateUser } from "./data";

export async function findUserByEmail(email: string) {
    return dbFindUserByEmail(email);
}

export async function addUser(user: any) {
    return dbAddUser(user);
}

export async function updateUser(userId: string, data: any) {
    return dbUpdateUser(userId, data);
}
