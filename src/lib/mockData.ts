import type { HarvestRecord, RainfallData, CustomInterval } from './types';

export const mockHarvestRecords: HarvestRecord[] = [
  { 
    id: '1', 
    date: new Date(2023, 0, 15).toISOString(), 
    coconutCount: 1200, 
    totalWeight: 600, 
    salesPrice: 0.5, 
    laborCosts: { plucker: 100, gatherer: 80, peeler: 50, driver: 40, buyer: 20, plumber: 10, mechanic: 15, maintenanceWorker: 25 }, 
    expenses: { fertilizer: 50, motorMaintenance: 20, fencingMaintenance: 30 } 
  },
  { 
    id: '2', 
    date: new Date(2023, 2, 1).toISOString(), 
    coconutCount: 1100, 
    totalWeight: 550, 
    salesPrice: 0.55, 
    laborCosts: { plucker: 90, gatherer: 70, peeler: 45 }, 
    expenses: { motorMaintenance: 30 } 
  },
  { 
    id: '3', 
    date: new Date(2023, 4, 10).toISOString(), 
    coconutCount: 1350, 
    totalWeight: 675, 
    salesPrice: 0.48, 
    laborCosts: { plucker: 110, gatherer: 85, peeler: 55, driver: 40 }, 
    expenses: { fertilizer: 60, fencingMaintenance: 20 } 
  },
];

export const mockRainfallData: RainfallData[] = [
  { id: 'r1', date: new Date(2023, 0, 10).toISOString(), amount: 50 },
  { id: 'r2', date: new Date(2023, 0, 25).toISOString(), amount: 20 },
  { id: 'r3', date: new Date(2023, 1, 15).toISOString(), amount: 75 },
  { id: 'r4', date: new Date(2023, 2, 5).toISOString(), amount: 10 },
  { id: 'r5', date: new Date(2023, 3, 20).toISOString(), amount: 40 },
  { id: 'r6', date: new Date(2023, 4, 1).toISOString(), amount: 60 },
];

export const mockCustomIntervals: CustomInterval[] = [
  { id: 'ci1', name: "Standard Cycle", description: "Harvest every 60 days" },
  { id: 'ci2', name: "Post-Monsoon", description: "Harvest after the monsoon season (approx. October)" },
];
