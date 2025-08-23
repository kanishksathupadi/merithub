
'use server';

/**
 * @fileOverview AI agent that finds scholarships matching a student's profile.
 *
 * - findScholarships - A function that recommends scholarships.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { FindScholarshipsInput, FindScholarshipsOutput } from '@/lib/types';
import { FindScholarshipsInputSchema, FindScholarshipsOutputSchema } from '@/lib/types';


export async function findScholarships(input: FindScholarshipsInput): Promise<FindScholarshipsOutput> {
  return findScholarshipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findScholarshipsPrompt',
  input: {schema: FindScholarshipsInputSchema},
  output: {schema: FindScholarshipsOutputSchema},
  model: 'googleai/gemini-2.0-flash',
  prompt: `You are an expert financial aid advisor for high school students. Your task is to find a curated list of 5-7 relevant scholarships based on the student's profile.

  **Student Profile:**
  - Academic Profile & GPA/Scores: {{{academicProfile}}}
  - Extracurriculars & Achievements: {{{extracurriculars}}}
  - Interests & Major: {{{interests}}}
  - Background & Demographics: {{{background}}}

  **Instructions:**
  1.  Thoroughly analyze the student's profile to understand their unique strengths and circumstances.
  2.  Find 5-7 real, reputable scholarships that are a strong match for this specific student. Prioritize scholarships based on their unique interests and background, not just generic academic ones.
  3.  For each scholarship, provide the name, award amount, application deadline, a brief description of its focus, and a direct, valid URL to the application page.
  4.  Do not invent scholarships. Ensure all URLs are valid and lead to the correct scholarship page. The output must be a structured JSON object.
  `,
});

const findScholarshipsFlow = ai.defineFlow(
  {
    name: 'findScholarshipsFlow',
    inputSchema: FindScholarshipsInputSchema,
    outputSchema: FindScholarshipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("Failed to generate scholarship recommendations.");
    }
    return output;
  }
);

