
'use server';
/**
 * @fileoverview A tool to find a relevant online resource for a given query.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResourceSchema = z.object({
    title: z.string().describe('The title of the recommended online resource.'),
    url: z.string().url().describe('The valid, working URL for the resource.'),
});

export const findOnlineResource = ai.defineTool(
  {
    name: 'findOnlineResource',
    description: 'Finds the single best, publicly accessible, high-quality online resource (article or video) for a given academic topic or skill. The URL must be a real, working link.',
    inputSchema: z.object({
      query: z.string().describe('The topic to find a resource for (e.g., "Intro to Calculus", "Learn Python programming").'),
    }),
    outputSchema: ResourceSchema,
  },
  async (input) => {
    const prompt = `Find the single best, real, and publicly accessible online resource for the topic: "${input.query}".

    IMPORTANT: The URL must be 100% valid and lead directly to the content. Prioritize well-known, high-quality sources like Khan Academy, Coursera, edX, university websites (.edu), official documentation, or major educational YouTube channels (like CrashCourse). Do not invent URLs. Your primary goal is to provide a working link.

    Return the title of the resource and its direct URL.`;
    
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
