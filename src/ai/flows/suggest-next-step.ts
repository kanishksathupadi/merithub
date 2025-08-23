
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
import { findOnlineResource } from '../tools/find-online-resource';

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

const ResourceSchema = z.object({
    title: z.string().describe('The title of the recommended online resource.'),
    url: z.string().url().describe('The valid URL for the resource.'),
});

const AcademicsAndSkillsTaskSchema = z.object({
    title: z.string().describe("A concise, action-oriented title for the task (e.g., 'Master Quadratic Equations')."),
    description: z.string().describe("A brief, one-sentence description of what the task entails and why it's important."),
    resource: ResourceSchema.describe('An online resource to help with the task. This is REQUIRED for Academics and Skill Building tasks.'),
});

const ExtracurricularsTaskSchema = z.object({
    title: z.string().describe("A concise, action-oriented title for the task (e.g., 'Run for Treasurer in Student Government')."),
    description: z.string().describe("A brief, one-sentence description of what the task entails and why it's important."),
    resource: ResourceSchema.optional().describe('An optional online resource to help with the task. If provided, the URL must be valid.'),
});


const PlanSchema = z.object({
    grade: z.string().describe('The grade level for this part of the plan (e.g., "9th Grade", "10th Grade").'),
    focus: z.string().describe('The main theme or focus for that grade level (e.g., "Building Foundational Skills").'),
    academics: z.array(AcademicsAndSkillsTaskSchema).describe('A list of specific, actionable academic goals. DO NOT create vague tasks like "Improve Math Grades." Focus on mastering specific concepts from their weaknesses.'),
    extracurriculars: z.array(ExtracurricularsTaskSchema).describe("A list of specific, actionable extracurricular activities. Instead of just listing an activity, suggest a concrete action within it (e.g., 'Run for Treasurer in Student Government')."),
    skillBuilding: z.array(AcademicsAndSkillsTaskSchema).describe("A list of specific, actionable skills to develop (e.g., 'Complete a Python for Beginners course')."),
});


const SuggestNextStepOutputSchema = z.object({
  title: z.string().describe("A concise, inspirational title for the student's strategic plan (e.g., 'The Innovator's Path to STEM Excellence')."),
  introduction: z.string().describe('A brief, encouraging introductory paragraph explaining the logic behind the plan.'),
  plan: z.array(PlanSchema).describe('A year-by-year plan from the student\'s current grade through 12th grade.'),
});
export type SuggestNextStepOutput = z.infer<typeof SuggestNextStepOutputSchema>;

export async function suggestNextStep(input: SuggestNextStepInput): Promise<SuggestNextStepOutput> {
  return suggestNextStepFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNextStepPrompt',
  input: {schema: SuggestNextStepInputSchema},
  output: {schema: SuggestNextStepOutputSchema},
  tools: [validateAcademicSubject, findOnlineResource],
  model: 'googleai/gemini-2.0-flash',
  prompt: `You are an AI assistant and expert educational advisor designed to provide a comprehensive, hyper-specific, and actionable long-term plan for students (ages 10-18) to achieve their goals.

  **Core Principle: Be a Guide, Not a Mirror.**
  Your role is to broaden the student's horizons. An interest like 'chess' isn't just about chess; it suggests a mind for strategy, logic, and patience. Connect this to diverse fields like computer science, economics, or even debate. Do not simply recommend chess-related activities. Help the student discover new possibilities based on the underlying traits their interests suggest. Create a plan that is inspiring and expansive.

  **Core Instructions:**
  1.  **No Vague Tasks:** Do NOT create vague tasks like "Improve your grades" or "Study for the SAT." Every task must be a concrete, measurable action.
  2.  **Action-Oriented Titles:** All task titles must start with an action verb (e.g., "Master," "Complete," "Build," "Publish," "Lead").
  3.  **Mandatory and Validated Resources:** For EVERY task in the 'academics' and 'skillBuilding' categories, you MUST use the 'findOnlineResource' tool to find a relevant, high-quality online article, video, or course. This tool automatically validates that the URL works.
  4.  **Optional but Validated Resources:** For 'extracurriculars' tasks, a resource is optional. However, IF YOU PROVIDE a resource, you MUST use the 'findOnlineResource' tool to ensure it is a valid, working link. Do not provide a resource if you cannot find a valid one.
  5.  **Target Weaknesses:** For academic tasks, directly address the student's 'academicWeaknesses'. If a weakness is 'Physics', create a task like "Master the concept of Kinematics" and find a resource for it.
  6.  **Validate Subjects:** Before creating a plan, you MUST validate that the provided 'academicStrengths' and 'academicWeaknesses' are real subjects or skills using the 'validateAcademicSubject' tool.
  7.  **Year-by-Year Plan:** Provide a clear, year-by-year plan from the student's current grade level through 12th grade.

  **Student Information:**
  - Current Grade: {{{grade}}}
  - Academic Strengths: {{{academicStrengths}}}
  - Academic Weaknesses: {{{academicWeaknesses}}}
  - Subjects of Interest: {{{subjectsOfInterest}}}
  - Preferred College Environment: {{{collegeEnvironment}}}
  - Preferred LearningStyle: {{{preferredLearningStyle}}}
  - Current Extracurriculars: {{{currentExtracurriculars}}}
  - Weekly Time Available: {{{weeklyTimeAvailable}}} hours

  Your response must be a perfectly structured JSON object with a title, an introduction, and an array of plans. Each grade-level plan must include a focus and lists of hyper-specific tasks for Academics, Extracurriculars, and Skill Building.
  
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
