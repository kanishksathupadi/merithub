
'use server';

/**
 * @fileOverview An AI flow that retrieves global platform statistics.
 *
 * - getGlobalStats - A function that fetches key metrics from the server side.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

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
    // Because Firebase is not configured, we return mock data.
    // In a real application, this would fetch from a database.
    console.warn("Firebase Admin SDK not configured. Returning mock stats.");
    return {
        students: 1337,
        colleges: 8432,
        scholarships: 2104,
        essays: 489,
    };
  }
);
