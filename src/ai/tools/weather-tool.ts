'use server';
/**
 * @fileOverview Weather tool for fetching real rainfall data using Open-Meteo API.
 *
 * - getRainfallForLocationTool - A Genkit tool to fetch rainfall data.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { format } // Import format from date-fns
from 'date-fns';

export const GetRainfallInputSchema = z.object({
  location: z.string().describe('The location (e.g., city name) to fetch rainfall data for.'),
  date: z.string().describe('The ISO date string for which to fetch rainfall data (e.g., "2023-10-26T00:00:00.000Z").'),
});
export type GetRainfallInput = z.infer<typeof GetRainfallInputSchema>;

export const GetRainfallOutputSchema = z.object({
  amount: z.number().describe('The rainfall amount in mm.'),
});
export type GetRainfallOutput = z.infer<typeof GetRainfallOutputSchema>;

interface GeoLocation {
  latitude: number;
  longitude: number;
  name: string;
}

export const getRainfallForLocationTool = ai.defineTool(
  {
    name: 'getRainfallForLocationTool',
    description: 'Fetches historical or forecast daily rainfall data for a given location and date using the Open-Meteo API.',
    inputSchema: GetRainfallInputSchema,
    outputSchema: GetRainfallOutputSchema,
  },
  async (input: GetRainfallInput): Promise<GetRainfallOutput> => {
    console.log(`Fetching real weather data for location: ${input.location}, date: ${input.date}`);

    // 1. Geocode location to get latitude and longitude
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(input.location)}&count=1&language=en&format=json`;
    let locationData: GeoLocation;

    try {
      const geoResponse = await fetch(geocodingUrl);
      if (!geoResponse.ok) {
        throw new Error(`Geocoding API request failed with status ${geoResponse.status}`);
      }
      const geoJson = await geoResponse.json();
      if (!geoJson.results || geoJson.results.length === 0) {
        throw new Error(`Could not find location: ${input.location}`);
      }
      const firstResult = geoJson.results[0];
      locationData = {
        latitude: firstResult.latitude,
        longitude: firstResult.longitude,
        name: firstResult.name,
      };
      console.log(`Geocoded ${input.location} to: Lat ${locationData.latitude}, Lon ${locationData.longitude}`);
    } catch (error) {
      console.error("Geocoding Error:", error);
      throw new Error(error instanceof Error ? `Failed to geocode location: ${error.message}` : "An unknown error occurred during geocoding.");
    }

    // 2. Fetch weather data for the geocoded location and date
    // Format the date to YYYY-MM-DD for the Open-Meteo API
    const formattedDate = format(new Date(input.date), 'yyyy-MM-dd');
    
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${locationData.latitude}&longitude=${locationData.longitude}&daily=precipitation_sum&start_date=${formattedDate}&end_date=${formattedDate}&timezone=auto`;

    try {
      const weatherResponse = await fetch(weatherUrl);
      if (!weatherResponse.ok) {
        throw new Error(`Weather API request failed with status ${weatherResponse.status}`);
      }
      const weatherJson = await weatherResponse.json();
      
      if (!weatherJson.daily || !weatherJson.daily.precipitation_sum || weatherJson.daily.precipitation_sum.length === 0) {
        console.warn(`No precipitation data found for ${locationData.name} on ${formattedDate}. API response:`, weatherJson);
        // Return 0 if data is missing but request was successful
        return { amount: 0 }; 
      }
      
      const rainfallAmount = weatherJson.daily.precipitation_sum[0];
      if (rainfallAmount === null || rainfallAmount === undefined) {
         console.warn(`Precipitation data was null/undefined for ${locationData.name} on ${formattedDate}. Assuming 0mm.`);
         return { amount: 0 };
      }

      console.log(`Fetched rainfall for ${locationData.name} on ${formattedDate}: ${rainfallAmount}mm`);
      return { amount: rainfallAmount };

    } catch (error) {
      console.error("Weather API Error:", error);
      throw new Error(error instanceof Error ? `Failed to fetch weather data: ${error.message}` : "An unknown error occurred while fetching weather data.");
    }
  }
);
