
import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-next-step.ts';
import '@/ai/flows/find-study-resource.ts';
import '@/ai/flows/generate-avatar.ts';
import '@/ai/flows/generate-study-guide.ts';
import '@/ai/tools/validate-academic-subject.ts';
import '@/ai/tools/find-online-resource.ts';

    