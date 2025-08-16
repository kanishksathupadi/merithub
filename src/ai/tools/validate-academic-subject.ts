'use server';
/**
 * @fileoverview A tool to validate if a given topic is a real academic subject or skill.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidationResultSchema = z.object({
    isValid: z.boolean().describe('Whether the subject is a valid academic subject or skill.'),
    reasoning: z.string().describe('The reasoning for the validation result.'),
});

export const validateAcademicSubject = ai.defineTool(
  {
    name: 'validateAcademicSubject',
    description: 'Validates if a given topic is a real academic subject or skill.',
    inputSchema: z.object({
      subject: z.string().describe('The subject to validate.'),
    }),
    outputSchema: ValidationResultSchema,
  },
  async (input) => {
    const prompt = `Is "${input.subject}" a recognized academic subject, a professional skill, or a common area of study? Please respond with a simple yes or no, followed by a brief explanation.`;
    
    const llmResponse = await ai.generate({
        prompt,
        model: 'googleai/gemini-2.0-flash',
        output: {
            schema: z.object({
                isValid: z.boolean(),
                reasoning: z.string(),
            })
        }
    });

    const response = llmResponse.output;

    if (!response) {
      return {
        isValid: false,
        reasoning: "Could not validate the subject.",
      };
    }
    
    return response;
  }
);
