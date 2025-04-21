import { BarChart3 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { SustainabilityProvider } from "@/context/SustainabilityContext";
import { useSustainability } from "@/context/SustainabilityContext";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";

const ReportsContent = () => {
  const { consumptionData, carbonFootprintData, sustainabilityTips } = useSustainability();

  // Colors
  const COLORS = ["#43a047", "#1976d2", "#fbc02d", "#9e9e9e"];
  const CO2_COLORS = ["#1976d2", "#43a047", "#fbc02d"];

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Group consumption data by date
  const prepareConsumptionOverview = () => {
    const dates = [...new Set(consumptionData.map(entry => entry.date))].sort();
    
    return dates.slice(-7).map(date => {
      const dayData = { date: formatDate(date) };
      
      ["electricity", "water", "gas", "waste"].forEach(category => {
        const entries = consumptionData.filter(
          entry => entry.date === date && entry.category === category
        );
        
        if (entries.length > 0) {
          dayData[category] = entries.reduce((sum, entry) => sum + entry.amount, 0);
        } else {
          dayData[category] = 0;
        }
      });
      
      return dayData;
    });
  };

  // Prepare carbon footprint overview
  const prepareCarbonOverview = () => {
    const categories = ["transportation", "food", "household"];
    
    return categories.map(category => {
      const totalEmission = carbonFootprintData
        .filter(entry => entry.category === category)
        .reduce((sum, entry) => sum + entry.carbonEmission, 0);
      
      return {
        name: category.charAt(0).toUpperCase() + category.slice(1),
        value: parseFloat(totalEmission.toFixed(2))
      };
    });
  };

  // Calculate sustainability score (mock algorithm)
  const calculateSustainabilityScore = () => {
    // This is a simplified scoring system - in a real app, this would be more sophisticated
    
    // Base score
    let score = 70;
    
    // Adjust for consumption trends
    const recentElectricity = consumptionData
      .filter(entry => entry.category === "electricity")
      .slice(-5);
    
    if (recentElectricity.length >= 2) {
      const first = recentElectricity[0].amount;
      const last = recentElectricity[recentElectricity.length - 1].amount;
      
      if (last < first) {
        // Decreasing trend is good
        score += 5;
      } else if (last > first) {
        // Increasing trend is bad
        score -= 5;
      }
    }
    
    // Adjust for carbon footprint
    const totalCO2 = carbonFootprintData.reduce((sum, entry) => sum + entry.carbonEmission, 0);
    
    // Penalize for high CO2
    if (totalCO2 > 50) score -= 10;
    else if (totalCO2 < 30) score += 10;
    
    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, score));
  };

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 80) return "text-eco-600";
    if (score >= 60) return "text-energy-600";
    return "text-red-500";
  };

  // Get improvement recommendations based on data
  const getTopRecommendations = () => {
    // In a real app, these would be algorithmically determined
    return sustainabilityTips
      .filter(tip => tip.impact === "high")
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  };

  const score = calculateSustainabilityScore();
  const recommendations = getTopRecommendations();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-3">
        <DashboardCard title="Sustainability Score">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center">
              <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
                {score}
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-medium">Your Eco Score</h3>
                <p className="text-muted-foreground">
                  {score >= 80
                    ? "Excellent! You're living sustainably."
                    : score >= 60
                    ? "Good progress, with room for improvement."
                    : "Needs improvement to reduce environmental impact."}
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <h3 className="text-lg font-medium mb-2">Top Recommendations</h3>
              <ul className="space-y-2">
                {recommendations.map((tip) => (
                  <li key={tip.id} className="flex items-start">
                    <Badge className="bg-eco-500 mr-2 mt-0.5">{tip.category}</Badge>
                    <span>{tip.tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DashboardCard>
      </div>

      <div className="lg:col-span-2">
        <DashboardCard title="Consumption Overview (Last 7 Days)">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={prepareConsumptionOverview()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" stroke="#43a047" />
                <YAxis yAxisId="right" orientation="right" stroke="#1976d2" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="electricity"
                  name="Electricity (kWh)"
                  fill="#43a047"
                />
                <Bar
                  yAxisId="left"
                  dataKey="gas"
                  name="Gas (m³)"
                  fill="#fbc02d"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="water"
                  name="Water (L)"
                  stroke="#1976d2"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="waste"
                  name="Waste (kg)"
                  stroke="#9e9e9e"
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>

      <div className="lg:col-span-1">
        <DashboardCard title="Carbon Footprint Breakdown">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={prepareCarbonOverview()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {prepareCarbonOverview().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CO2_COLORS[index % CO2_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} kg CO₂`, 'Emission']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>

      <div className="lg:col-span-3">
        <DashboardCard title="Sustainability Insights">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-eco-50 rounded-lg">
              <h3 className="font-medium text-eco-900 mb-2">Energy Usage</h3>
              <p className="text-sm text-eco-800">
                Your electricity consumption is {score > 70 ? "below" : "above"} average for your household size.
                Consider {score > 70 ? "maintaining your good habits" : "switching to LED bulbs and energy-efficient appliances"}.
              </p>
            </div>
            
            <div className="p-4 bg-water-50 rounded-lg">
              <h3 className="font-medium text-water-900 mb-2">Water Conservation</h3>
              <p className="text-sm text-water-800">
                Your water usage is {score > 60 ? "efficient" : "higher than recommended"}.
                {score > 60 
                  ? " Keep up the good work by continuing to conserve water."
                  : " Consider installing low-flow fixtures and reducing shower time."}
              </p>
            </div>
            
            <div className="p-4 bg-energy-50 rounded-lg">
              <h3 className="font-medium text-energy-900 mb-2">Carbon Impact</h3>
              <p className="text-sm text-energy-800">
                Your carbon footprint from transportation is your {prepareCarbonOverview()[0].value > prepareCarbonOverview()[1].value ? "highest" : "lower"} impact area.
                {prepareCarbonOverview()[0].value > prepareCarbonOverview()[1].value 
                  ? " Consider carpooling or using public transport more often."
                  : " Great job keeping your transportation emissions low."}
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

const Reports = () => {
  return (
    <SustainabilityProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Reports & Analysis</h1>
              <p className="text-muted-foreground mt-1">
                Insights and recommendations for your sustainable lifestyle
              </p>
            </div>
            <div className="flex items-center mt-4 md:mt-0 bg-eco-50 text-eco-900 px-4 py-2 rounded-lg">
              <BarChart3 className="mr-2 h-5 w-5" />
              <span className="font-medium">Your Eco Insights</span>
            </div>
          </div>

          <ReportsContent />
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

export default Reports;
