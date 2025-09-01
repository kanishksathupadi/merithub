
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
  grade: z.coerce.number().describe('The current grade level of the student (K-12, where K is 0).'),
});
export type SuggestNextStepInput = z.infer<typeof SuggestNextStepInputSchema>;

const ResourceSchema = z.object({
    title: z.string().describe('The title of the recommended online resource.'),
    url: z.string().url().describe('The valid URL for the resource.'),
});

const AcademicsAndSkillsTaskSchema = z.object({
    title: z.string().describe("A concise, action-oriented title for the task (e.g., 'Master Quadratic Equations')."),
    description: z.string().describe("A brief, one-sentence description of what the task entails and why it's important for their long-term growth."),
    resource: ResourceSchema.describe('An online resource to help with the task. This is REQUIRED for Academics and Skill Building tasks.'),
});

const ExtracurricularsTaskSchema = z.object({
    title: z.string().describe("A concise, action-oriented title for the task (e.g., 'Run for Treasurer in Student Government')."),
    description: z.string().describe("A brief, one-sentence description of what the task entails and why it's important for their long-term growth."),
    resource: ResourceSchema.optional().describe('An optional online resource to help with the task. If provided, the URL must be valid.'),
});


const PlanSchema = z.object({
    grade: z.string().describe('The grade level for this part of the plan (e.g., "9th Grade", "10th Grade").'),
    focus: z.string().describe('The main theme or focus for that grade level (e.g., "Building Foundational Skills," "Exploring Leadership Opportunities").'),
    academics: z.array(AcademicsAndSkillsTaskSchema).describe('A list of specific, actionable academic goals. DO NOT create vague tasks like "Improve Math Grades." Focus on mastering specific concepts derived from their weaknesses.'),
    extracurriculars: z.array(ExtracurricularsTaskSchema).describe("A list of specific, actionable extracurricular activities. Instead of just listing an activity, suggest a concrete action within it (e.g., 'Launch a coding club blog')."),
    skillBuilding: z.array(AcademicsAndSkillsTaskSchema).describe("A list of specific, actionable skills to develop that connect their interests to future opportunities (e.g., 'Complete a Python for Beginners course to explore your interest in robotics')."),
});


const SuggestNextStepOutputSchema = z.object({
  title: z.string().describe("A concise, inspirational title for the student's strategic plan (e.g., 'The Innovator's Path to STEM Excellence')."),
  introduction: z.string().describe('A brief, encouraging introductory paragraph explaining the logic behind the plan, highlighting how it builds on their passions.'),
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
  prompt: `You are an AI assistant and expert educational advisor designed to provide a comprehensive, hyper-specific, and actionable long-term plan for students. Your tone is that of an encouraging and insightful coach. You are an all-in-one mentor.

  **Core Principle: Be an Expansive Guide, Not a Mirror.**
  Your role is to broaden the student's horizons. An interest like 'chess' isn't just about chess; it suggests a mind for strategy, logic, and patience. Connect this to diverse fields like computer science, economics, or even debate. Help the student discover new possibilities based on the underlying traits their interests suggest. Create a plan that is inspiring and expansive.

  **Secret Knowledge: Proactive Mentorship**
  You must weave advanced, "insider" advice into the plan at the appropriate grade level. Do not just list these as tips; embed them as actionable tasks within the plan. Key concepts include:
  - **The 'Hook' or 'Spike'**: The idea of developing a deep, impressive, and unique talent or story that makes an applicant stand out. Instead of being "well-rounded," they should be "pointy." You should create tasks that encourage developing a spike (e.g., "Launch a regional coding competition" instead of just "Join coding club").
  - **Essay Strategy**: Tasks should not be "Write your essay." They should be "Brainstorm three potential 'hook' stories for your Common App essay" or "Master the 'Show, Don't Tell' narrative technique for your personal statement."
  - **Strategic Extracurriculars**: Frame extracurricular tasks around impact and leadership, not just participation. "Become treasurer of the debate team and manage its budget" is better than "Participate in debate."

  **Core Instructions:**
  1.  **Age-Specific Advice**: Tailor the plan based on the student's grade. Younger students (grades K-8) should have plans focused on exploration and curiosity. Older students (grades 9-12) should have plans that become progressively more focused on college prep, leadership, and developing their "spike."
  2.  **No Vague Tasks:** Do NOT create vague tasks like "Improve your grades" or "Study for the SAT." Every task must be a concrete, measurable action.
  3.  **Action-Oriented Titles:** All task titles must start with an action verb (e.g., "Master," "Complete," "Build," "Publish," "Lead").
  4.  **Mandatory and Validated Resources:** For EVERY task in the 'academics' and 'skillBuilding' categories, you MUST use the 'findOnlineResource' tool to find a relevant, high-quality online article, video, or course.
  5.  **Optional but Validated Resources:** For 'extracurriculars' tasks, a resource is optional. However, IF YOU PROVIDE one, you MUST use the 'findOnlineResource' tool to ensure it is valid.
  6.  **Target Weaknesses Constructively:** Frame academic tasks as skill-building opportunities, not just fixing deficits. If a weakness is 'Physics', create a task like "Master the Concept of Kinematics" and find a resource.
  7.  **Validate Subjects:** You MUST validate that 'academicStrengths' and 'academicWeaknesses' are real subjects using the 'validateAcademicSubject' tool.
  8.  **Year-by-Year Plan:** Provide a clear, year-by-year plan from the student's current grade level through 12th grade.

  **Student Information:**
  - Current Grade: {{{grade}}}
  - Academic Strengths: {{{academicStrengths}}}
  - Academic Weaknesses: {{{academicWeaknesses}}}
  - Subjects of Interest: {{{subjectsOfInterest}}}
  - Preferred College Environment: {{{collegeEnvironment}}}
  - Preferred LearningStyle: {{{preferredLearningStyle}}}
  - Current Extracurriculars: {{{currentExtracurriculars}}}
  - Weekly Time Available: {{{weeklyTimeAvailable}}} hours

  Your response must be a perfectly structured JSON object with a title, an encouraging introduction that explains the philosophy of the plan, and an array of plans. Each grade-level plan must include a focus and lists of hyper-specific tasks for Academics, Extracurriculars, and Skill Building that incorporate your "Secret Knowledge".
  
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
