
import type { ObjectId } from 'mongodb';

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
  _id?: ObjectId | string; // MongoDB's primary key
  id: string; // Client-side/API consistent ID
  date: string; // ISO string date
  coconutCount: number;
  totalWeight: number; // in kg
  salesPrice: number; // per unit
  laborCosts: LaborCost;
  expenses: Expense;
}

export interface RainfallData {
  _id?: ObjectId | string;
  id: string;
  date: string; // ISO string date
  amount: number; // in mm
  location?: string;
}

export interface CustomInterval {
  _id?: ObjectId | string;
  id: string;
  name: string;
  description: string;
}

export interface AIAnalysisResult {
  recommendations: string;
  seasonalVariations: string;
  historicalTrends: string;
}

// This type is used by HarvestForm, needs to align with how data is submitted.
// The form itself passes a Date object for `date`.
// The AppDataContext's addHarvestRecord expects a Date object and converts it to ISO string.
export type HarvestFormData = 
  Omit<HarvestRecord, 'id' | '_id' | 'date' | 'laborCosts' | 'expenses'> & 
  { date: Date } & // Form uses Date object
  LaborCost & 
  Expense;

// For RainfallForm
export type RainfallFormData = 
  Omit<RainfallData, 'id' | '_id' | 'date' | 'amount' | 'location'> & 
  { date: Date, amount: number, location: string };


