
import {genkit, configureGenkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {firebase} from '@genkit-ai/firebase';
import { defineSecret } from 'genkit/secrets';

// Define the secret for the Gemini API key
defineSecret('GEMINI_API_KEY');

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
