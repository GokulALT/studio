"use client"

import { useAppData } from "@/context/AppDataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format } from "date-fns";

const chartConfig = {
  rainfall: {
    label: "Rainfall (mm)",
    color: "hsl(var(--accent))", // Using accent color (Light Blue)
  },
};

export function RainfallChart() {
  const { rainfallData: rawRainfallData } = useAppData();

  const chartData = rawRainfallData
    .map(data => ({
        date: new Date(data.date),
        rainfall: data.amount,
    }))
    .sort((a,b) => a.date.getTime() - b.date.getTime())
    .map(data => ({
        ...data,
        date: format(data.date, "MMM d, yyyy")
    }));

  if (rawRainfallData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Rainfall Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No rainfall data available to display chart.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Rainfall Over Time</CardTitle>
        <CardDescription>Visual representation of rainfall (mm).</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(value) => `${value} mm`} tick={{ fontSize: 12 }}/>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="rainfall" fill={chartConfig.rainfall.color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
