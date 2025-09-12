
'use server';

/**
 * @fileOverview An AI flow that retrieves global platform statistics from Firestore.
 *
 * - getGlobalStats - A function that fetches key metrics.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

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
    try {
        // Fetch stats from the 'stats/global' document
        const statsDocRef = doc(db, 'stats', 'global');
        const statsDocSnap = await getDoc(statsDocRef);
        const statsData = statsDocSnap.exists() ? statsDocSnap.data() : {
            collegesFound: 0,
            essaysReviewed: 0,
            scholarshipsFound: 0,
        };

        // Fetch total number of users
        const usersCollectionRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollectionRef);
        const totalUsers = usersSnapshot.size;

        return {
            students: totalUsers,
            colleges: statsData.collegesFound || 0,
            scholarships: statsData.scholarshipsFound || 0,
            essays: statsData.essaysReviewed || 0,
        };
    } catch (error) {
        console.error("Error fetching global stats:", error);
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
