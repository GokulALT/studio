// @ts-nocheck because of temporary any types
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { HarvestRecord, RainfallData, CustomInterval, AIAnalysisResult } from '@/lib/types';
import { mockHarvestRecords, mockRainfallData, mockCustomIntervals } from '@/lib/mockData';

interface AppDataContextType {
  harvestRecords: HarvestRecord[];
  addHarvestRecord: (record: HarvestRecord) => void;
  rainfallData: RainfallData[];
  addRainfallData: (data: RainfallData) => void;
  customIntervals: CustomInterval[];
  addCustomInterval: (interval: CustomInterval) => void;
  aiAnalysisResult: AIAnalysisResult | null;
  setAiAnalysisResult: (result: AIAnalysisResult | null) => void;
  loadingAnalysis: boolean;
  setLoadingAnalysis: (loading: boolean) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const isBrowser = typeof window !== 'undefined';

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [harvestRecords, setHarvestRecords] = useState<HarvestRecord[]>(() => {
    if (!isBrowser) return mockHarvestRecords;
    const saved = localStorage.getItem('harvestRecords');
    return saved ? JSON.parse(saved) : mockHarvestRecords;
  });

  const [rainfallData, setRainfallData] = useState<RainfallData[]>(() => {
    if (!isBrowser) return mockRainfallData;
    const saved = localStorage.getItem('rainfallData');
    return saved ? JSON.parse(saved) : mockRainfallData;
  });

  const [customIntervals, setCustomIntervals] = useState<CustomInterval[]>(() => {
    if (!isBrowser) return mockCustomIntervals;
    const saved = localStorage.getItem('customIntervals');
    return saved ? JSON.parse(saved) : mockCustomIntervals;
  });
  
  const [aiAnalysisResult, setAiAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState<boolean>(false);

  useEffect(() => {
    if (isBrowser) {
      localStorage.setItem('harvestRecords', JSON.stringify(harvestRecords));
    }
  }, [harvestRecords]);

  useEffect(() => {
    if (isBrowser) {
      localStorage.setItem('rainfallData', JSON.stringify(rainfallData));
    }
  }, [rainfallData]);

  useEffect(() => {
    if (isBrowser) {
      localStorage.setItem('customIntervals', JSON.stringify(customIntervals));
    }
  }, [customIntervals]);

  const addHarvestRecord = (record: HarvestRecord) => {
    setHarvestRecords(prev => [...prev, record]);
  };

  const addRainfallData = (data: RainfallData) => {
    setRainfallData(prev => [...prev, data]);
  };

  const addCustomInterval = (interval: CustomInterval) => {
    setCustomIntervals(prev => [...prev, interval]);
  };

  return (
    <AppDataContext.Provider value={{ 
      harvestRecords, addHarvestRecord,
      rainfallData, addRainfallData,
      customIntervals, addCustomInterval,
      aiAnalysisResult, setAiAnalysisResult,
      loadingAnalysis, setLoadingAnalysis
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
