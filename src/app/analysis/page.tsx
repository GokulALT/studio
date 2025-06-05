import { AnalysisRequester } from "@/components/analysis/AnalysisRequester";
import { HarvestCharts } from "@/components/analysis/HarvestCharts";
import { RainfallChart } from "@/components/analysis/RainfallChart";

export default function AnalysisPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Harvest Analysis & Recommendations</h1>
      
      <AnalysisRequester />
      
      <div className="mt-8 space-y-6">
        <h2 className="text-2xl font-semibold font-headline">Data Visualizations</h2>
        <HarvestCharts />
        <RainfallChart />
      </div>
    </div>
  );
}
