
'use server';

/**
 * @fileOverview AI agent that generates a representative image for a college.
 *
 * - generateCollegeImage - A function that creates an image for a college.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCollegeImageInputSchema = z.object({
  collegeName: z.string().describe('The name of the college or university.'),
});
export type GenerateCollegeImageInput = z.infer<typeof GenerateCollegeImageInputSchema>;

const GenerateCollegeImageOutputSchema = z.object({
  imageUrl: z.string().url().describe('The data URI of the generated image.'),
});
export type GenerateCollegeImageOutput = z.infer<typeof GenerateCollegeImageOutputSchema>;

export async function generateCollegeImage(input: GenerateCollegeImageInput): Promise<GenerateCollegeImageOutput> {
  return generateCollegeImageFlow(input);
}

const generateCollegeImageFlow = ai.defineFlow(
  {
    name: 'generateCollegeImageFlow',
    inputSchema: GenerateCollegeImageInputSchema,
    outputSchema: GenerateCollegeImageOutputSchema,
  },
  async ({collegeName}) => {
    const prompt = `A scenic, beautiful, and **accurate** wide-angle photograph of the real campus of **${collegeName}**. The image should be highly detailed, photorealistic, and look like a professional photograph taken at the location. Capture the unique architecture and atmosphere of the university.`;
    
    const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: prompt,
        config: {
            responseModalities: ['IMAGE', 'TEXT'],
        },
    });

    if (!media?.url) {
        throw new Error(`Image generation failed for ${collegeName}.`);
    }

    return { imageUrl: media.url };
  }
);
