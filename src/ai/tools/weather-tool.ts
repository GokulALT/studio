'use server';
/**
 * @fileOverview Weather tool for fetching simulated rainfall data.
 *
 * - getRainfallForLocationTool - A Genkit tool to simulate fetching rainfall data.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GetRainfallInputSchema = z.object({
  location: z.string().describe('The location (e.g., city name) to fetch rainfall data for.'),
  date: z.string().describe('The ISO date string for which to fetch rainfall data.'),
});
export type GetRainfallInput = z.infer<typeof GetRainfallInputSchema>;

export const GetRainfallOutputSchema = z.object({
  amount: z.number().describe('The rainfall amount in mm.'),
});
export type GetRainfallOutput = z.infer<typeof GetRainfallOutputSchema>;

export const getRainfallForLocationTool = ai.defineTool(
  {
    name: 'getRainfallForLocationTool',
    description: 'Simulates fetching rainfall data for a given location and date from an external weather API. In a real application, this would call a weather service.',
    inputSchema: GetRainfallInputSchema,
    outputSchema: GetRainfallOutputSchema,
  },
  async (input: GetRainfallInput): Promise<GetRainfallOutput> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log(`Simulating weather API call for location: ${input.location}, date: ${input.date}`);
    
    let amount = Math.floor(Math.random() * 30) + 1; // Default random amount 1-30mm
    if (input.location.toLowerCase().includes('desert')) {
      amount = Math.floor(Math.random() * 5); // 0-4mm for deserts
    } else if (input.location.toLowerCase().includes('rainforest')) {
      amount = Math.floor(Math.random() * 50) + 20; // 20-69mm for rainforests
    } else if (input.location.toLowerCase().includes('london')) {
      amount = Math.floor(Math.random() * 15) + 5; // 5-19mm for London
    }
    
    if (Math.random() < 0.05) {
        throw new Error("Simulated API error: Could not fetch weather data for the location.");
    }

    return { amount };
  }
);