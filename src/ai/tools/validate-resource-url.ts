
'use server';
/**
 * @fileoverview A tool to validate if a given URL is a real, working web page.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const URLValidationResultSchema = z.object({
    isValid: z.boolean().describe('Whether the URL is a valid, publicly accessible web page.'),
    reasoning: z.string().describe('The reasoning for the validation result (e.g., "OK", "Not Found", "Error").'),
});

export const validateResourceURL = ai.defineTool(
  {
    name: 'validateResourceURL',
    description: 'Checks if a given URL is a real, working, and publicly accessible web page by making a network request.',
    inputSchema: z.object({
      url: z.string().url().describe('The URL to validate.'),
    }),
    outputSchema: URLValidationResultSchema,
  },
  async (input) => {
    try {
        const response = await fetch(input.url, { method: 'HEAD', redirect: 'follow' });

        if (response.ok) {
            // Status code in the 200-299 range.
            return {
                isValid: true,
                reasoning: `OK. Status code: ${response.status}.`,
            };
        } else {
            // Status code outside the 200-299 range.
            return {
                isValid: false,
                reasoning: `Failed. The URL returned a non-successful status code: ${response.status} ${response.statusText}.`,
            };
        }
    } catch (error: any) {
        // Network error or other fetch-related issue.
        console.error(`URL validation failed for ${input.url}:`, error);
        return {
            isValid: false,
            reasoning: `Error. Could not fetch the URL. The host may be unreachable or the URL may be malformed. Details: ${error.message}`,
        };
    }
  }
);
