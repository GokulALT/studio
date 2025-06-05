// @ts-nocheck because of temporary any types until full typing of API responses
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { HarvestRecord, RainfallData, CustomInterval, AIAnalysisResult } from '@/lib/types';
import { toast } from "@/hooks/use-toast";

interface AppDataContextType {
  harvestRecords: HarvestRecord[];
  addHarvestRecord: (record: Omit<HarvestRecord, 'id' | '_id' | 'date'> & { date: Date }) => Promise<void>;
  rainfallData: RainfallData[];
  addRainfallData: (data: Omit<RainfallData, 'id' | '_id' | 'date'> & { date: Date }) => Promise<void>;
  customIntervals: CustomInterval[];
  addCustomInterval: (interval: Omit<CustomInterval, 'id' | '_id'>) => Promise<void>;
  aiAnalysisResult: AIAnalysisResult | null;
  setAiAnalysisResult: (result: AIAnalysisResult | null) => void;
  loadingAnalysis: boolean;
  setLoadingAnalysis: (loading: boolean) => void;
  loadingAppData: boolean; 
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const isBrowser = typeof window !== 'undefined';

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [harvestRecords, setHarvestRecords] = useState<HarvestRecord[]>([]);
  const [rainfallData, setRainfallData] = useState<RainfallData[]>([]);
  const [customIntervals, setCustomIntervals] = useState<CustomInterval[]>([]);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState<boolean>(false);
  const [loadingAppData, setLoadingAppData] = useState<boolean>(true);

  useEffect(() => {
    async function loadInitialData() {
      if (!isBrowser) {
        setLoadingAppData(false);
        return;
      }
      setLoadingAppData(true);
      try {
        const [harvestRes, rainfallRes, intervalsRes] = await Promise.all([
          fetch('/api/harvest'),
          fetch('/api/rainfall'),
          fetch('/api/intervals'),
        ]);

        if (!harvestRes.ok) console.error("Failed to fetch harvest records:", await harvestRes.text());
        if (!rainfallRes.ok) console.error("Failed to fetch rainfall data:", await rainfallRes.text());
        if (!intervalsRes.ok) console.error("Failed to fetch custom intervals:", await intervalsRes.text());

        const harvest = harvestRes.ok ? await harvestRes.json() : [];
        const rainfall = rainfallRes.ok ? await rainfallRes.json() : [];
        const intervals = intervalsRes.ok ? await intervalsRes.json() : [];
        
        setHarvestRecords(Array.isArray(harvest) ? harvest : []);
        setRainfallData(Array.isArray(rainfall) ? rainfall : []);
        setCustomIntervals(Array.isArray(intervals) ? intervals : []);

      } catch (error) {
        console.error("Error loading initial data from API:", error);
        toast({ title: "Error", description: "Could not load app data.", variant: "destructive" });
        // Set to empty arrays on error to prevent app crash
        setHarvestRecords([]);
        setRainfallData([]);
        setCustomIntervals([]);
      } finally {
        setLoadingAppData(false);
      }
    }
    loadInitialData();
  }, []);

  const addHarvestRecord = async (record: Omit<HarvestRecord, 'id' | '_id' | 'date'> & { date: Date }) => {
    const newRecordWithId = {
      ...record,
      id: crypto.randomUUID(),
      date: record.date.toISOString(), // Convert Date to ISO string for API
    };
    try {
      const response = await fetch('/api/harvest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecordWithId),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save harvest record');
      }
      const savedRecord = await response.json();
      // Ensure savedRecord.date is an ISO string before adding to state.
      // The API POST for harvest should return the date as an ISO string.
      setHarvestRecords(prev => [savedRecord, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      toast({ title: "Success", description: "Harvest record added." });
    } catch (error) {
      console.error("Error adding harvest record:", error);
      toast({ title: "Error", description: (error as Error).message || "Could not add harvest record.", variant: "destructive" });
    }
  };

  const addRainfallData = async (data: Omit<RainfallData, 'id' | '_id' | 'date'> & { date: Date }) => {
    const newRainfallWithId = {
      ...data,
      id: crypto.randomUUID(),
      date: data.date.toISOString(),
    };
    try {
      const response = await fetch('/api/rainfall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRainfallWithId),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save rainfall data');
      }
      const savedData = await response.json();
      setRainfallData(prev => [savedData, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      toast({ title: "Success", description: "Rainfall data added." });
    } catch (error) {
      console.error("Error adding rainfall data:", error);
      toast({ title: "Error", description: (error as Error).message || "Could not add rainfall data.", variant: "destructive" });
    }
  };

  const addCustomInterval = async (interval: Omit<CustomInterval, 'id' | '_id'>) => {
     const newIntervalWithId = {
      ...interval,
      id: crypto.randomUUID(),
    };
    try {
      const response = await fetch('/api/intervals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIntervalWithId),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save custom interval');
      }
      const savedInterval = await response.json();
      setCustomIntervals(prev => [savedInterval, ...prev]);
      toast({ title: "Success", description: "Custom interval added." });
    } catch (error) {
      console.error("Error adding custom interval:", error);
      toast({ title: "Error", description: (error as Error).message || "Could not add custom interval.", variant: "destructive" });
    }
  };

  return (
    <AppDataContext.Provider value={{ 
      harvestRecords, addHarvestRecord,
      rainfallData, addRainfallData,
      customIntervals, addCustomInterval,
      aiAnalysisResult, setAiAnalysisResult,
      loadingAnalysis, setLoadingAnalysis,
      loadingAppData
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = (): AppDataContextType => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
