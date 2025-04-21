
import React from "react";
import { Lightbulb } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { useSustainability } from "../../context/SustainabilityContext";
import { Badge } from "../ui/badge";

export const SustainabilityTips = () => {
  const { sustainabilityTips } = useSustainability();
  
  // Get random tips to display
  const getRandomTips = (count) => {
    const shuffled = [...sustainabilityTips].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  const displayTips = getRandomTips(3);
  
  // Impact badge color
  const getImpactColor = (impact) => {
    if (impact === "high") return "bg-eco-600";
    if (impact === "medium") return "bg-eco-400";
    return "bg-eco-200 text-eco-800";
  };

  return (
    <DashboardCard 
      title="Sustainability Tips" 
      icon={<Lightbulb className="h-5 w-5" />}
    >
      <div className="space-y-4">
        {displayTips.map((tip) => (
          <div key={tip.id} className="flex items-start space-x-3 p-3 rounded-md bg-muted/50">
            <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium capitalize">{tip.category}</span>
                <Badge className={getImpactColor(tip.impact)}>
                  {tip.impact} impact
                </Badge>
              </div>
              <p className="text-sm">{tip.tip}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};
