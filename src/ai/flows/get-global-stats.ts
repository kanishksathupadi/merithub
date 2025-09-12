
'use server';

/**
 * @fileOverview An AI flow that retrieves global platform statistics.
 *
 * - getGlobalStats - A function that fetches key metrics from the server side.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import * as admin from 'firebase-admin';

// This flow is now deprecated in favor of client-side data fetching from localStorage/local file DB
// but is kept to avoid breaking imports. It will return zero-values.
// The admin dashboard now uses functions from `lib/data-client-admin.ts`.

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
    console.warn("getGlobalStats flow is deprecated. Admin dashboard now uses client-side data fetching. Returning zero stats.");
    return {
      students: 0,
      colleges: 0,
      scholarships: 0,
      essays: 0,
    };
  }
);
