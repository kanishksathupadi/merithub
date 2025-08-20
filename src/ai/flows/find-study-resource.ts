
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
import { findOnlineResource } from '../tools/find-online-resource';

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
  // This flow now primarily uses the robust `findOnlineResource` tool, which has built-in validation and retries.
  // We add a simple prompt to classify the resource type and generate a description.
  const resource = await findOnlineResource(input);

  if (!resource) {
    throw new Error(`Could not find a valid resource for query: ${input.query}`);
  }

  const classificationPrompt = `
    Based on the following resource, classify its type and write a one-sentence description of why it's a great match for the user's query.

    User Query: "${input.query}"
    Resource Title: "${resource.title}"
    Resource URL: "${resource.url}"

    Provide only the resource type and description in the specified JSON format.
  `;

  const llmResponse = await ai.generate({
      prompt: classificationPrompt,
      model: 'googleai/gemini-2.0-flash',
      output: {
          schema: z.object({
              description: z.string().describe("A brief, one-sentence summary of why this resource is a great match."),
              resourceType: z.enum(['Video', 'Article', 'Guide', 'Course', 'Podcast']).describe("The type of the resource."),
          })
      }
  });

  const classification = llmResponse.output;

  if (!classification) {
      throw new Error(`Could not classify the resource for query: ${input.query}`);
  }

  return {
      ...resource,
      ...classification
  };
}
