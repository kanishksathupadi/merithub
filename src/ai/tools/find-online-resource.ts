
'use server';
/**
 * @fileoverview A tool to find a relevant online resource for a given query.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResourceSchema = z.object({
    title: z.string().describe('The title of the recommended online resource.'),
    url: z.string().url().describe('The valid URL for the resource.'),
});

export const findOnlineResource = ai.defineTool(
  {
    name: 'findOnlineResource',
    description: 'Finds the single best, publicly accessible, high-quality online resource (article or video) for a given academic topic or skill.',
    inputSchema: z.object({
      query: z.string().describe('The topic to find a resource for (e.g., "Intro to Calculus", "Learn Python programming").'),
    }),
    outputSchema: ResourceSchema,
  },
  async (input) => {
    const prompt = `Find the single best, real, and publicly accessible online resource (like a specific Khan Academy video, a detailed article, or a tutorial) for the topic: "${input.query}". The URL must be valid and directly link to the content. Provide the title of the resource and its URL.`;
    
    const llmResponse = await ai.generate({
        prompt,
        model: 'googleai/gemini-2.0-flash',
        output: {
            schema: ResourceSchema,
        }
    });

    const resource = llmResponse.output;
    if (!resource) {
      throw new Error(`Could not find a resource for the query: ${input.query}`);
    }
    
    return resource;
  }
);

    