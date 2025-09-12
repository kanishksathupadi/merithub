
'use server';

/**
 * @fileOverview An AI flow that retrieves global platform statistics using the Firebase Admin SDK.
 *
 * - getGlobalStats - A function that fetches key metrics from the server side.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import * as admin from 'firebase-admin';

// Check if the app is already initialized to prevent re-initialization
if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  // Only initialize if all credentials are provided
  if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    console.warn("Firebase Admin credentials not found in environment variables. Stats feature will be disabled.");
  }
}


const GlobalStatsOutputSchema = z.object({
    students: z.number().describe("The total number of registered students."),
    colleges: z.number().describe("The total number of colleges found by the AI."),
    scholarships: z.number().describe("The total number of scholarships found by the AI."),
    essays: z.number().describe("The total number of essays reviewed by the AI."),
});
export type GlobalStatsOutput = z.infer<typeof GlobalStatsOutputSchema>;

export async function getGlobalStats(): Promise<GlobalStatsOutput> {
  return getGlobalStatsFlow();
}

const getGlobalStatsFlow = ai.defineFlow(
  {
    name: 'getGlobalStatsFlow',
    outputSchema: GlobalStatsOutputSchema,
  },
  async () => {
    // If the admin SDK was not initialized (due to missing credentials), return zeros.
    if (!admin.apps.length) {
        console.log("Firebase Admin SDK not initialized. Returning zero stats.");
        return { students: 0, colleges: 0, scholarships: 0, essays: 0 };
    }

    const db = admin.firestore();

    try {
        // Fetch stats from the 'stats/global' document
        const statsDocRef = db.collection('stats').doc('global');
        const statsDocSnap = await statsDocRef.get();
        const statsData = statsDocSnap.exists ? statsDocSnap.data() : {
            collegesFound: 0,
            essaysReviewed: 0,
            scholarshipsFound: 0,
        };

        // Fetch total number of users
        const usersCollectionRef = db.collection('users');
        const usersSnapshot = await usersCollectionRef.get();
        const totalUsers = usersSnapshot.size;

        return {
            students: totalUsers,
            colleges: statsData?.collegesFound || 0,
            scholarships: statsData?.scholarshipsFound || 0,
            essays: statsData?.essaysReviewed || 0,
        };
    } catch (error) {
        console.error("Error fetching global stats with Admin SDK:", error);
        // Return zeros if there's an error to prevent the page from crashing.
        return {
            students: 0,
            colleges: 0,
            scholarships: 0,
            essays: 0,
        };
    }
  }
);
