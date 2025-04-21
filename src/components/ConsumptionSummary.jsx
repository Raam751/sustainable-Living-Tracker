
import React from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Droplet, Activity } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { useSustainability } from "../../context/SustainabilityContext";

export const ConsumptionSummary = () => {
  const { getTotalConsumption } = useSustainability();
  
  // Sample data - in a real app, this would come from the sustainability context
  const data = [
    { name: "Jan", water: 150, electricity: 200 },
    { name: "Feb", water: 130, electricity: 190 },
    { name: "Mar", water: 140, electricity: 180 },
    { name: "Apr", water: 120, electricity: 210 },
    { name: "May", water: 110, electricity: 220 },
    { name: "Jun", water: 100, electricity: 230 },
  ];

  // Metrics for display
  const metrics = [
    {
      id: "water",
      label: "Water",
      value: `${getTotalConsumption("water") || 0} gal`,
      change: "-5%",
      icon: <Droplet className="h-4 w-4" />,
      chartColor: "#0ea5e9"
    },
    {
      id: "electricity",
      label: "Electricity",
      value: `${getTotalConsumption("electricity") || 0} kWh`,
      change: "+2%",
      icon: <Activity className="h-4 w-4" />,
      chartColor: "#f59e0b"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {metrics.map((metric) => (
        <DashboardCard 
          key={metric.id}
          title={metric.label} 
          icon={metric.icon}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-sm text-muted-foreground">
                  {metric.change} from last month
                </p>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis hide />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey={metric.id} 
                  stroke={metric.chartColor} 
                  strokeWidth={2} 
                  dot={{ r: 2 }} 
                  activeDot={{ r: 4 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      ))}
    </div>
  );
};
