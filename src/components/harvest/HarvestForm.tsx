"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useAppData } from "@/context/AppDataContext";
import type { HarvestFormData } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const dateRequiredError = { required_error: "Date of harvest is required." };
const numberRequiredError = (fieldName: string) => ({ required_error: `${fieldName} is required.` });
const positiveNumberError = (fieldName: string) => `${fieldName} must be a positive number.`;

const harvestFormSchema = z.object({
  date: z.date(dateRequiredError),
  coconutCount: z.coerce.number(numberRequiredError("Coconut count")).positive(positiveNumberError("Coconut count")),
  totalWeight: z.coerce.number(numberRequiredError("Total weight")).positive(positiveNumberError("Total weight")),
  salesPrice: z.coerce.number(numberRequiredError("Sales price")).positive(positiveNumberError("Sales price")),
  
  plucker: z.coerce.number().optional(),
  gatherer: z.coerce.number().optional(),
  peeler: z.coerce.number().optional(),
  driver: z.coerce.number().optional(),
  buyer: z.coerce.number().optional(),
  plumber: z.coerce.number().optional(),
  mechanic: z.coerce.number().optional(),
  maintenanceWorker: z.coerce.number().optional(),

  fertilizer: z.coerce.number().optional(),
  motorMaintenance: z.coerce.number().optional(),
  fencingMaintenance: z.coerce.number().optional(),
});

const laborCostFields: (keyof HarvestFormData)[] = ['plucker', 'gatherer', 'peeler', 'driver', 'buyer', 'plumber', 'mechanic', 'maintenanceWorker'];
const expenseFields: (keyof HarvestFormData)[] = ['fertilizer', 'motorMaintenance', 'fencingMaintenance'];

export function HarvestForm() {
  const { addHarvestRecord } = useAppData();
  const form = useForm<z.infer<typeof harvestFormSchema>>({
    resolver: zodResolver(harvestFormSchema),
    defaultValues: {
      coconutCount: 0,
      totalWeight: 0,
      salesPrice: 0,
    },
  });

  function onSubmit(values: z.infer<typeof harvestFormSchema>) {
    const newRecord = {
      id: crypto.randomUUID(),
      date: values.date.toISOString(),
      coconutCount: values.coconutCount,
      totalWeight: values.totalWeight,
      salesPrice: values.salesPrice,
      laborCosts: {
        plucker: values.plucker,
        gatherer: values.gatherer,
        peeler: values.peeler,
        driver: values.driver,
        buyer: values.buyer,
        plumber: values.plumber,
        mechanic: values.mechanic,
        maintenanceWorker: values.maintenanceWorker,
      },
      expenses: {
        fertilizer: values.fertilizer,
        motorMaintenance: values.motorMaintenance,
        fencingMaintenance: values.fencingMaintenance,
      },
    };
    addHarvestRecord(newRecord);
    toast({ title: "Harvest Record Added", description: "Successfully logged new harvest." });
    form.reset({
      coconutCount: 0,
      totalWeight: 0,
      salesPrice: 0,
      plucker: undefined, gatherer: undefined, peeler: undefined, driver: undefined, 
      buyer: undefined, plumber: undefined, mechanic: undefined, maintenanceWorker: undefined,
      fertilizer: undefined, motorMaintenance: undefined, fencingMaintenance: undefined,
    });
  }

  const renderNumberInput = (name: keyof HarvestFormData, label: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type="number" placeholder={`Enter ${label.toLowerCase()}`} {...field} onChange={event => field.onChange(+event.target.value)} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Log New Harvest</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Harvest Details</TabsTrigger>
                <TabsTrigger value="labor">Labor Costs</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Harvest</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {renderNumberInput("coconutCount", "Coconut Count")}
                {renderNumberInput("totalWeight", "Total Weight (kg)")}
                {renderNumberInput("salesPrice", "Sales Price (per unit)")}
              </TabsContent>
              <TabsContent value="labor" className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderNumberInput("plucker", "Plucker Cost")}
                  {renderNumberInput("gatherer", "Gatherer Cost")}
                  {renderNumberInput("peeler", "Peeler Cost")}
                  {renderNumberInput("driver", "Driver Cost")}
                  {renderNumberInput("buyer", "Buyer Cost")}
                  {renderNumberInput("plumber", "Plumber Cost")}
                  {renderNumberInput("mechanic", "Mechanic Cost")}
                  {renderNumberInput("maintenanceWorker", "Maintenance Worker Cost")}
                </div>
              </TabsContent>
              <TabsContent value="expenses" className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderNumberInput("fertilizer", "Fertilizer Cost")}
                  {renderNumberInput("motorMaintenance", "Motor Maintenance Cost")}
                  {renderNumberInput("fencingMaintenance", "Fencing Maintenance Cost")}
                </div>
              </TabsContent>
            </Tabs>
            <Button type="submit" className="w-full">Add Harvest Record</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
