
'use server';

/**
 * @fileOverview AI agent that generates a study guide for a given topic.
 *
 * - generateStudyGuide - A function that generates a study guide.
 * - GenerateStudyGuideInput - The input type for the generateStudyGuide function.
 * - GenerateStudyGuideOutput - The return type for the generateStudyGuide function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyGuideInputSchema = z.object({
  topic: z.string().describe('The academic topic the user needs a study guide for.'),
  numConcepts: z.coerce.number().min(0).max(100).describe('The number of key concepts to generate for flashcards.'),
  numQuestions: z.coerce.number().min(0).max(100).describe('The number of practice questions to generate.'),
});
export type GenerateStudyGuideInput = z.infer<typeof GenerateStudyGuideInputSchema>;

const GenerateStudyGuideOutputSchema = z.object({
    topic: z.string().describe("The topic of the study guide."),
    title: z.string().describe("A concise, relevant title for the study guide."),
    introduction: z.string().describe("A brief, one-paragraph overview of the topic."),
    keyConcepts: z.array(z.object({
        concept: z.string().describe("The name of the key concept, term, or event."),
        definition: z.string().describe("A clear and concise definition or explanation of the concept."),
    })).describe("A list of the most important concepts and their definitions, like flashcards."),
    practiceQuestions: z.array(z.object({
        question: z.string().describe("A practice question to test understanding."),
        options: z.array(z.string()).describe("A list of 4 multiple-choice options."),
        answer: z.string().describe("The correct answer from the options list."),
    })).describe("A set of practice questions to help the user test their knowledge."),
});
export type GenerateStudyGuideOutput = z.infer<typeof GenerateStudyGuideOutputSchema>;

export async function generateStudyGuide(input: GenerateStudyGuideInput): Promise<GenerateStudyGuideOutput> {
  return generateStudyGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyGuidePrompt',
  input: {schema: GenerateStudyGuideInputSchema},
  output: {schema: GenerateStudyGuideOutputSchema},
  model: 'googleai/gemini-2.0-flash',
  prompt: `You are an expert educator and academic tutor. Your task is to generate a structured study guide for the given topic.

  Topic: "{{{topic}}}"

  You must adhere to the following output structure precisely:
  1.  **Topic**: The original topic provided by the user.
  2.  **Title**: A clear title for the study guide.
  3.  **Introduction**: A brief, one-paragraph overview of the topic.
  4.  **Key Concepts**: Generate *exactly* {{{numConcepts}}} key concepts. Do not generate more or less. If 'numConcepts' is 0, this must be an empty array.
  5.  **Practice Questions**: Generate *exactly* {{{numQuestions}}} multiple-choice practice questions. Do not generate more or less. If 'numQuestions' is 0, this must be an empty array. Each question must contain:
      - A question text.
      - An array of exactly 4 'options'.
      - The correct 'answer', which MUST be one of the provided options.

  Ensure the content is accurate, well-structured, and tailored for a high school or early college-level student.
  `,
});

const generateStudyGuideFlow = ai.defineFlow(
  {
    name: 'generateStudyGuideFlow',
    inputSchema: GenerateStudyGuideInputSchema,
    outputSchema: GenerateStudyGuideOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (output) {
      // Ensure the topic is included in the final output
      return { ...output, topic: input.topic };
    }
    throw new Error("Failed to generate study guide.");
  }
);
