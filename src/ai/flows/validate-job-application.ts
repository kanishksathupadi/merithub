
'use server';

/**
 * @fileOverview An AI agent that validates a job application for authenticity.
 *
 * - validateJobApplication - A function that checks if an application is genuine.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateJobApplicationInputSchema = z.object({
  name: z.string().describe('The name of the applicant.'),
  email: z.string().describe('The email of the applicant.'),
  coverLetter: z.string().describe('The content of the cover letter.'),
});
export type ValidateJobApplicationInput = z.infer<typeof ValidateJobApplicationInputSchema>;

const ValidateJobApplicationOutputSchema = z.object({
    isGenuine: z.boolean().describe("Whether the application appears to be a serious, genuine attempt."),
    reasoning: z.string().describe("A brief, internal-facing reason for the decision. This will not be shown to the user."),
});
export type ValidateJobApplicationOutput = z.infer<typeof ValidateJobApplicationOutputSchema>;

export async function validateJobApplication(input: ValidateJobApplicationInput): Promise<ValidateJobApplicationOutput> {
  return validateJobApplicationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateJobApplicationPrompt',
  input: {schema: ValidateJobApplicationInputSchema},
  output: {schema: ValidateJobApplicationOutputSchema},
  model: 'googleai/gemini-2.0-flash',
  prompt: `You are an AI pre-screening assistant for a company's hiring platform. Your only job is to perform a basic spam and sanity check on a job application. You must determine if the application is a genuine attempt or if it is spam, nonsensical, or a test.

  An application is NOT GENUINE if the cover letter:
  - Contains random, incoherent characters (e.g., "asdfjkl; asdfjkl;").
  - Is clearly a test submission (e.g., the cover letter is just "test").
  - Contains spam, advertisements, or content completely unrelated to a job application.
  - Is complete gibberish.

  An application IS GENUINE if the cover letter:
  - Is a coherent piece of text, even if it's poorly written.
  - Attempts to address the company or role in any way.
  - Looks like a real, if generic, cover letter.

  Analyze the following application details:
  - Applicant Name: "{{{name}}}"
  - Applicant Email: "{{{email}}}"
  - Cover Letter: "{{{coverLetter}}}"

  Based on your analysis, set 'isGenuine' to true or false and provide a brief, internal-facing 'reasoning'.
  `,
});

const validateJobApplicationFlow = ai.defineFlow(
  {
    name: 'validateJobApplicationFlow',
    inputSchema: ValidateJobApplicationInputSchema,
    outputSchema: ValidateJobApplicationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      // Default to true to avoid blocking legitimate applications in case of an AI error.
      return { isGenuine: true, reasoning: 'AI validation failed.' };
    }
    return output;
  }
);
