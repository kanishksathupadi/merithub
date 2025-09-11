
'use server';

/**
 * @fileOverview An AI agent that analyzes a student's plan and provides a high-level strategic briefing.
 *
 * - getStrategicBriefing - A function that returns a strategic briefing.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { RoadmapTask } from '@/lib/types';

const StrategicBriefingInputSchema = z.object({
  plan: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    category: z.string(),
    completed: z.boolean(),
  })).describe("The student's full list of roadmap tasks."),
});

export type StrategicBriefingInput = z.infer<typeof StrategicBriefingInputSchema>;

const StrategicBriefingOutputSchema = z.object({
    bigPicture: z.string().describe("A short, encouraging paragraph (2-3 sentences) explaining the current high-level strategic focus based on the incomplete tasks. For example, 'This month, our focus is on building your leadership skills...'"),
    priorityMission: z.object({
        id: z.string().describe("The ID of the most important, high-impact task from the plan that this mission is linked to."),
        title: z.string().describe("A new, high-level, inspirational title for the overarching mission (e.g., 'Become a Published Author', 'Launch a Community Initiative'). This should be a bigger concept than a single task."),
        description: z.string().describe("A new, one-sentence description that explains what this strategic mission involves."),
    }).describe("A synthesized, high-level 'mission' that represents the student's most important focus. This mission should be linked to the single most critical task from the plan but should be described as a larger goal."),
    mentorInsight: z.string().describe("A brief, powerful piece of 'insider' advice (2-3 sentences) that explains *why* the priority mission is so important. This should connect the task to a core college admission concept like developing a 'spike' or a 'hook'."),
});
export type StrategicBriefingOutput = z.infer<typeof StrategicBriefingOutputSchema>;


export async function getStrategicBriefing(input: StrategicBriefingInput): Promise<StrategicBriefingOutput> {
  return getStrategicBriefingFlow(input);
}


const prompt = ai.definePrompt({
  name: 'getStrategicBriefingPrompt',
  input: {schema: StrategicBriefingInputSchema},
  output: {schema: StrategicBriefingOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are an expert educational strategist and mentor. Your task is to analyze a student's current roadmap and provide a "Strategic Briefing" to guide their focus. Do not just list tasks. Provide insight and context.

  **Core Instructions:**
  1.  **Analyze the Plan:** Review the student's entire list of incomplete tasks to understand the current priorities.
  2.  **Determine the "Big Picture":** Synthesize the main theme from the upcoming tasks. Is the focus on building a new skill, demonstrating leadership, or deepening academic knowledge? Write a short, encouraging paragraph that explains this strategic theme.
  3.  **Synthesize the "Priority Mission":** 
      a. First, identify the SINGLE most important, impactful, and strategic task from the list of incomplete tasks. **This is the most critical step.** Prioritize tasks from the 'Extracurriculars' or 'Skill Building' categories that demonstrate leadership, initiative, or the creation of a tangible project (e.g., 'Launch a club,' 'Publish an article,' 'Build an app'). Do NOT select routine academic tasks like 'Improve Math Grades' or 'Study for AP Test' unless it's part of a larger, unique project. The goal is to find the task that best builds their unique story or "spike."
      b. Second, create a new, high-level, inspirational 'title' and 'description' for a "mission" that this task represents. The mission should be a bigger concept than the task itself. For example, if the task is "Write a short story for the school literary magazine," the mission title could be "Become a Published Author."
      c. Return the ID of the original underlying task, but with the new mission title and description you created.
  4.  **Provide "Mentor's Insight":** Write a brief, powerful piece of advice that explains *why* this Priority Mission is critical. Connect it to an advanced college prep concept. For example, explain how organizing an event demonstrates leadership far better than just attending, or how a research project serves as a "hook" for their application.

  **Student's Current Plan:**
  \`\`\`json
  {{{planJson}}}
  \`\`\`

  Your response must be a perfectly structured JSON object with the 'bigPicture', 'priorityMission', and 'mentorInsight' fields.
  `,
});

const getStrategicBriefingFlow = ai.defineFlow(
  {
    name: 'getStrategicBriefingFlow',
    inputSchema: StrategicBriefingInputSchema,
    outputSchema: StrategicBriefingOutputSchema,
  },
  async (input) => {
    const incompleteTasks = input.plan.filter(task => !task.completed);
    
    if (incompleteTasks.length === 0) {
        return {
            bigPicture: "You've completed all your tasks! This is a great time to either add new custom goals or reflect on your achievements.",
            priorityMission: {
                id: 'completed',
                title: "All Tasks Completed!",
                description: "Congratulations on finishing your current roadmap. You've made outstanding progress."
            },
            mentorInsight: "Consistent effort pays off. Use this momentum to explore new interests or deepen the skills you've already built. This is how a compelling academic and personal story is created."
        };
    }

    const planJson = JSON.stringify(incompleteTasks, null, 2);

    const {output} = await prompt({
      plan: incompleteTasks, // Pass only incomplete tasks to the prompt context for analysis
      planJson, 
    });

    if (!output) {
        throw new Error("Failed to generate strategic briefing.");
    }
    return output;
  }
);
