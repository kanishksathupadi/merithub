
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
  prompt: `You are an expert educator and academic tutor. A student has asked for help understanding a topic.

  Topic: "{{{topic}}}"

  Your task is to generate a comprehensive, easy-to-understand study guide for this topic. The response must be structured to facilitate learning and retention.

  The response must include:
  1.  The original topic provided by the user.
  2.  A clear title for the study guide.
  3.  A brief introductory paragraph that sets the context for the topic.
  4.  A list of exactly {{{numConcepts}}} 'Key Concepts' that act like flashcards. Each concept must have a term and its corresponding definition. If numConcepts is 0, return an empty array.
  5.  A list of exactly {{{numQuestions}}} multiple-choice 'Practice Questions'. Each question must have:
      - A question text.
      - An array of exactly 4 'options'.
      - The correct 'answer', which MUST be one of the provided options.
      If numQuestions is 0, return an empty array.

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
