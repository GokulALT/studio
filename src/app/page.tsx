"use client"
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/context/AppDataContext";
import { ArrowUpRight, BarChartBig, Leaf, DollarSign, ThermometerSun, Weight } from "lucide-react";
import { HarvestCharts } from "@/components/analysis/HarvestCharts";
import { RainfallChart } from "@/components/analysis/RainfallChart";
import { format } from 'date-fns';

export default function DashboardPage() {
  const { harvestRecords, rainfallData } = useAppData();

  const totalCoconuts = harvestRecords.reduce((sum, record) => sum + record.coconutCount, 0);
  const totalWeight = harvestRecords.reduce((sum, record) => sum + record.totalWeight, 0);
  const totalRevenue = harvestRecords.reduce((sum, record) => sum + (record.coconutCount * record.salesPrice), 0);
  const latestRainfall = rainfallData.length > 0 
    ? rainfallData.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  const summaryStats = [
    { title: "Total Coconuts Harvested", value: totalCoconuts.toLocaleString(), icon: Leaf, description: "Across all records" },
    { title: "Total Weight Harvested", value: `${totalWeight.toLocaleString()} kg`, icon: Weight, description: "Across all records" },
    { title: "Total Sales Revenue", value: `$${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, icon: DollarSign, description: "Estimated total earnings" },
    { title: "Latest Rainfall", value: latestRainfall ? `${latestRainfall.amount} mm on ${format(new Date(latestRainfall.date), "MMM d")}` : "N/A", icon: ThermometerSun, description: "Most recent record" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold font-headline">CocoWise Dashboard</h1>
        <Link href="/harvest">
          <Button>Log New Harvest</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map(stat => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-body">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">{stat.value}</div>
              <p className="text-xs text-muted-foreground font-body">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline">Harvest Overview</CardTitle>
              <CardDescription className="font-body">Key harvest metrics over time.</CardDescription>
            </div>
            <Link href="/analysis">
              <Button variant="outline" size="sm">
                View Full Analysis <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <HarvestCharts />
          </CardContent>
        </Card>
        
        <RainfallChart />
      </div>
    </div>
  );
}
