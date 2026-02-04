import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Chatbot from "./components/Chatbot";

// Utilisation de lazy pour charger les pages uniquement quand nécessaire
const Index = lazy(() => import("./pages/Index"));
const Success = lazy(() => import("./pages/Success"));
const AvatarPage = lazy(() => import("./pages/AvatarPage")); // Nouvelle page de l'avatar
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Petit composant de chargement simple pendant que la page arrive
const PageLoader = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Route pour la confirmation de don */}
            <Route path="/success" element={<Success />} />

            {/* Route pour l'expérience Avatar & Sanctuaire */}
            <Route path="/mon-avatar" element={<AvatarPage />} />

            {/* CATCH-ALL ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        
        {/* Chatbot global */}
        <Chatbot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
