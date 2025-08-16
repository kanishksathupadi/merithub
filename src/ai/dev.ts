import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-next-step.ts';
import '@/ai/flows/find-study-resource.ts';
import '@/ai/tools/validate-academic-subject.ts';
