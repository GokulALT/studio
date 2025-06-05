export interface LaborCost {
  plucker?: number;
  gatherer?: number;
  peeler?: number;
  driver?: number;
  buyer?: number;
  plumber?: number;
  mechanic?: number;
  maintenanceWorker?: number;
}

export interface Expense {
  fertilizer?: number;
  motorMaintenance?: number;
  fencingMaintenance?: number;
}

export interface HarvestRecord {
  id: string;
  date: string; // ISO string date
  coconutCount: number;
  totalWeight: number; // in kg
  salesPrice: number; // per unit (e.g., per coconut or per kg based on context)
  laborCosts: LaborCost;
  expenses: Expense;
}

export interface RainfallData {
  id: string;
  date: string; // ISO string date
  amount: number; // in mm
  location?: string; // Added location
}

export interface CustomInterval {
  id: string;
  name: string;
  description: string;
}

export interface AIAnalysisResult {
  recommendations: string;
  seasonalVariations: string;
  historicalTrends: string;
}

// Helper type for form union
export type HarvestFormData = Omit<HarvestRecord, 'id' | 'laborCosts' | 'expenses'> & LaborCost & Expense;