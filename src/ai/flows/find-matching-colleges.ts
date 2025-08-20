
'use server';

/**
 * @fileOverview AI agent that finds colleges matching a student's profile and preferences.
 *
 * - findMatchingColleges - A function that recommends colleges.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { FindMatchingCollegesInput, FindMatchingCollegesOutput } from '@/lib/types';
import { FindMatchingCollegesInputSchema, FindMatchingCollegesOutputSchema } from '@/lib/types';


export async function findMatchingColleges(input: FindMatchingCollegesInput): Promise<FindMatchingCollegesOutput> {
  return findMatchingCollegesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findMatchingCollegesPrompt',
  input: {schema: FindMatchingCollegesInputSchema},
  output: {schema: FindMatchingCollegesOutputSchema},
  model: 'googleai/gemini-2.0-flash',
  prompt: `You are an expert college admissions advisor. Your task is to recommend a list of 6 colleges that are a strong fit for a student based on their detailed profile and a specific filter query.

  **Student Profile:**
  - Grade: {{{grade}}}
  - Academic Strengths: {{{academicStrengths}}}
  - Academic Weaknesses: {{{academicWeaknesses}}}
  - Passions & Interests: {{{subjectsOfInterest}}}
  - Preferred College Environment: {{{collegeEnvironment}}}
  - Preferred Learning Style: {{{preferredLearningStyle}}}
  - Extracurriculars: {{{currentExtracurriculars}}}

  **User's Filter Query:** "{{{filterQuery}}}"

  **Instructions:**
  1.  Analyze the student's entire profile to understand their unique character, academic standing, and preferences.
  2.  Interpret the user's filter query to narrow down the search.
  3.  Find 6 real colleges or universities that are a strong match for BOTH the student's profile AND their filter query.
  4.  For each college, provide its name, location, and a compelling, personalized 'reasoning' that directly connects the college's strengths to the student's specific profile details. For example, instead of saying "Good for science," say "Its renowned marine biology program is perfect for your passion for oceanography."
  
  Do not invent colleges. Ensure the recommendations are diverse and well-reasoned.
  `,
});

const findMatchingCollegesFlow = ai.defineFlow(
  {
    name: 'findMatchingCollegesFlow',
    inputSchema: FindMatchingCollegesInputSchema,
    outputSchema: FindMatchingCollegesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("Failed to generate college recommendations.");
    }
    return output;
  }
);
