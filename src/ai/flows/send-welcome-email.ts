
'use server';

/**
 * @fileOverview An AI agent for sending a welcome email using a real email service.
 *
 * - sendWelcomeEmail - A function that sends a welcome email.
 * - SendWelcomeEmailInput - The input type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import nodemailer from 'nodemailer';

const SendWelcomeEmailInputSchema = z.object({
  name: z.string().describe('The name of the user.'),
  email: z.string().email().describe('The email address of the user.'),
});
export type SendWelcomeEmailInput = z.infer<typeof SendWelcomeEmailInputSchema>;

export async function sendWelcomeEmail(input: SendWelcomeEmailInput): Promise<void> {
  await sendWelcomeEmailFlow(input);
}

const sendWelcomeEmailFlow = ai.defineFlow(
  {
    name: 'sendWelcomeEmailFlow',
    inputSchema: SendWelcomeEmailInputSchema,
    outputSchema: z.void(),
  },
  async ({ name, email }) => {
    // Check if the email address ends with @gmail.com
    if (!email.endsWith('@gmail.com')) {
        console.log(`Skipping email to ${email} as it is not a Gmail address.`);
        return;
    }

    const { GMAIL_EMAIL, GMAIL_APP_PASSWORD } = process.env;

    if (!GMAIL_EMAIL || !GMAIL_APP_PASSWORD) {
        console.error('Missing GMAIL_EMAIL or GMAIL_APP_PASSWORD environment variables. Please check your .env file.');
        throw new Error('Email credentials are not configured on the server.');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: GMAIL_EMAIL,
            pass: GMAIL_APP_PASSWORD,
        },
    });

    const mailOptions = {
        from: `"PinnaclePath" <${GMAIL_EMAIL}>`,
        to: email,
        subject: 'Welcome to PinnaclePath!',
        text: `Hi ${name}!\n\nThanks for using our product!`,
        html: `<h3>Hi ${name}!</h3><p>Thanks for using our product!</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
        // We throw an error so the calling function knows something went wrong.
        // In a real-world app, you might want more robust error handling, like a retry queue.
        throw new Error('Failed to send welcome email.');
    }
  }
);
