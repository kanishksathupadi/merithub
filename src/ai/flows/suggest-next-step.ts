'use server';

/**
 * @fileOverview AI agent that suggests the next step for a student based on their onboarding questionnaire.
 *
 * - suggestNextStep - A function that suggests the next step for a student.
 * - SuggestNextStepInput - The input type for the suggestNextStep function.
 * - SuggestNextStepOutput - The return type for the suggestNextStep function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { validateAcademicSubject } from '../tools/validate-academic-subject';

const SuggestNextStepInputSchema = z.object({
  academicStrengths: z.string().describe('The academic strengths of the student.'),
  academicWeaknesses: z.string().describe('The academic weaknesses of the student.'),
  subjectsOfInterest: z.string().describe('Subjects and topics the student is passionate about.'),
  collegeEnvironment: z.string().describe('The type of college learning environment the student prefers.'),
  preferredLearningStyle: z.string().describe('The preferred learning style of the student.'),
  currentExtracurriculars: z.string().describe('The current extracurricular activities of the student.'),
  weeklyTimeAvailable: z.string().describe('The weekly time available for self-improvement in hours.'),
});
export type SuggestNextStepInput = z.infer<typeof SuggestNextStepInputSchema>;

const SuggestNextStepOutputSchema = z.object({
  nextStep: z.string().describe('The next step for the student to focus on.'),
  reasoning: z.string().describe('The reasoning behind the suggested next step.'),
});
export type SuggestNextStepOutput = z.infer<typeof SuggestNextStepOutputSchema>;

export async function suggestNextStep(input: SuggestNextStepInput): Promise<SuggestNextStepOutput> {
  return suggestNextStepFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNextStepPrompt',
  input: {schema: SuggestNextStepInputSchema},
  output: {schema: SuggestNextStepOutputSchema},
  tools: [validateAcademicSubject],
  prompt: `You are an AI assistant designed to provide personalized guidance to students aged 10-18 to help them discover their passions and succeed academically and in their extracurricular pursuits.

  Before providing a suggestion, you must validate that the provided academic strengths and weaknesses are real subjects or skills using the 'validateAcademicSubject' tool.

  Based on the student's input, provide a single, actionable "next step" that they can take to explore their interests and improve their chances of getting into top colleges and achieving their personal goals. The student may not know what they want to do, so focus on exploration and skill-building.

  Consider the following information about the student:
  - Academic Strengths: {{{academicStrengths}}}
  - Academic Weaknesses: {{{academicWeaknesses}}}
  - Subjects of Interest: {{{subjectsOfInterest}}}
  - Preferred College Environment: {{{collegeEnvironment}}}
  - Preferred Learning Style: {{{preferredLearningStyle}}}
  - Current Extracurriculars: {{{currentExtracurriculars}}}
  - Weekly Time Available: {{{weeklyTimeAvailable}}} hours

  Respond with an action that is appropriate, given the time available, and their grade level, that helps them explore their interests and build a strong profile for the future.
  In addition to the next step, briefly explain the reasoning behind this suggestion.
  `,
});

const suggestNextStepFlow = ai.defineFlow(
  {
    name: 'suggestNextStepFlow',
    inputSchema: SuggestNextStepInputSchema,
    outputSchema: SuggestNextStepOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
