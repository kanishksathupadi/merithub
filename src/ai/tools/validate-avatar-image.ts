
'use server';
/**
 * @fileoverview A tool to validate the quality of a generated avatar image.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidationInputSchema = z.object({
    imageUrl: z.string().url().describe("A data URI of the image to validate. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
    letter: z.string().length(1).describe("The letter that is supposed to be in the avatar."),
});

const ValidationResultSchema = z.object({
    isValid: z.boolean().describe('Whether the avatar meets the quality criteria.'),
    reasoning: z.string().describe('A brief explanation of why the avatar is valid or not.'),
});

export const validateAvatarImage = ai.defineTool(
  {
    name: 'validateAvatarImage',
    description: 'Analyzes a generated avatar to ensure it meets quality standards.',
    inputSchema: ValidationInputSchema,
    outputSchema: ValidationResultSchema,
  },
  async (input) => {
    const prompt = `You are an expert quality assurance specialist for graphic design. Your task is to validate a generated avatar image based on strict criteria.

    The avatar must meet ALL of the following requirements:
    1.  It must contain only the single, capital letter: '${input.letter}'. No other letters or symbols.
    2.  The letter must be perfectly centered, both horizontally and vertically.
    3.  The letter must be white.
    4.  The background must be a solid, single color of professional blue. No gradients, textures, or other elements.
    5.  The image must be clear and high-quality, not blurry or pixelated.

    Analyze the provided image and determine if it meets all these criteria.

    Image to analyze: {{media url=imageUrl}}
    `;
    
    const llmResponse = await ai.generate({
        prompt,
        model: 'googleai/gemini-2.0-flash',
        output: {
            schema: ValidationResultSchema,
        }
    });

    const result = llmResponse.output;
    if (!result) {
        // If the validation process itself fails, assume the image is not valid.
      return {
        isValid: false,
        reasoning: "Could not validate the avatar due to an internal error.",
      };
    }
    
    return result;
  }
);
