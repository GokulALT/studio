"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppData } from "@/context/AppDataContext";
import { analyzeHarvestData, type AnalyzeHarvestDataInput, type AnalyzeHarvestDataOutput } from "@/ai/flows/analyze-harvest-data";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Textarea } from '@/components/ui/textarea';

export function AnalysisRequester() {
  const { 
    harvestRecords, 
    rainfallData, 
    customIntervals, 
    aiAnalysisResult, 
    setAiAnalysisResult,
    loadingAnalysis,
    setLoadingAnalysis
  } = useAppData();

  const handleAnalyzeData = async () => {
    if (harvestRecords.length === 0 || rainfallData.length === 0) {
      toast({
        title: "Insufficient Data",
        description: "Please add harvest and rainfall data before requesting analysis.",
        variant: "destructive",
      });
      return;
    }

    setLoadingAnalysis(true);
    setAiAnalysisResult(null);

    const formattedHarvestData = harvestRecords.map(r => 
      `Date: ${r.date}, Coconuts: ${r.coconutCount}, Weight: ${r.totalWeight}kg, Price: $${r.salesPrice}`
    ).join('; ');

    const formattedRainfallData = rainfallData.map(r => 
      `Date: ${r.date}, Amount: ${r.amount}mm`
    ).join('; ');

    const formattedCustomIntervals = customIntervals.map(ci => 
      `${ci.name}: ${ci.description}`
    ).join('; ');

    const input: AnalyzeHarvestDataInput = {
      harvestData: formattedHarvestData,
      rainfallData: formattedRainfallData,
      customIntervals: formattedCustomIntervals || "No custom intervals defined.",
    };

    try {
      const result = await analyzeHarvestData(input);
      setAiAnalysisResult(result);
      toast({ title: "Analysis Complete", description: "Harvest recommendations are ready." });
    } catch (error) {
      console.error("AI Analysis Error:", error);
      toast({
        title: "Analysis Failed",
        description: "An error occurred while analyzing data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingAnalysis(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">AI Harvest Analysis</CardTitle>
        <CardDescription>
          Get AI-powered recommendations to optimize your harvest timings based on your data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button onClick={handleAnalyzeData} disabled={loadingAnalysis} className="w-full">
          {loadingAnalysis ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Data...
            </>
          ) : (
            "Analyze Harvest Data"
          )}
        </Button>

        {aiAnalysisResult && (
          <div className="space-y-4 pt-4">
            <div>
              <h3 className="font-semibold text-lg mb-2 font-headline">Recommendations</h3>
              <Textarea readOnly value={aiAnalysisResult.recommendations} className="h-32 bg-muted/50"/>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 font-headline">Seasonal Variations</h3>
              <Textarea readOnly value={aiAnalysisResult.seasonalVariations} className="h-32 bg-muted/50"/>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 font-headline">Historical Trends</h3>
              <Textarea readOnly value={aiAnalysisResult.historicalTrends} className="h-32 bg-muted/50"/>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Ensure you have sufficient harvest and rainfall data logged for accurate analysis.
        </p>
      </CardFooter>
    </Card>
  );
}
