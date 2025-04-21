
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

// The emissions factors (kg CO2 per unit)
const emissionFactors = {
  transportation: {
    car: 0.25, // per km
    bus: 0.12, // per km
    train: 0.05, // per km
    bicycle: 0, // per km
    walk: 0, // per km
  },
  food: {
    meat: 15, // per kg
    dairy: 4, // per kg
    vegetables: 0.5, // per kg
    fruits: 0.5, // per kg
    grains: 0.8, // per kg
  },
  household: {
    heating: 0.5, // per hour
    electricity: 0.3, // per kWh
    electronics: 0.3, // per hour
    water: 0.001, // per liter
  },
};

// Form schema with validation
const carbonFootprintFormSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Please enter a valid date in YYYY-MM-DD format",
  }),
  category: z.enum(["transportation", "food", "household"], {
    required_error: "Please select a category",
  }),
  subcategory: z.string({
    required_error: "Please select a subcategory",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number",
  }),
});

export function CarbonFootprintForm() {
  const { addCarbonFootprintEntry } = useSustainability();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Default form values
  const defaultValues = {
    date: today,
    category: "transportation",
    subcategory: "car",
    amount: 0,
  };

  const form = useForm({
    resolver: zodResolver(carbonFootprintFormSchema),
    defaultValues,
  });

  // Handle category change to update subcategory options
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    // Reset subcategory when category changes
    form.setValue("subcategory", Object.keys(emissionFactors[value])[0]);
  };

  // Get subcategories based on selected category
  const getSubcategories = () => {
    if (!selectedCategory) return [];
    return Object.keys(emissionFactors[selectedCategory]);
  };

  // Get unit label based on category and subcategory
  const getUnitLabel = () => {
    const category = form.watch("category");
    
    if (category === "transportation") return "km";
    if (category === "food") return "kg";
    if (category === "household") {
      const subcategory = form.watch("subcategory");
      if (subcategory === "water") return "liters";
      if (subcategory === "electricity") return "kWh";
      return "hours";
    }
    
    return "";
  };

  // Calculate carbon emissions based on inputs
  const calculateCarbonEmission = (values) => {
    const { category, subcategory, amount } = values;
    return amount * emissionFactors[category][subcategory];
  };

  function onSubmit(values) {
    setIsSubmitting(true);
    
    // Calculate carbon emissions
    const carbonEmission = calculateCarbonEmission(values);
    
    // Add the entry with calculated carbon emission
    addCarbonFootprintEntry({
      date: values.date,
      category: values.category,
      subcategory: values.subcategory,
      amount: values.amount,
      carbonEmission,
    });
    
    // Show success toast
    toast({
      title: "Carbon Footprint Entry Added",
      description: `Added ${carbonEmission.toFixed(2)} kg CO₂ from ${values.subcategory} (${values.category})`,
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
                The date of the activity.
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
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  handleCategoryChange(value);
                }} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="household">Household</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The category of carbon-generating activity.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="subcategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subcategory</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subcategory" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getSubcategories().map((subcategory) => (
                    <SelectItem key={subcategory} value={subcategory}>
                      {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The specific type of activity.
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
                  <div className="ml-2">{getUnitLabel()}</div>
                </div>
              </FormControl>
              <FormDescription>
                The amount of activity.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Carbon Footprint Entry"}
        </Button>
      </form>
    </Form>
  );
}
