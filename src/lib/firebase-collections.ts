
import {
  collection,
  CollectionReference,
  DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Chat, ChatMessage, UserProfile } from "./types";

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>;
};

// All collections in the app are defined here.
export const usersCollection = createCollection<UserProfile>("users");
export const chatsCollection = createCollection<Chat>("chats");
export const messagesCollection = (chatId: string) =>
  createCollection<ChatMessage>(`chats/${chatId}/messages`);
