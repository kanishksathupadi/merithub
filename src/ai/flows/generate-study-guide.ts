
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
});
export type GenerateStudyGuideInput = z.infer<typeof GenerateStudyGuideInputSchema>;

const GenerateStudyGuideOutputSchema = z.object({
    title: z.string().describe("A concise, relevant title for the study guide."),
    introduction: z.string().describe("A brief, one-paragraph overview of the topic."),
    keyConcepts: z.array(z.object({
        concept: z.string().describe("The name of the key concept, term, or event."),
        definition: z.string().describe("A clear and concise definition or explanation of the concept."),
    })).describe("A list of the most important concepts and their definitions, like flashcards."),
    practiceQuestions: z.array(z.object({
        question: z.string().describe("A practice question to test understanding."),
        answer: z.string().describe("The correct answer to the practice question."),
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

  Your task is to generate a comprehensive, easy-to-understand study guide for this topic. The guide should be structured to facilitate learning and retention.

  The response must include:
  1.  A clear title for the study guide.
  2.  A brief introductory paragraph that sets the context for the topic.
  3.  A list of "Key Concepts" that act like flashcards. Each concept should have a term and its corresponding definition.
  4.  A list of "Practice Questions" with their correct answers to allow the student to self-assess their understanding.

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
    return output!;
  }
);

    