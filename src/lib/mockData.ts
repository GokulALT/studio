import type { HarvestRecord, RainfallData, CustomInterval } from './types';

// These mock data will no longer be the default in AppDataContext,
// but can be kept for testing or as a fallback if desired.
// For now, the app will fetch from MongoDB or start with empty arrays.

export const mockHarvestRecords: HarvestRecord[] = [
  // Data will be fetched from MongoDB
];

export const mockRainfallData: RainfallData[] = [
  // Data will be fetched from MongoDB
];

export const mockCustomIntervals: CustomInterval[] = [
  // Data will be fetched from MongoDB
];
