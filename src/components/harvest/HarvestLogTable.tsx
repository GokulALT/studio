"use client";

import { useAppData } from "@/context/AppDataContext";
import type { HarvestRecord } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

export function HarvestLogTable() {
  const { harvestRecords } = useAppData();

  const calculateTotal = (obj: Record<string, number | undefined> | undefined) => {
    if (!obj) return 0;
    return Object.values(obj).reduce((sum, val) => sum + (val || 0), 0);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Harvest Log</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          <Table>
            <TableCaption>A list of your recent harvests.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Coconut Count</TableHead>
                <TableHead className="text-right">Total Weight (kg)</TableHead>
                <TableHead className="text-right">Sales Price</TableHead>
                <TableHead className="text-right">Total Revenue</TableHead>
                <TableHead className="text-right">Total Labor Cost</TableHead>
                <TableHead className="text-right">Total Expenses</TableHead>
                <TableHead className="text-right">Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {harvestRecords.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((record: HarvestRecord) => {
                const totalRevenue = record.coconutCount * record.salesPrice; // Assuming price is per coconut
                const totalLaborCost = calculateTotal(record.laborCosts);
                const totalExpenses = calculateTotal(record.expenses);
                const profit = totalRevenue - totalLaborCost - totalExpenses;
                return (
                <TableRow key={record.id}>
                  <TableCell>{format(new Date(record.date), "PPP")}</TableCell>
                  <TableCell className="text-right">{record.coconutCount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{record.totalWeight.toLocaleString()} kg</TableCell>
                  <TableCell className="text-right">${record.salesPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${totalRevenue.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${totalLaborCost.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${totalExpenses.toFixed(2)}</TableCell>
                  <TableCell className={`text-right font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${profit.toFixed(2)}
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
