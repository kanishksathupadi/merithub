
'use server';

/**
 * @fileOverview AI agent that reviews a student's essay.
 *
 * - reviewEssay - A function that provides feedback on an essay.
 * - ReviewEssayInput - The input type for the reviewEssay function.
 * - ReviewEssayOutput - The return type for the reviewEssay function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReviewEssayInputSchema = z.object({
  essay: z.string().describe('The student\'s essay text.'),
  prompt: z.string().describe('The essay prompt the student is responding to.'),
});
export type ReviewEssayInput = z.infer<typeof ReviewEssayInputSchema>;

const ReviewEssayOutputSchema = z.object({
    clarity: z.object({
        score: z.number().min(0).max(100).describe("A score from 0-100 on the essay's clarity and focus."),
        feedback: z.string().describe("Specific, constructive feedback on the essay's clarity."),
    }),
    grammar: z.object({
        score: z.number().min(0).max(100).describe("A score from 0-100 on the essay's grammar and mechanics."),
        feedback: z.string().describe("Specific, constructive feedback on the essay's grammar and spelling."),
    }),
    structure: z.object({
        score: z.number().min(0).max(100).describe("A score from 0-100 on the essay's structure and organization."),
        feedback: z.string().describe("Specific, constructive feedback on the essay's structure, including intro, body, and conclusion."),
    }),
    overall: z.object({
        score: z.number().min(0).max(100).describe("An overall score from 0-100 for the essay."),
        feedback: z.string().describe("A summary of the essay's strengths and areas for improvement."),
    }),
});
export type ReviewEssayOutput = z.infer<typeof ReviewEssayOutputSchema>;

export async function reviewEssay(input: ReviewEssayInput): Promise<ReviewEssayOutput> {
  return reviewEssayFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reviewEssayPrompt',
  input: {schema: ReviewEssayInputSchema},
  output: {schema: ReviewEssayOutputSchema},
  model: 'googleai/gemini-2.0-flash',
  prompt: `You are an expert college admissions advisor and writing coach. Your task is to review a student's essay and provide constructive, actionable feedback.

  The student is writing in response to the following prompt:
  "{{{prompt}}}"

  Here is the student's essay:
  "{{{essay}}}"

  Analyze the essay based on four criteria: Clarity, Grammar, Structure, and Overall Impression. For each criterion, provide a score from 0 to 100 and detailed, specific feedback. The feedback should be encouraging but also direct, helping the student understand exactly what to do to improve their writing.

  - **Clarity**: Does the essay clearly answer the prompt? Is the main idea easy to understand? Is the language precise?
  - **Grammar**: Are there any spelling, punctuation, or grammatical errors?
  - **Structure**: Does the essay have a clear introduction, body paragraphs that support the main thesis, and a strong conclusion? Is the flow logical?
  - **Overall**: Provide a holistic assessment of the essay. What works well? What are the biggest areas for improvement?

  Your response must be in the specified JSON format.
  `,
});

const reviewEssayFlow = ai.defineFlow(
  {
    name: 'reviewEssayFlow',
    inputSchema: ReviewEssayInputSchema,
    outputSchema: ReviewEssayOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to generate essay review.");
    }
    return output;
  }
);
