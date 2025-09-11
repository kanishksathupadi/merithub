
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
  prompt: `You are an expert college admissions advisor. Your task is to recommend a list of 6 colleges, categorized into 'Reach', 'Target', and 'Safety' schools, based on a student's profile and a specific filter query.

  **IMPORTANT AGE-SPECIFIC HANDLING:**
  - **For High School Students (Grades 9-12):** Proceed with generating the college lists as requested.
  - **For Middle School Students (Grades 5-8):** DO NOT recommend specific colleges. The student is too young. Instead, set all three school lists (reach, target, safety) to be empty arrays. For the 'reasoning' field in each category (even though the list is empty), provide encouraging, age-appropriate advice about high school preparation. For example, for 'reachSchools' reasoning, say "It's a bit early to think about specific colleges, but you can 'reach' for your goals by taking challenging classes in high school!" For 'targetSchools' reasoning, say "Focus on finding subjects you're passionate about in middle and high school to 'target' your interests." For 'safetySchools' reasoning, say "Building great study habits now is a 'safety' net for success in all your future classes." The final output must still be a valid JSON object with the three school lists (which will be empty).

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

  **Instructions (for High School Students):**
  1.  Analyze the student's entire profile to understand their unique character, academic standing, and preferences.
  2.  Interpret their interests holistically to understand the *underlying skills and passions*.
  3.  Interpret the user's filter query to narrow down the search.
  4.  Find exactly 6 real colleges or universities that are a strong match for BOTH the student's profile AND their filter query.
  5.  Categorize these 6 schools into three lists:
      - **reachSchools**: Exactly 2 schools where admission would be a challenge, but is possible. These are ambitious choices.
      - **targetSchools**: Exactly 2 schools where the student's profile is a solid match for the typical admitted student.
      - **safetySchools**: Exactly 2 schools where admission is highly likely.
  6.  For each college, provide its name, location, and a compelling, personalized 'reasoning' that connects the college's strengths to the student's *underlying traits*. For example, instead of "Good for science," say "Its renowned marine biology program is perfect for your passion for oceanography."
  
  Do not invent colleges. Ensure the recommendations are diverse and well-reasoned. The final output must be a JSON object with the three specified school lists.
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
