
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSustainability } from "@/context/SustainabilityContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.jsx";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// Form schema with validation
const consumptionFormSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Please enter a valid date in YYYY-MM-DD format",
  }),
  category: z.enum(["electricity", "water", "gas", "waste"], {
    required_error: "Please select a category",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number",
  }),
});

export function ConsumptionForm() {
  const { addConsumptionEntry } = useSustainability();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Default form values
  const defaultValues = {
    date: today,
    category: "electricity",
    amount: 0,
  };

  const form = useForm({
    resolver: zodResolver(consumptionFormSchema),
    defaultValues,
  });

  // Unit mapping
  const getUnitForCategory = (category) => {
    switch (category) {
      case "electricity":
        return "kWh";
      case "water":
        return "L";
      case "gas":
        return "m³";
      case "waste":
        return "kg";
      default:
        return "";
    }
  };

  function onSubmit(values) {
    setIsSubmitting(true);
    
    // Add the unit based on the category
    const unit = getUnitForCategory(values.category);
    
    // Submit the entry with correct unit
    addConsumptionEntry({
      date: values.date,
      category: values.category,
      amount: values.amount,
      unit,
    });
    
    // Show success toast
    toast({
      title: "Consumption Entry Added",
      description: `Added ${values.amount} ${unit} of ${values.category} for ${values.date}`,
    });
    
    // Reset form
    form.reset(defaultValues);
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                The date of your consumption record.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="electricity">Electricity</SelectItem>
                  <SelectItem value="water">Water</SelectItem>
                  <SelectItem value="gas">Gas</SelectItem>
                  <SelectItem value="waste">Waste</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The type of resource consumption.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.valueAsNumber);
                    }}
                  />
                  <div className="ml-2">
                    {getUnitForCategory(form.watch("category"))}
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                The amount of resource consumed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Consumption Entry"}
        </Button>
      </form>
    </Form>
  );
}
