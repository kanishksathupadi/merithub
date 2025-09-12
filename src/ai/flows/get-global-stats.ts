
'use server';

/**
 * @fileOverview An AI flow that retrieves global platform statistics.
 *
 * - getGlobalStats - A function that fetches key metrics from the server side.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import * as admin from 'firebase-admin';

// Correctly initialize Firebase Admin SDK only if it hasn't been initialized yet.
if (!admin.apps.length) {
  try {
    // This requires the GOOGLE_APPLICATION_CREDENTIALS environment variable to be set.
    admin.initializeApp();
  } catch (error) {
    console.error("Firebase admin initialization error in get-global-stats:", error);
    // If initialization fails, we'll gracefully handle it in the flow.
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
    // Check if the admin app was initialized successfully.
    if (admin.apps.length === 0) {
      console.warn("Firebase Admin SDK not configured. Returning zero stats.");
      return {
        students: 0,
        colleges: 0,
        scholarships: 0,
        essays: 0,
      };
    }

    try {
      const db = admin.firestore();

      // Fetch the count of all users.
      const usersSnapshot = await db.collection('users').get();
      
      // For the other stats, we will fetch the single stats document.
      const statsDocRef = db.doc('stats/global');
      const statsDoc = await statsDocRef.get();
      
      const statsData = statsDoc.exists ? statsDoc.data() : {
          collegesFound: 0,
          scholarshipsFound: 0,
          essaysReviewed: 0,
      };

      return {
        students: usersSnapshot.size,
        colleges: statsData?.collegesFound || 0,
        scholarships: statsData?.scholarshipsFound || 0,
        essays: statsData?.essaysReviewed || 0,
      };

    } catch (error) {
      console.error("Error fetching global stats from Firestore:", error);
      // Return zero stats on any fetching error.
      return {
        students: 0,
        colleges: 0,
        scholarships: 0,
        essays: 0,
      };
    }
  }
);
