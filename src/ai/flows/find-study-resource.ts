
'use server';

/**
 * @fileOverview AI agent that finds the best online study resource for a given query.
 *
 * - findStudyResource - A function that finds a study resource.
 * - FindStudyResourceInput - The input type for the findStudyResource function.
 * - FindStudyResourceOutput - The return type for the findStudyResource function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindStudyResourceInputSchema = z.object({
  query: z.string().describe('The user\'s search query for a study resource.'),
});
export type FindStudyResourceInput = z.infer<typeof FindStudyResourceInputSchema>;

const FindStudyResourceOutputSchema = z.object({
  title: z.string().describe("The title of the recommended resource."),
  description: z.string().describe("A brief, one-sentence summary of why this resource is a great match."),
  url: z.string().describe("The direct, valid URL to the resource."),
  resourceType: z.enum(['Video', 'Article', 'Guide', 'Course', 'Podcast']).describe("The type of the resource."),
});
export type FindStudyResourceOutput = z.infer<typeof FindStudyResourceOutputSchema>;

export async function findStudyResource(input: FindStudyResourceInput): Promise<FindStudyResourceOutput> {
  return findStudyResourceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findStudyResourcePrompt',
  input: {schema: FindStudyResourceInputSchema},
  output: {schema: FindStudyResourceOutputSchema},
  prompt: `You are an expert academic advisor and researcher. A student has asked for help finding the best online study resource.

  User's query: "{{{query}}}"

  Your task is to find the SINGLE BEST, publicly accessible, high-quality online resource that directly addresses the user's query. The resource must be real and the URL must be valid.

  Think step-by-step:
  1.  Analyze the user's query to understand their specific need (e.g., "best explanation of cellular respiration for AP Bio," "interactive trigonometry practice problems").
  2.  Search your knowledge for the most reputable and effective resources. Prioritize well-known educational platforms (Khan Academy, Coursera, edX), university websites (.edu), reputable video channels (CrashCourse, Bozeman Science), or high-quality articles.
  3.  Select the single best match.
  4.  Provide a concise title, a one-sentence description of why it's a good fit, the direct URL, and the type of resource.

  Do not recommend generic homepages. Link directly to the specific article, video, or course. Ensure the URL is 100% correct and accessible. Do not invent resources or URLs. The link must be functional.
  `,
});

const findStudyResourceFlow = ai.defineFlow(
  {
    name: 'findStudyResourceFlow',
    inputSchema: FindStudyResourceInputSchema,
    outputSchema: FindStudyResourceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
