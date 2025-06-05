
'use server';
/**
 * @fileOverview Flow for fetching simulated rainfall data for a location.
 *
 * - fetchRainfallForLocation - Function to trigger the rainfall data fetching flow.
 * - FetchRainfallInput - Input type for fetchRainfallForLocation.
 * - FetchRainfallOutput - Output type for fetchRainfallForLocation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
// Import the async function and its TypeScript types from the tool file
import { getRainfallForLocationTool, type GetRainfallInput, type GetRainfallOutput } from '@/ai/tools/weather-tool';

// Define Zod schemas locally for this flow (not exported)
const FetchRainfallInputSchema = z.object({
  location: z.string().describe('The location (e.g., city name) to fetch rainfall data for.'),
  date: z.string().describe('The ISO date string for which to fetch rainfall data (e.g., "2023-10-26T00:00:00.000Z").'),
});
export type FetchRainfallInput = z.infer<typeof FetchRainfallInputSchema>;

const FetchRainfallOutputSchema = z.object({
  amount: z.number().describe('The rainfall amount in mm.'),
});
export type FetchRainfallOutput = z.infer<typeof FetchRainfallOutputSchema>;

export async function fetchRainfallForLocation(input: FetchRainfallInput): Promise<FetchRainfallOutput> {
  // Ensure the input to the flow matches the input type for the tool
  const toolInput: GetRainfallInput = {
    location: input.location,
    date: input.date,
  };
  return fetchRainfallFlow(toolInput);
}

const fetchRainfallFlow = ai.defineFlow(
  {
    name: 'fetchRainfallFlow',
    inputSchema: FetchRainfallInputSchema, 
    outputSchema: FetchRainfallOutputSchema, 
    description: 'Fetches rainfall data for a specific location and date by calling the getRainfallForLocationTool.',
  },
  async (flowInput: GetRainfallInput): Promise<GetRainfallOutput> => { 
    try {
      const result: GetRainfallOutput = await getRainfallForLocationTool(flowInput);
      return result;
    } catch (error) {
      console.error("Error calling getRainfallForLocationTool within fetchRainfallFlow:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch rainfall data: ${error.message}`);
      }
      throw new Error("An unknown error occurred while fetching rainfall data.");
    }
  }
);

