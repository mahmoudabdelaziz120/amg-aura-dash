import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import DigitalTwin from "./pages/DigitalTwin";
import Safety from "./pages/Safety";
import Fleet from "./pages/Fleet";
import DrivingBehavior from "./pages/DrivingBehavior";
import DriversTeams from "./pages/DriversTeams";
import PitStop from "./pages/PitStop";
import TechUpdates from "./pages/TechUpdates";
import AIIntelligence from "./pages/AIIntelligence";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/digital-twin" element={<DigitalTwin />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/driving-behavior" element={<DrivingBehavior />} />
            <Route path="/drivers-teams" element={<DriversTeams />} />
            <Route path="/pit-stop" element={<PitStop />} />
            <Route path="/tech-updates" element={<TechUpdates />} />
            <Route path="/ai-intelligence" element={<AIIntelligence />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
