
'use server';

/**
 * @fileOverview AI agent that generates and validates a personalized avatar image.
 *
 * - generateAvatar - A function that creates a personalized avatar.
 * - GenerateAvatarInput - The input type for the generateAvatar function.
 * - GenerateAvatarOutput - The return type for the generateAvatar function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { validateAvatarImage } from '../tools/validate-avatar-image';

const GenerateAvatarInputSchema = z.object({
  letter: z.string().length(1).describe('The letter to feature in the avatar.'),
});
export type GenerateAvatarInput = z.infer<typeof GenerateAvatarInputSchema>;

const GenerateAvatarOutputSchema = z.object({
  imageUrl: z.string().url().describe('The data URI of the generated avatar image.'),
});
export type GenerateAvatarOutput = z.infer<typeof GenerateAvatarOutputSchema>;

export async function generateAvatar(input: GenerateAvatarInput): Promise<GenerateAvatarOutput> {
  return generateAvatarFlow(input);
}

const generateAvatarFlow = ai.defineFlow(
  {
    name: 'generateAvatarFlow',
    inputSchema: GenerateAvatarInputSchema,
    outputSchema: GenerateAvatarOutputSchema,
  },
  async ({letter}) => {
    const prompt = `Generate a minimalist, high-quality avatar featuring the capital letter '${letter}'. The letter should be bold, white, and perfectly centered in the image. The font should be a clean, modern, sans-serif type like Helvetica Bold. The background must be a single, solid, professional blue color (hex code #3B82F6). There should be no other elements, textures, or gradients in the image.`;
    
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        attempts++;
        try {
            const {media} = await ai.generate({
                model: 'googleai/gemini-2.0-flash-preview-image-generation',
                prompt: prompt,
                config: {
                    responseModalities: ['IMAGE', 'TEXT'],
                },
            });

            if (!media?.url) {
                console.log(`Attempt ${attempts}: Image generation failed, no media URL returned.`);
                continue; // Generation failed, try again.
            }

            const validation = await validateAvatarImage({ imageUrl: media.url, letter });

            if (validation.isValid) {
                return { imageUrl: media.url };
            }
        } catch (error) {
            console.error(`Attempt ${attempts} failed with an error:`, error);
            // If it's the last attempt and it still fails, the error will be thrown after the loop.
        }
    }

    throw new Error(`Failed to generate a valid avatar for the letter "${letter}" after ${maxAttempts} attempts.`);
  }
);
