
'use server';

/**
 * @fileOverview AI agent that acts as a writing coach for a student's essay.
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
    reviewTitle: z.string().describe("A positive and encouraging title for the feedback, like 'Great Start!' or 'Excellent Ideas Here!'"),
    whatIsWorkingWell: z.string().describe("Specific, positive feedback on the essay's strengths. Focus on what the student is doing right, such as their voice, a specific sentence, or a strong idea."),
    ideasForNextDraft: z.string().describe("Constructive, actionable suggestions for improvement, phrased as questions or ideas to explore. Avoid giving scores or grades. Frame it as a collaborative process."),
    concludingThought: z.string().describe("A brief, encouraging closing statement to motivate the student for their revision."),
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
  prompt: `You are an expert writing coach and mentor, not a grader. Your task is to provide supportive, constructive, and encouraging feedback on a student's essay. Your tone should be that of a helpful guide who wants to help the writer find their own voice and improve their work. Never use scores, grades, or numerical ratings.

  The student is writing in response to the following prompt:
  "{{{prompt}}}"

  Here is the student's essay:
  "{{{essay}}}"

  Please provide feedback in the following structure:
  1.  **reviewTitle**: Give the feedback a positive and encouraging title.
  2.  **whatIsWorkingWell**: Start by highlighting specific strengths. Be genuine. Find something positive to say about their ideas, their voice, or a particular phrase they used. This builds confidence.
  3.  **ideasForNextDraft**: Frame your suggestions as questions or collaborative ideas. Instead of saying "Your intro is weak," try "For your next draft, what if you started with the powerful story you mention in the third paragraph? How might that grab the reader's attention?" Focus on one or two key areas for improvement, rather than overwhelming the student.
  4.  **concludingThought**: End with a brief, motivating statement that inspires them to continue working on their essay.

  Your response must be in the specified JSON format. Be a coach, not a critic.
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
