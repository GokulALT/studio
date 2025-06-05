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
import { toast } from "@/hooks/use-toast";

const rainfallFormSchema = z.object({
  date: z.date({
    required_error: "Date of rainfall is required.",
  }),
  amount: z.coerce.number({required_error: "Rainfall amount is required."}).positive("Rainfall amount must be a positive number."),
});

export function RainfallForm() {
  const { addRainfallData } = useAppData();
  const form = useForm<z.infer<typeof rainfallFormSchema>>({
    resolver: zodResolver(rainfallFormSchema),
    defaultValues: {
      amount: 0,
    }
  });

  function onSubmit(values: z.infer<typeof rainfallFormSchema>) {
    const newRainfall = {
      id: crypto.randomUUID(),
      date: values.date.toISOString(),
      amount: values.amount,
    };
    addRainfallData(newRainfall);
    toast({ title: "Rainfall Data Added", description: "Successfully logged new rainfall data." });
    form.reset({amount: 0});
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Log Rainfall Data</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Rainfall</FormLabel>
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
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rainfall Amount (mm)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter rainfall amount" {...field} onChange={event => field.onChange(+event.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Add Rainfall Data</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
