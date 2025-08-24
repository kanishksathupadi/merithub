
'use server';

/**
 * @fileOverview AI agent that updates a student's strategic plan based on new input.
 *
 * - updateStudentPlan - A function that refines an existing plan.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { RoadmapTask } from '@/lib/types';
import { findOnlineResource } from '../tools/find-online-resource';

const RoadmapTaskSchema = z.object({
    id: z.string(),
    title: z.string().describe("A concise, action-oriented title for the task (e.g., 'Master Quadratic Equations')."),
    description: z.string().describe("A brief, one-sentence description of what the task entails and why it's important."),
    category: z.enum(['Academics', 'Extracurriculars', 'Skill Building']),
    grade: z.string(),
    completed: z.boolean(),
    relatedResources: z.array(z.object({
        title: z.string(),
        url: z.string().url(),
    })).optional(),
    points: z.number().optional(),
    dueDate: z.string().optional(),
});


const UpdateStudentPlanInputSchema = z.object({
  existingPlan: z.array(RoadmapTaskSchema).describe("The student's current list of roadmap tasks."),
  checkInText: z.string().describe("The new information or update provided by the student during their check-in."),
});
export type UpdateStudentPlanInput = z.infer<typeof UpdateStudentPlanInputSchema>;

const UpdateStudentPlanOutputSchema = z.object({
  updatedPlan: z.array(RoadmapTaskSchema).describe("The updated list of roadmap tasks, incorporating the student's new input."),
});
export type UpdateStudentPlanOutput = z.infer<typeof UpdateStudentPlanOutputSchema>;


export async function updateStudentPlan(input: UpdateStudentPlanInput): Promise<UpdateStudentPlanOutput> {
  return updateStudentPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'updateStudentPlanPrompt',
  input: {schema: UpdateStudentPlanInputSchema},
  output: {schema: UpdateStudentPlanOutputSchema},
  tools: [findOnlineResource],
  model: 'googleai/gemini-2.0-flash',
  prompt: `You are an AI educational advisor. Your task is to intelligently update a student's existing roadmap based on new information they have provided in a "check-in."

  **Core Principle: Evolve, Don't Replace.**
  Do not discard the existing plan. Instead, analyze the student's check-in and refine the plan in the following ways:
  1.  **Modify Existing Tasks:** If the check-in provides relevant new detail, update the title or description of an existing task to be more specific. For example, if a task is "Explore coding" and the user says "I'm loving Python," you could change the task to "Complete a beginner Python project."
  2.  **Add New Tasks:** If the check-in introduces a completely new interest or goal, add 1-2 new, highly specific, and actionable tasks to the appropriate category (Academics, Extracurriculars, or Skill Building).
  3.  **Find New Resources:** If you add a new academic or skill-building task, you MUST use the 'findOnlineResource' tool to find a relevant, high-quality online resource for that task.
  4.  **Preserve Progress:** Do NOT change the 'completed' status or 'id' of any existing task. Carry over all original tasks, modifying them only if necessary. The final output must be a complete list of all tasks (original, modified, and new).

  **Student's Existing Roadmap:**
  \`\`\`json
  {{{existingPlanJson}}}
  \`\`\`

  **Student's New Check-In:**
  "{{{checkInText}}}"

  Based on the check-in, update the provided roadmap. Your response must be a perfectly structured JSON object containing the complete, updated list of all roadmap tasks.
  `,
});

const updateStudentPlanFlow = ai.defineFlow(
  {
    name: 'updateStudentPlanFlow',
    inputSchema: UpdateStudentPlanInputSchema,
    outputSchema: UpdateStudentPlanOutputSchema,
  },
  async (input) => {
    // Convert the plan object to a JSON string before passing it to the prompt.
    const existingPlanJson = JSON.stringify(input.existingPlan, null, 2);

    const {output} = await prompt({
      ...input,
      existingPlanJson, // Pass the JSON string to the prompt
    });

    if (!output) {
        throw new Error("Failed to update the student plan.");
    }
    return output;
  }
);
