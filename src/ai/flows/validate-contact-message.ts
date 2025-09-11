
'use server';

/**
 * @fileOverview An AI agent that validates a contact message for authenticity.
 *
 * - validateContactMessage - A function that checks if a message is genuine.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateContactMessageInputSchema = z.object({
  name: z.string().describe('The name of the person submitting the form.'),
  email: z.string().describe('The email of the person submitting the form.'),
  inquiryType: z.string().describe('The type of inquiry.'),
  message: z.string().describe('The message content.'),
});
export type ValidateContactMessageInput = z.infer<typeof ValidateContactMessageInputSchema>;

const ValidateContactMessageOutputSchema = z.object({
    isGenuine: z.boolean().describe("Whether the message appears to be a genuine, coherent inquiry from a real person."),
    reasoning: z.string().describe("A brief, internal-facing reason for the decision. This will not be shown to the user."),
});
export type ValidateContactMessageOutput = z.infer<typeof ValidateContactMessageOutputSchema>;

export async function validateContactMessage(input: ValidateContactMessageInput): Promise<ValidateContactMessageOutput> {
  return validateContactMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateContactMessagePrompt',
  input: {schema: ValidateContactMessageInputSchema},
  output: {schema: ValidateContactMessageOutputSchema},
  model: 'googleai/gemini-2.0-flash',
  prompt: `You are a sophisticated spam detection AI for a website's contact form. Your task is to determine if a submitted message is a genuine inquiry or if it is spam, nonsensical, or a test submission.

  A message is NOT GENUINE if it:
  - Contains random, incoherent characters (e.g., "asdfjkl; asdfjkl;").
  - Is clearly a test submission (e.g., "test test test").
  - Contains obvious spam, like advertisements for unrelated products or scam-like language.
  - Is gibberish or has no discernible meaning.

  A message IS GENUINE if it:
  - Is a coherent question or statement, even if it's brief.
  - Relates to the services of the company (AI School Mentor, an education platform).
  - Is a standard business inquiry (e.g., partnership, technical support).

  Analyze the following submission details:
  - Name: "{{{name}}}"
  - Email: "{{{email}}}"
  - Inquiry Type: "{{{inquiryType}}}"
  - Message: "{{{message}}}"

  Based on your analysis, set 'isGenuine' to true or false and provide a brief 'reasoning' for your decision. The reasoning is for internal review only.
  `,
});

const validateContactMessageFlow = ai.defineFlow(
  {
    name: 'validateContactMessageFlow',
    inputSchema: ValidateContactMessageInputSchema,
    outputSchema: ValidateContactMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      // Default to true to avoid blocking legitimate messages in case of an AI error.
      return { isGenuine: true, reasoning: 'AI validation failed.' };
    }
    return output;
  }
);
