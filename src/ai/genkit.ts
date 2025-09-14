
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// This configuration allows Genkit to automatically use the GEMINI_API_KEY 
// from your environment variables (.env.local for local development).
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
