
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


export async function validateSchoolName(input: SchoolValidationInput): Promise<SchoolValidationOutput> {
  // Using OpenStreetMap Nominatim API - requires a descriptive User-Agent
  // See: https://nominatim.org/release-docs/latest/api/Search/#other
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(input.query)}&format=json&featuretype=school&limit=10`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AISchoolMentor/1.0 (student-success-platform; mail@example.com)',
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim API failed with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Filter results to only include schools, universities, and colleges as a secondary check
    const filteredData = data.filter((item: any) => 
        item.type === 'school' || item.type === 'university' || item.type === 'college'
    );

    const schools = filteredData.map((item: any) => ({
      place_id: item.place_id,
      display_name: item.display_name,
    }));
    
    return { schools };

  } catch (error) {
    console.error("Failed to fetch from Nominatim API", error);
    // Return empty array on error
    return { schools: [] };
  }
}
