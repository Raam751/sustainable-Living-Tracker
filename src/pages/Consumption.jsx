
import { Droplet } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { SustainabilityProvider } from "@/context/SustainabilityContext";
import { useSustainability } from "@/context/SustainabilityContext";
import { ConsumptionForm } from "@/components/forms/ConsumptionForm";
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ConsumptionContent = () => {
  const { consumptionData, getRecentConsumptionTrend } = useSustainability();

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Prepare chart data
  const prepareChartData = (category) => {
    return getRecentConsumptionTrend(category, 10).map(item => ({
      date: formatDate(item.date),
      amount: item.amount
    }));
  };

  // Get the most recent entries
  const getRecentEntries = (count) => {
    return [...consumptionData]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, count);
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <section>
        <h2 className="text-xl font-semibold mb-4">Add Consumption</h2>
        <DashboardCard title="New Consumption Entry">
          <ConsumptionForm />
        </DashboardCard>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Consumption Trends</h2>
        <Tabs defaultValue="electricity">
          <TabsList className="mb-4">
            <TabsTrigger value="electricity">Electricity</TabsTrigger>
            <TabsTrigger value="water">Water</TabsTrigger>
            <TabsTrigger value="gas">Gas</TabsTrigger>
            <TabsTrigger value="waste">Waste</TabsTrigger>
          </TabsList>
          
          {(["electricity", "water", "gas", "waste"]).map((category) => (
            <TabsContent key={category} value={category} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prepareChartData(category)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    name={`${category.charAt(0).toUpperCase()}${category.slice(1)}`} 
                    stroke={
                      category === "electricity" ? "#43a047" : 
                      category === "water" ? "#1976d2" : 
                      category === "gas" ? "#fbc02d" : 
                      "#9e9e9e"
                    } 
                    strokeWidth={2} 
                  />
                </LineChart>
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
                <TableHead>Amount</TableHead>
                <TableHead>Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getRecentEntries(10).map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{formatDate(entry.date)}</TableCell>
                  <TableCell className="capitalize">{entry.category}</TableCell>
                  <TableCell>{entry.amount}</TableCell>
                  <TableCell>{entry.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
};

const Consumption = () => {
  return (
    <SustainabilityProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Consumption Tracker</h1>
              <p className="text-muted-foreground mt-1">
                Monitor and record your household resource usage
              </p>
            </div>
            <div className="flex items-center mt-4 md:mt-0 bg-water-100 text-water-800 px-4 py-2 rounded-lg">
              <Droplet className="mr-2 h-5 w-5" />
              <span className="font-medium">Track Your Resources</span>
            </div>
          </div>

          <ConsumptionContent />
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

export default Consumption;
