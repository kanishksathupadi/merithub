
// This file is used to load all the Genkit flows and tools for local development.
// It is run by the `genkit:dev` and `genkit:watch` scripts in package.json.

import '@/ai/flows/suggest-next-step.ts';
import '@/ai/flows/find-study-resource.ts';
import '@/ai/flows/generate-avatar.ts';
import '@/ai/flows/generate-study-guide.ts';
import '@/ai/flows/moderate-post.ts';
import '@/ai/flows/review-essay.ts';
import '@/ai/flows/find-matching-colleges.ts';
import '@/aiflows/find-scholarships.ts';
import '@/ai/flows/generate-college-image.ts';
import '@/ai/flows/update-student-plan.ts';
import '@/ai/flows/get-strategic-briefing.ts';
import '@/ai/flows/validate-school-name.ts';
import '@/ai/flows/support-chat.ts';
import '@/ai/flows/validate-contact-message.ts';
import '@/ai/flows/validate-job-application.ts';
import '@/ai/flows/send-welcome-email.ts';
import '@/ai/flows/get-global-stats.ts';
import '@/ai/tools/find-online-resource.ts';
import '@/ai/tools/validate-avatar-image.ts';
import '@/ai/tools/validate-resource-url.ts';
