'use server';

/**
 * @fileoverview An AI agent that validates a school name by searching OpenStreetMap.
 *
 * - validateSchoolName - A function that searches for and validates a school name.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SchoolValidationInputSchema = z.object({
  query: z.string().describe('The name of the school to search for.'),
});
export type SchoolValidationInput = z.infer<typeof SchoolValidationInputSchema>;

const SchoolSchema = z.object({
    place_id: z.number(),
    display_name: z.string(),
});

const SchoolValidationOutputSchema = z.object({
  schools: z.array(SchoolSchema).describe('A list of matching schools found.'),
});
export type SchoolValidationOutput = z.infer<typeof SchoolValidationOutputSchema>;


const searchQueriesSchema = z.object({
    queries: z.array(z.string()).describe("A list of 3-5 corrected and expanded search queries."),
});

// This is the new AI-powered flow
export async function validateSchoolName(input: SchoolValidationInput): Promise<SchoolValidationOutput> {
  if (input.query.trim().length < 3) {
    return { schools: [] };
  }

  // 1. Use an LLM to expand the user's query
  const expansionPrompt = `You are a search query expansion expert. A user is searching for a school. Take their raw query, correct any spelling mistakes, and generate a list of 3-5 likely, more specific search queries. For example, if the user types "thmas russle", you should generate queries like ["Thomas Russell Middle School", "Thomas Russell School"]. If they type "washingtn high", generate ["Washington High School"]. Include common terms like "School", "High School", "Academy", "University", "College".

  User query: "${input.query}"
  
  Return a JSON object with a "queries" array.`;

  const llmResponse = await ai.generate({
      prompt: expansionPrompt,
      model: 'googleai/gemini-1.5-flash-latest',
      output: {
          schema: searchQueriesSchema,
      }
  });
  
  const searchQueries = llmResponse.output?.queries || [input.query];
  
  // 2. Search for all expanded queries in parallel
  const searchPromises = searchQueries.map(query => 
      fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&featuretype=school&limit=10`, {
          headers: {
              'User-Agent': 'AISchoolMentor/1.0 (student-success-platform; mail@example.com)',
          },
      })
  );
  
  try {
    const responses = await Promise.all(searchPromises);
    const results = await Promise.all(responses.map(res => {
        if (!res.ok) {
            console.error(`Nominatim API failed with status: ${res.status} for one of the queries.`);
            return []; // Return empty for a failed request
        }
        return res.json();
    }));

    const allSchools = results.flat();

    // 3. Filter, deduplicate, and format the results
    const uniqueSchools = new Map<number, { place_id: number; display_name: string; }>();
    allSchools
        .filter((item: any) => 
            item.type === 'school' || item.type === 'university' || item.type === 'college'
        )
        .forEach((item: any) => {
            if (!uniqueSchools.has(item.place_id)) {
                uniqueSchools.set(item.place_id, {
                    place_id: item.place_id,
                    display_name: item.display_name,
                });
            }
        });
        
    return { schools: Array.from(uniqueSchools.values()) };

  } catch (error) {
    console.error("Failed to fetch from Nominatim API", error);
    return { schools: [] };
  }
}
