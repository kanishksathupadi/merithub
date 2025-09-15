
'use server';

// This file is a layer of server actions, wrapping the core database functions.
// Client components should import from here to interact with server data.

import { 
    findUserByEmail as dbFindUserByEmail, 
    addUser as dbAddUser, 
    updateUser as dbUpdateUser 
} from "./data";
import { addUserAction } from "./actions";

export async function findUserByEmail(email: string) {
    return dbFindUserByEmail(email);
}

export async function addUser(user: any) {
    return addUserAction(user);
}

export async function updateUser(userId: string, data: any) {
    return dbUpdateUser(userId, data);
}
