
import React from "react";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Leaf } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { useSustainability } from "../../context/SustainabilityContext";

export const CarbonFootprintSummary = () => {
  const { getTotalCarbonFootprint } = useSustainability();
  
  // Sample data for the charts
  const lineData = [
    { month: "Jan", emissions: 42 },
    { month: "Feb", emissions: 38 },
    { month: "Mar", emissions: 35 },
    { month: "Apr", emissions: 30 },
    { month: "May", emissions: 33 },
    { month: "Jun", emissions: 28 },
  ];
  
  const pieData = [
    { name: "Transport", value: 45, color: "#10b981" },
    { name: "Home", value: 30, color: "#0ea5e9" },
    { name: "Food", value: 15, color: "#f59e0b" },
    { name: "Other", value: 10, color: "#8b5cf6" },
  ];
  
  const totalEmissions = getTotalCarbonFootprint() || 120;
  const monthlyAverage = Math.round(totalEmissions / 6);
  
  return (
    <div className="grid grid-cols-1 gap-4">
      <DashboardCard
        title="Carbon Footprint Overview"
        icon={<Leaf className="h-5 w-5" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-4">
              <p className="text-sm font-medium mb-1">Total CO2 Emissions</p>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">{totalEmissions}</span>
                <span className="ml-1 text-muted-foreground text-sm">kg CO2e</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {monthlyAverage} kg CO2e monthly average
              </p>
            </div>
            
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} kg CO2e`, "Emissions"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Emissions Trend</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [`${value} kg CO2e`, "Emissions"]} />
                  <Line
                    type="monotone"
                    dataKey="emissions"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};
