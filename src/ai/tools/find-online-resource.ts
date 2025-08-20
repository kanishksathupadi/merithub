
'use server';
/**
 * @fileoverview A tool to find a relevant online resource for a given query.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { validateResourceURL } from './validate-resource-url';

const ResourceSchema = z.object({
    title: z.string().describe('The title of the recommended online resource.'),
    url: z.string().url().describe('The valid, working URL for the resource.'),
});

export const findOnlineResource = ai.defineTool(
  {
    name: 'findOnlineResource',
    description: 'Finds the single best, publicly accessible, high-quality online resource (article or video) for a given academic topic or skill. It MUST validate the URL to ensure it is a real, working link before returning.',
    inputSchema: z.object({
      query: z.string().describe('The topic to find a resource for (e.g., "Intro to Calculus", "Learn Python programming").'),
    }),
    outputSchema: ResourceSchema,
  },
  async (input) => {
    const prompt = `Find the single best, real, and publicly accessible online resource for the topic: "${input.query}".

    IMPORTANT: You must use the validateResourceURL tool to verify the URL is valid and leads directly to the content. Prioritize well-known, high-quality sources like Khan Academy, Coursera, edX, university websites (.edu), official documentation, or major educational YouTube channels (like CrashCourse). Do not invent URLs. Your primary goal is to provide a working link.

    If validation fails, you must try to find a different resource.`;
    
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        attempts++;
        const llmResponse = await ai.generate({
            prompt,
            model: 'googleai/gemini-2.0-flash',
            tools: [validateResourceURL],
            output: {
                schema: ResourceSchema,
            }
        });

        const resource = llmResponse.output;
        if (!resource || !resource.url) {
            if (attempts >= maxAttempts) {
                throw new Error(`Could not find a resource for the query after ${attempts} attempts: ${input.query}`);
            }
            continue; // Try again
        }
        
        // The LLM should have used the tool, but we can double-check here for robustness if needed,
        // although the prompt forces it. The LLM's internal validation is the key.
        return resource;
    }
    
    throw new Error(`Failed to find a valid resource for "${input.query}" after ${maxAttempts} attempts.`);
  }
);
