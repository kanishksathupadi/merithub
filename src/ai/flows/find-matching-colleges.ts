
'use server';

/**
 * @fileOverview AI agent that finds colleges matching a student's profile and preferences.
 *
 * - findMatchingColleges - A function that recommends colleges.
 * - FindMatchingCollegesInput - The input type for the findMatchingColleges function.
 * - FindMatchingCollegesOutput - The return type for the findMatchingColleges function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const FindMatchingCollegesInputSchema = z.object({
  filterQuery: z.string().describe('The user\'s filter query (e.g., "small colleges", "schools in california").'),
  academicStrengths: z.string().describe('The academic strengths of the student.'),
  academicWeaknesses: z.string().describe('The academic weaknesses of the student.'),
  subjectsOfInterest: z.string().describe('Subjects and topics the student is passionate about.'),
  collegeEnvironment: z.string().describe('The type of college learning environment the student prefers.'),
  preferredLearningStyle: z.string().describe('The preferred learning style of the student.'),
  currentExtracurriculars: z.string().describe('The current extracurricular activities of the student.'),
  weeklyTimeAvailable: z.string().describe('The weekly time available for self-improvement in hours.'),
  grade: z.coerce.number().describe('The current grade level of the student (5-12).'),
});
export type FindMatchingCollegesInput = z.infer<typeof FindMatchingCollegesInputSchema>;

export const FindMatchingCollegesOutputSchema = z.array(z.object({
    name: z.string().describe("The full name of the college or university."),
    location: z.string().describe("The city and state of the college (e.g., 'Cambridge, MA')."),
    reasoning: z.string().describe("A brief, one-sentence summary of why this college is an excellent match for this specific student, directly referencing their profile."),
}));
export type FindMatchingCollegesOutput = z.infer<typeof FindMatchingCollegesOutputSchema>;

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
