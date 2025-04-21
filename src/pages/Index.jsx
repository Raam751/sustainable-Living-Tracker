import { Leaf } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { ConsumptionSummary } from "@/components/dashboard/ConsumptionSummary";
import { CarbonFootprintSummary } from "@/components/dashboard/CarbonFootprintSummary";
import { SustainabilityTips } from "@/components/dashboard/SustainabilityTips";
import { SustainabilityProvider } from "@/context/SustainabilityContext";

const Index = () => {
  return (
    <SustainabilityProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome to your sustainable living tracker
              </p>
            </div>
            <div className="flex items-center mt-4 md:mt-0 bg-eco-100 text-eco-800 px-4 py-2 rounded-lg">
              <Leaf className="mr-2 h-5 w-5" />
              <span className="font-medium">Your Sustainability Hub</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">Consumption Overview</h2>
              <ConsumptionSummary />
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Carbon Footprint Analysis</h2>
              <CarbonFootprintSummary />
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Sustainability Tips</h2>
              <SustainabilityTips />
            </section>
          </div>
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

export default Index;
