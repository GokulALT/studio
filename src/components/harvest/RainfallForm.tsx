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
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useAppData } from "@/context/AppDataContext";
import { toast } from "@/hooks/use-toast";
import { fetchRainfallForLocation, type FetchRainfallInput } from "@/ai/flows/fetch-rainfall-flow";
import type { RainfallData } from "@/lib/types";
import { useState } from "react";

const rainfallFormSchema = z.object({
  date: z.date({
    required_error: "Date is required to fetch rainfall data.",
  }),
  location: z.string().min(3, { message: "Location must be at least 3 characters." }),
});

type RainfallFormValues = z.infer<typeof rainfallFormSchema>;

export function RainfallForm() {
  const { addRainfallData } = useAppData();
  const [isFetching, setIsFetching] = useState(false); // Renamed from isLoading to avoid conflict with AppContext
  
  const form = useForm<RainfallFormValues>({
    resolver: zodResolver(rainfallFormSchema),
    defaultValues: {
      location: "",
    }
  });

  async function onSubmit(values: RainfallFormValues) {
    setIsFetching(true);
    try {
      const flowInput: FetchRainfallInput = {
        location: values.location,
        date: values.date.toISOString(), // Genkit flow expects ISO string
      };
      const result = await fetchRainfallForLocation(flowInput);

      // Data for AppContext addRainfallData
      const rainfallRecord = {
        date: values.date, // Pass Date object
        amount: result.amount,
        location: values.location,
      };
      
      await addRainfallData(rainfallRecord);
      // Toast for success is handled by AppDataContext
      form.reset({location: values.location, date: values.date}); // Reset, keep location/date for convenience
      
    } catch (error) {
      console.error("Fetch Rainfall Error:", error);
      toast({ // Explicit toast here for fetch-specific error
        title: "Fetch Failed",
        description: error instanceof Error ? error.message : "An error occurred while fetching rainfall data.",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Log Rainfall Data (Online)</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date for Rainfall Data</FormLabel>
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
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (e.g., City)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter harvest location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isFetching}>
              {isFetching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching Rainfall...
                </>
              ) : (
                "Fetch and Log Rainfall"
              )}
            </Button>
          </form>
        </Form>
        <p className="text-xs text-muted-foreground mt-4">
          Note: Rainfall data is fetched using the Open-Meteo API.
        </p>
      </CardContent>
    </Card>
  );
}
