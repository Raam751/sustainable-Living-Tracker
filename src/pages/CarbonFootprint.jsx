
import { Battery } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { SustainabilityProvider } from "@/context/SustainabilityContext";
import { useSustainability } from "@/context/SustainabilityContext";
import { CarbonFootprintForm } from "@/components/forms/CarbonFootprintForm";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CarbonFootprintContent = () => {
  const { carbonFootprintData } = useSustainability();

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Prepare chart data by category
  const prepareCategoryData = (category) => {
    const categoryData = carbonFootprintData
      .filter(entry => entry.category === category)
      .reduce((acc, entry) => {
        const existingEntry = acc.find(item => item.subcategory === entry.subcategory);
        if (existingEntry) {
          existingEntry.emission += entry.carbonEmission;
        } else {
          acc.push({
            subcategory: entry.subcategory,
            emission: entry.carbonEmission
          });
        }
        return acc;
      }, []);
    
    return categoryData.map(item => ({
      subcategory: item.subcategory.charAt(0).toUpperCase() + item.subcategory.slice(1),
      emission: parseFloat(item.emission.toFixed(2))
    }));
  };

  // Get the most recent entries
  const getRecentEntries = (count) => {
    return [...carbonFootprintData]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, count);
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <section>
        <h2 className="text-xl font-semibold mb-4">Add Carbon Footprint</h2>
        <DashboardCard title="New Carbon Footprint Entry">
          <CarbonFootprintForm />
        </DashboardCard>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Emissions by Category</h2>
        <Tabs defaultValue="transportation">
          <TabsList className="mb-4">
            <TabsTrigger value="transportation">Transportation</TabsTrigger>
            <TabsTrigger value="food">Food</TabsTrigger>
            <TabsTrigger value="household">Household</TabsTrigger>
          </TabsList>
          
          {(["transportation", "food", "household"]).map((category) => (
            <TabsContent key={category} value={category} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prepareCategoryData(category)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subcategory" />
                  <YAxis label={{ value: 'kg CO₂', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${value} kg CO₂`, 'Emission']} />
                  <Legend />
                  <Bar 
                    dataKey="emission" 
                    name="CO₂ Emission" 
                    fill={
                      category === "transportation" ? "#1976d2" : 
                      category === "food" ? "#43a047" : 
                      "#fbc02d"
                    } 
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Subcategory</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>CO₂ Emission</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getRecentEntries(10).map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{formatDate(entry.date)}</TableCell>
                  <TableCell className="capitalize">{entry.category}</TableCell>
                  <TableCell className="capitalize">{entry.subcategory}</TableCell>
                  <TableCell>{entry.amount}</TableCell>
                  <TableCell>{entry.carbonEmission.toFixed(2)} kg</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
};

const CarbonFootprint = () => {
  return (
    <SustainabilityProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Carbon Footprint</h1>
              <p className="text-muted-foreground mt-1">
                Calculate and monitor your carbon emissions
              </p>
            </div>
            <div className="flex items-center mt-4 md:mt-0 bg-energy-100 text-energy-800 px-4 py-2 rounded-lg">
              <Battery className="mr-2 h-5 w-5" />
              <span className="font-medium">Track Your Impact</span>
            </div>
          </div>

          <CarbonFootprintContent />
        </main>
        <footer className="bg-muted py-6 mt-10">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>SustainHome &copy; {new Date().getFullYear()} - Track your sustainability journey</p>
          </div>
        </footer>
      </div>
    </SustainabilityProvider>
  );
};

export default CarbonFootprint;
