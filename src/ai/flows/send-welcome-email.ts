
'use server';

/**
 * @fileOverview An AI agent for sending a welcome email via Gmail.
 *
 * - sendWelcomeEmail - A function that sends a welcome email.
 * - SendWelcomeEmailInput - The input type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
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
    // In a real application, this is where you would integrate with an email sending service like SendGrid or AWS SES.
    // For this demo, we are just logging the action to the console via the LLM prompt.
    console.log(`Attempting to send welcome email to ${email}.`);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    const mailOptions = {
        from: `"PinnaclePath" <${process.env.GMAIL_EMAIL}>`,
        to: email,
        subject: 'Welcome to PinnaclePath!',
        html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h1 style="color: #3B82F6;">Hi ${name}!</h1>
                <p>Thanks for using our product!</p>
                <p>We're excited to help you on your journey to success.</p>
                <br/>
                <p>Best,</p>
                <p>The PinnaclePath Team</p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!', info.response);
    } catch (error) {
        console.error('Failed to send email:', error);
        // We throw an error so the calling function knows something went wrong.
        // In a real-world app, you might want more robust error handling, like a retry queue.
        throw new Error('Failed to send welcome email.');
    }
  }
);
