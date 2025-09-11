
'use server';

/**
 * @fileOverview An AI agent that moderates user-generated content.
 *
 * - moderatePost - A function that checks if a post is appropriate.
 * - ModeratePostInput - The input type for the moderatePost function.
 * - ModeratePostOutput - The return type for the moderatePost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModeratePostInputSchema = z.object({
  title: z.string().describe('The title of the forum post.'),
  content: z.string().describe('The content of the forum post.'),
});
export type ModeratePostInput = z.infer<typeof ModeratePostInputSchema>;

const ModeratePostOutputSchema = z.object({
    isAppropriate: z.boolean().describe("Whether the post is appropriate for a student forum."),
    reasoning: z.string().describe("A brief, user-facing explanation if the post is deemed inappropriate. This will be shown to the user."),
});
export type ModeratePostOutput = z.infer<typeof ModeratePostOutputSchema>;

export async function moderatePost(input: ModeratePostInput): Promise<ModeratePostOutput> {
  return moderatePostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moderatePostPrompt',
  input: {schema: ModeratePostInputSchema},
  output: {schema: ModeratePostOutputSchema},
  model: 'googleai/gemini-2.0-flash',
  prompt: `You are a content moderator for a Q&A forum designed for ambitious students (ages 7-18) focused on academic and extracurricular success. Your job is to ensure the environment is safe, supportive, and on-topic.

  Analyze the following post to determine if it is appropriate.

  A post is INAPPROPRIATE if it contains:
  - Bullying, harassment, hate speech, or personal attacks.
  - Profanity or sexually explicit content.
  - Discussion of illegal activities, self-harm, or dangerous behavior.
  - Spam, advertisements, or irrelevant content not related to education, college prep, or self-improvement.
  - Sharing of private personal information.

  A post is APPROPRIATE if it is a genuine question or discussion related to school subjects, test prep (SAT, AP), college applications, extracurriculars, career exploration, or personal development.

  Post Title: "{{{title}}}"
  Post Content: "{{{content}}}"

  Based on your analysis, set 'isAppropriate' to true or false. If it is inappropriate, provide a concise, polite, and clear 'reasoning' that can be shown to the user explaining why their post cannot be published.
  `,
});

const moderatePostFlow = ai.defineFlow(
  {
    name: 'moderatePostFlow',
    inputSchema: ModeratePostInputSchema,
    outputSchema: ModeratePostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
