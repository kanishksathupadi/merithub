
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

  **Core Principle: Be a Guide, Not a Mirror.**
  Your goal is to broaden the student's horizons. An interest like 'chess' isn't just about chess; it suggests a mind for strategy, logic, and patience. Connect this to diverse fields like economics, computer science, or philosophy programs. Do not simply find colleges known for chess. Help the student discover new possibilities based on the underlying traits their interests suggest.

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
  2.  Interpret their interests holistically to understand the *underlying skills and passions*.
  3.  Interpret the user's filter query to narrow down the search.
  4.  Find 6 real colleges or universities that are a strong match for BOTH the student's profile AND their filter query.
  5.  For each college, provide its name, location, and a compelling, personalized 'reasoning' that connects the college's strengths to the student's *underlying traits*. For example, instead of "Good for science," say "Its renowned marine biology program is perfect for your passion for oceanography."
  
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
