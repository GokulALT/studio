"use client"

import { useAppData } from "@/context/AppDataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

const chartConfigBase = {
  value: { label: "Value" },
  coconutCount: { label: "Coconut Count", color: "hsl(var(--chart-1))" },
  totalWeight: { label: "Total Weight (kg)", color: "hsl(var(--chart-2))" },
  salesRevenue: { label: "Sales Revenue ($)", color: "hsl(var(--chart-3))" },
};

export function HarvestCharts() {
  const { harvestRecords } = useAppData();

  const chartData = harvestRecords
    .map(record => ({
      date: new Date(record.date),
      coconutCount: record.coconutCount,
      totalWeight: record.totalWeight,
      salesRevenue: record.coconutCount * record.salesPrice, // Assuming price is per coconut
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(record => ({
        ...record,
        date: format(record.date, "MMM d, yyyy")
    }));


  if (harvestRecords.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Harvest Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No harvest data available to display charts.</p>
        </CardContent>
      </Card>
    );
  }
  
  const yAxisFormatter = (value: number) => value.toLocaleString();


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Coconut Count Over Time</CardTitle>
          <CardDescription>Trend of harvested coconut quantity.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfigBase} className="h-[300px] w-full">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={yAxisFormatter} tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="coconutCount" stroke={chartConfigBase.coconutCount.color} strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Total Weight Over Time</CardTitle>
          <CardDescription>Trend of total harvested weight (kg).</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfigBase} className="h-[300px] w-full">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={yAxisFormatter} tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="totalWeight" stroke={chartConfigBase.totalWeight.color} strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline">Sales Revenue Over Time</CardTitle>
          <CardDescription>Trend of sales revenue ($).</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfigBase} className="h-[300px] w-full">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }}/>
              <YAxis tickFormatter={yAxisFormatter} tick={{ fontSize: 12 }}/>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="salesRevenue" fill={chartConfigBase.salesRevenue.color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
