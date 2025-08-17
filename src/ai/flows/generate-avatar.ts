
'use server';

/**
 * @fileOverview AI agent that generates a personalized avatar image.
 *
 * - generateAvatar - A function that creates a personalized avatar.
 * - GenerateAvatarInput - The input type for the generateAvatar function.
 * - GenerateAvatarOutput - The return type for the generateAvatar function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
    const prompt = `Generate an extremely simple image of the capital letter '${letter}'. The letter must be in a standard, blocky, non-serif font like Arial or Helvetica. It should be perfectly centered. The background must be a single, solid, neutral gray color. The letter itself must be a single, solid, contrasting color like white or black. There should be absolutely no other designs, patterns, gradients, or textures on the letter or in the background. The final image should be clean and minimalist.`;
    
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: prompt,
      config: {
        responseModalities: ['IMAGE', 'TEXT'],
      },
    });

    if (!media?.url) {
      throw new Error('Image generation failed to produce an output.');
    }

    return { imageUrl: media.url };
  }
);
