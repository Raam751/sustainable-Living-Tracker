import { createContext, useContext, useState } from 'react';

const SustainabilityContext = createContext();

export function SustainabilityProvider({ children }) {
  const [consumptionData, setConsumptionData] = useState([
    { id: 1, category: "water", amount: 150, date: "2025-01-05" },
    { id: 2, category: "electricity", amount: 200, date: "2025-01-07" },
    { id: 3, category: "water", amount: 130, date: "2025-02-05" },
    { id: 4, category: "electricity", amount: 190, date: "2025-02-08" },
    { id: 5, category: "water", amount: 140, date: "2025-03-06" },
    { id: 6, category: "electricity", amount: 180, date: "2025-03-11" },
    { id: 7, category: "water", amount: 120, date: "2025-04-10" },
    { id: 8, category: "electricity", amount: 210, date: "2025-04-12" },
    { id: 9, category: "water", amount: 110, date: "2025-05-09" },
    { id: 10, category: "electricity", amount: 220, date: "2025-05-13" },
    { id: 11, category: "water", amount: 100, date: "2025-06-02" },
    { id: 12, category: "electricity", amount: 230, date: "2025-06-04" }
  ]);
  
  const [carbonFootprintData, setCarbonFootprintData] = useState([
    { id: 1, category: "transportation", subcategory: "car", amount: 200, carbonEmission: 50, date: "2025-01-08" },
    { id: 2, category: "food", subcategory: "meat", amount: 4, carbonEmission: 60, date: "2025-01-10" },
    { id: 3, category: "household", subcategory: "electricity", amount: 40, carbonEmission: 12, date: "2025-01-13" },
    { id: 4, category: "transportation", subcategory: "train", amount: 100, carbonEmission: 5, date: "2025-02-02" },
    { id: 5, category: "food", subcategory: "dairy", amount: 10, carbonEmission: 20, date: "2025-02-14" },
    { id: 6, category: "household", subcategory: "heating", amount: 25, carbonEmission: 10, date: "2025-03-02" },
    { id: 7, category: "transportation", subcategory: "bus", amount: 80, carbonEmission: 8, date: "2025-03-12" },
    { id: 8, category: "food", subcategory: "vegetables", amount: 20, carbonEmission: 10, date: "2025-04-05" },
    { id: 9, category: "household", subcategory: "water", amount: 180, carbonEmission: 0.18, date: "2025-04-10" },
    { id: 10, category: "transportation", subcategory: "car", amount: 110, carbonEmission: 27.5, date: "2025-05-11" },
    { id: 11, category: "food", subcategory: "grains", amount: 12, carbonEmission: 9.6, date: "2025-05-15" },
    { id: 12, category: "household", subcategory: "electricity", amount: 25, carbonEmission: 7.5, date: "2025-06-01" }
  ]);
  
  const [sustainabilityTips] = useState([
    {
      id: 1,
      category: "energy",
      tip: "Switch to LED bulbs to reduce electricity consumption.",
      impact: "high"
    },
    {
      id: 2,
      category: "water",
      tip: "Fix leaky faucets and install water-efficient fixtures.",
      impact: "medium"
    },
    {
      id: 3,
      category: "waste",
      tip: "Start composting kitchen waste.",
      impact: "medium"
    },
    {
      id: 4,
      category: "energy",
      tip: "Unplug electronic devices when not in use to prevent phantom energy usage.",
      impact: "medium"
    },
    {
      id: 5,
      category: "water",
      tip: "Collect rainwater for gardening purposes.",
      impact: "high"
    }
  ]);

  const addConsumptionEntry = (entry) => {
    setConsumptionData(prev => [...prev, { ...entry, id: Date.now() }]);
  };

  const addCarbonFootprintEntry = (entry) => {
    setCarbonFootprintData(prev => [...prev, { ...entry, id: Date.now() }]);
  };

  const getTotalConsumption = (category) => {
    return consumptionData
      .filter(entry => entry.category === category)
      .reduce((sum, entry) => sum + entry.amount, 0);
  };

  const getRecentConsumptionTrend = (category, count) => {
    return consumptionData
      .filter(entry => entry.category === category)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-count);
  };

  const getTotalCarbonFootprint = () => {
    return carbonFootprintData.reduce((sum, entry) => sum + entry.carbonEmission, 0);
  };

  return (
    <SustainabilityContext.Provider value={{
      consumptionData,
      carbonFootprintData,
      sustainabilityTips,
      addConsumptionEntry,
      addCarbonFootprintEntry,
      getTotalConsumption,
      getRecentConsumptionTrend,
      getTotalCarbonFootprint
    }}>
      {children}
    </SustainabilityContext.Provider>
  );
}

export function useSustainability() {
  const context = useContext(SustainabilityContext);
  if (!context) {
    throw new Error('useSustainability must be used within a SustainabilityProvider');
  }
  return context;
}
