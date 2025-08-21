
'use server';

/**
 * @fileOverview AI agent that finds scholarships matching a student's profile.
 *
 * - findScholarships - A function that recommends scholarships.
 * - FindScholarshipsInput - The input type for the findScholarships function.
 * - FindScholarshipsOutput - The return type for the findScholarships function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const FindScholarshipsInputSchema = z.object({
  academicProfile: z.string().describe("The student's academic profile, including GPA, test scores (SAT/ACT), and key subjects."),
  extracurriculars: z.string().describe("The student's main extracurricular activities, achievements, and leadership roles."),
  interests: z.string().describe("The student's personal interests, passions, and intended field of study."),
  background: z.string().describe("The student's background, including any relevant demographic information (e.g., first-generation student, specific heritage) or financial need."),
});
export type FindScholarshipsInput = z.infer<typeof FindScholarshipsInputSchema>;

export const FindScholarshipsOutputSchema = z.object({
    scholarships: z.array(z.object({
        name: z.string().describe("The name of the scholarship."),
        amount: z.string().describe("The scholarship award amount (e.g., '$10,000' or 'Full Tuition')."),
        deadline: z.string().describe("The application deadline for the scholarship."),
        description: z.string().describe("A brief summary of the scholarship and its eligibility requirements."),
        applicationUrl: z.string().url().describe("The direct, valid URL to the scholarship's application or information page."),
    })).describe("A list of 5 to 7 relevant scholarships."),
});
export type FindScholarshipsOutput = z.infer<typeof FindScholarshipsOutputSchema>;


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
