
'use server';

/**
 * @fileOverview An AI agent that provides contextual support chat for students.
 *
 * - supportChat - A function that acts as a student's personal AI advisor.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { RoadmapTask, OnboardingData } from '@/lib/types';

// Define the structure for a single chat message
const ChatMessageSchema = z.object({
    role: z.enum(['user', 'model', 'human']),
    content: z.string(),
});

const SupportChatInputSchema = z.object({
  studentProfile: z.object({
      name: z.string(),
      grade: z.coerce.number(),
      onboardingData: z.custom<OnboardingData>(),
  }).describe("The student's profile information."),
  roadmap: z.array(z.custom<RoadmapTask>()).describe("The student's full list of roadmap tasks, both completed and incomplete."),
  chatHistory: z.array(ChatMessageSchema).describe("The history of the conversation so far."),
});

const PromptInputSchema = SupportChatInputSchema.extend({
    onboardingDataJson: z.string(),
    roadmapJson: z.string(),
});


export type SupportChatInput = z.infer<typeof SupportChatInputSchema>;

const SupportChatOutputSchema = z.object({
    response: z.string().describe("The AI's helpful and supportive response to the student."),
    escalationRequired: z.boolean().describe("Set to true if the AI determines the user needs to speak to a human based on the severity or complexity of their query."),
});
export type SupportChatOutput = z.infer<typeof SupportChatOutputSchema>;


export async function supportChat(input: SupportChatInput): Promise<SupportChatOutput> {
  return supportChatFlow(input);
}


const prompt = ai.definePrompt({
  name: 'supportChatPrompt',
  input: {schema: PromptInputSchema},
  output: {schema: SupportChatOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are PinnacleBot, an expert AI academic advisor and mentor for the PinnaclePath platform. Your tone is encouraging, supportive, and knowledgeable. You are talking directly to a student.

  Your primary goal is to provide helpful, specific, and actionable advice based on the student's unique profile, their long-term roadmap, and the current conversation. You have access to their complete plan and profile. Use this context to make your answers deeply personal and relevant.

  **Core Instructions:**
  1.  **Analyze the Full Context**: Before answering, review the student's profile, their entire roadmap (both completed and incomplete tasks), and the recent chat history. Note that messages from role 'human' are from a human mentor.
  2.  **Be a Guide**: Your role is to guide, not just answer. If a student asks "What should I do next?", don't just pick a random task. Look at their incomplete tasks, their goals from onboarding, and suggest a logical next step from their existing plan, explaining *why* it's a good idea. Reference specific task titles from their roadmap.
  3.  **Reference the App**: Refer to features in the PinnaclePath app. For example, if they're worried about a test, you can say, "Have you tried using the 'AI Study Buddy' feature to generate some flashcards for that topic?"
  4.  **Escalation Protocol**: You MUST identify when a student's query is outside your scope or requires human intervention. Set \`escalationRequired\` to \`true\` if the student expresses:
      - Severe emotional distress, anxiety, or mental health crises.
      - Questions about serious personal situations (family issues, bullying, etc.).
      - Complex ethical dilemmas.
      - Any desire to speak to a person.
      In these cases, your response should be gentle and supportive, like: "It sounds like you're going through a lot right now, and I think it would be best to talk to someone who can help more directly. I recommend reaching out to one of our human mentors." DO NOT try to solve these problems yourself.

  **Student's Profile:**
  - Name: {{{studentProfile.name}}}
  - Grade: {{{studentProfile.grade}}}
  - Onboarding Info: \`\`\`json
    {{{onboardingDataJson}}}
    \`\`\`

  **Student's Full Roadmap:**
  \`\`\`json
  {{{roadmapJson}}}
  \`\`\`

  **Conversation History:**
  {{#each chatHistory}}
  - {{role}}: {{content}}
  {{/each}}

  Based on the latest user message in the history, provide a helpful response and determine if escalation is required.
  `,
});


const supportChatFlow = ai.defineFlow(
  {
    name: 'supportChatFlow',
    inputSchema: SupportChatInputSchema,
    outputSchema: SupportChatOutputSchema,
  },
  async (input) => {
    // If chat history is empty, start with a greeting.
    if (input.chatHistory.length === 0) {
        return {
            response: `Hi ${input.studentProfile.name}! I'm PinnacleBot, your personal AI advisor. How can I help you today? You can ask me about your roadmap, college prep, or anything else on your mind.`,
            escalationRequired: false,
        };
    }

    const onboardingDataJson = JSON.stringify(input.studentProfile.onboardingData, null, 2);
    const roadmapJson = JSON.stringify(input.roadmap, null, 2);

    const {output} = await prompt({
        ...input,
        onboardingDataJson,
        roadmapJson,
    });

    if (!output) {
        throw new Error("Failed to generate a chat response.");
    }
    return output;
  }
);
