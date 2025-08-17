
'use server';

/**
 * @fileOverview An AI agent for sending a welcome email.
 *
 * - sendWelcomeEmail - A function that sends a welcome email.
 * - SendWelcomeEmailInput - The input type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SendWelcomeEmailInputSchema = z.object({
  name: z.string().describe('The name of the user.'),
  email: z.string().email().describe('The email address of the user.'),
});
export type SendWelcomeEmailInput = z.infer<typeof SendWelcomeEmailInputSchema>;

export async function sendWelcomeEmail(input: SendWelcomeEmailInput): Promise<void> {
  await sendWelcomeEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sendWelcomeEmailPrompt',
  input: {schema: SendWelcomeEmailInputSchema},
  model: 'googleai/gemini-2.0-flash',
  prompt: `You are an email sending service. A user has just signed up. Generate a log message confirming that a welcome email has been sent. The log should be a single line. For example: "Simulated sending welcome email to name at email."`,
});


const sendWelcomeEmailFlow = ai.defineFlow(
  {
    name: 'sendWelcomeEmailFlow',
    inputSchema: SendWelcomeEmailInputSchema,
    outputSchema: z.void(),
  },
  async (input) => {
    // In a real application, this is where you would integrate with an email sending service like SendGrid or AWS SES.
    // For this demo, we are just logging the action to the console via the LLM prompt.
    const llmResponse = await prompt(input);
    console.log(`Simulated sending welcome email to ${input.email}. Response: ${llmResponse.text}`);
  }
);
