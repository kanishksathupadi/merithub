
'use server';

/**
 * @fileOverview An AI flow that simulates sending a welcome email to a new user.
 *
 * - sendWelcomeEmail - A function that "sends" a welcome email.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WelcomeEmailInputSchema = z.object({
  name: z.string().describe('The first name of the new user.'),
  email: z.string().email().describe('The email address of the new user.'),
});
export type WelcomeEmailInput = z.infer<typeof WelcomeEmailInputSchema>;

const WelcomeEmailOutputSchema = z.object({
    success: z.boolean().describe("Whether the email was 'sent' successfully."),
    message: z.string().describe("A log message describing the outcome."),
});
export type WelcomeEmailOutput = z.infer<typeof WelcomeEmailOutputSchema>;

export async function sendWelcomeEmail(input: WelcomeEmailInput): Promise<WelcomeEmailOutput> {
  // This is a simulated flow. In a real app, this would use a service like SendGrid or AWS SES.
  // For this prototype, we'll use an AI to generate the email content and log it.

  // First, check if the email is a @gmail.com address as requested.
  if (!input.email.endsWith('@gmail.com')) {
    const message = `Welcome email not sent to ${input.email} because it is not a Gmail address.`;
    console.log(message);
    return {
        success: false,
        message,
    };
  }

  // Define the prompt for the AI to generate the email body.
  const prompt = `
    You are an AI in charge of sending a welcome email for PinnaclePath, an AI-powered academic planner.
    Generate the plain text body for a welcome email to a new user.

    The user's name is: ${input.name}
    
    The email should be:
    - Friendly, encouraging, and professional.
    - Start with a personalized greeting.
    - Briefly explain what PinnaclePath is (an AI co-pilot for academic success).
    - Suggest the first step for the user, which is to complete their onboarding profile to get their personalized AI roadmap.
    - End with a warm closing from "The PinnaclePath Team".
  `;
  
  // Use the AI to generate the email content.
  const llmResponse = await ai.generate({
    prompt: prompt,
    model: 'googleai/gemini-2.0-flash',
  });
  
  const emailBody = llmResponse.text;

  // Log the simulated email to the console. This represents "sending" it.
  console.log('--- SIMULATING WELCOME EMAIL ---');
  console.log(`To: ${input.email}`);
  console.log(`Subject: Welcome to PinnaclePath, ${input.name}!`);
  console.log('---');
  console.log(emailBody);
  console.log('-----------------------------');
  
  const successMessage = `Successfully sent welcome email to ${input.email}.`;
  
  // Return a success response.
  return {
    success: true,
    message: successMessage,
  };
}
