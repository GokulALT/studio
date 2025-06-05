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
import { getRainfallForLocationTool, GetRainfallInputSchema, GetRainfallOutputSchema } from '@/ai/tools/weather-tool';

export const FetchRainfallInputSchema = GetRainfallInputSchema;
export type FetchRainfallInput = z.infer<typeof FetchRainfallInputSchema>;

export const FetchRainfallOutputSchema = GetRainfallOutputSchema;
export type FetchRainfallOutput = z.infer<typeof FetchRainfallOutputSchema>;

export async function fetchRainfallForLocation(input: FetchRainfallInput): Promise<FetchRainfallOutput> {
  return fetchRainfallFlow(input);
}

const fetchRainfallFlow = ai.defineFlow(
  {
    name: 'fetchRainfallFlow',
    inputSchema: FetchRainfallInputSchema,
    outputSchema: FetchRainfallOutputSchema,
    description: 'Fetches simulated rainfall data for a specific location and date by directly calling the getRainfallForLocationTool.',
  },
  async (input: FetchRainfallInput) => {
    try {
      const result = await getRainfallForLocationTool(input);
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