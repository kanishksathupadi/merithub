
'use server';

/**
 * @fileOverview An AI agent for sending a welcome email.
 *
 * - sendWelcomeEmail - A function that "sends" a welcome email.
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
  prompt: `You are a friendly customer service agent. Your task is to send a welcome email to a new user.

  User's Name: {{{name}}}
  User's Email: {{{email}}}

  Email Subject: Welcome to PinnaclePath!

  Email Body:
  Hi {{{name}}}!

  Thanks for using our product!

  ---
  This is a simulated email. Do not actually send an email. Just output the action of sending. For example: "Email sent to john.doe@example.com".
  `,
});

const sendWelcomeEmailFlow = ai.defineFlow(
  {
    name: 'sendWelcomeEmailFlow',
    inputSchema: SendWelcomeEmailInputSchema,
    outputSchema: z.void(),
  },
  async input => {
    // In a real application, this is where you would integrate with an email sending service like SendGrid or AWS SES.
    // For this demo, we are just logging the action to the console via the LLM prompt.
    const llmResponse = await prompt(input);
    console.log(`Simulated sending welcome email to ${input.email}. Response: ${llmResponse.text}`);
  }
);
