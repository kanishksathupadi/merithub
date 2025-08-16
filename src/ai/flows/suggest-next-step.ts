
'use server';

/**
 * @fileOverview AI agent that suggests a long-term strategic plan for a student based on their onboarding questionnaire.
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
  grade: z.coerce.number().describe('The current grade level of the student (5-12).'),
});
export type SuggestNextStepInput = z.infer<typeof SuggestNextStepInputSchema>;

const SuggestNextStepOutputSchema = z.object({
  title: z.string().describe("A concise, inspirational title for the student's strategic plan (e.g., 'The Innovator's Path to STEM Excellence')."),
  introduction: z.string().describe('A brief, encouraging introductory paragraph explaining the logic behind the plan.'),
  plan: z.array(z.object({
    grade: z.string().describe('The grade level for this part of the plan (e.g., "9th Grade", "10th Grade").'),
    focus: z.string().describe('The main theme or focus for that grade level.'),
    academics: z.array(z.string()).describe('A list of specific, actionable academic goals and courses to take. Each item should be a clear task, like "Master Advanced Trigonometry: Complete the trigonometry module on Khan Academy."'),
    extracurriculars: z.array(z.string()).describe('A list of specific, actionable extracurricular activities to pursue or continue. Each item should be a clear task, like "Join the Debate Team: Attend the first informational meeting and sign up."'),
    skillBuilding: z.array(z.string()).describe('A list of specific, actionable skills to develop. Each item should be a clear task, like "Learn Python Basics: Complete the first 5 lessons on Codecademy."'),
  })).describe('A year-by-year plan from the student\'s current grade through 12th grade.'),
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
  prompt: `You are an AI assistant designed to provide a comprehensive, long-term strategic plan for students aged 10-18 to help them discover their passions and succeed academically and in their extracurricular pursuits, ultimately preparing them for college admissions.

  Before providing a suggestion, you must validate that the provided academic strengths and weaknesses are real subjects or skills using the 'validateAcademicSubject' tool.

  Based on the student's input, provide a clear, year-by-year plan from their current grade level through 12th grade. The plan should be actionable, inspiring, and broken down into concrete goals for each year. For each year, provide a list of specific and actionable tasks for Academics, Extracurriculars, and Skill Building. Each task should be a string in the format "Task Title: Brief description of the task."

  Consider the following information about the student:
  - Current Grade: {{{grade}}}
  - Academic Strengths: {{{academicStrengths}}}
  - Academic Weaknesses: {{{academicWeaknesses}}}
  - Subjects of Interest: {{{subjectsOfInterest}}}
  - Preferred College Environment: {{{collegeEnvironment}}}
  - Preferred Learning Style: {{{preferredLearningStyle}}}
  - Current Extracurriculars: {{{currentExtracurriculars}}}
  - Weekly Time Available: {{{weeklyTimeAvailable}}} hours

  Your response must be structured as a JSON object with a title, an introduction, and an array of plans for each grade level. Each grade-level plan should include:
  - The main focus for that year.
  - A list of actionable tasks for Academics.
  - A list of actionable tasks for Extracurriculars.
  - A list of actionable tasks for Skill Building.

  The plan should feel like a complete, all-in-one roadmap that guides the student on exactly what to do. Be specific and encouraging.
  
  All responses must be in English.
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
