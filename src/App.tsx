import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Chatbot from "./components/Chatbot";

// Importation directe pour éviter tout délai sur la page principale de l'avatar
import AvatarPage from "./pages/AvatarPage"; 

// Pages chargées à la demande
const Index = lazy(() => import("./pages/Index"));
const Success = lazy(() => import("./pages/Success"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Loader élégant utilisant ta palette émeraude
const PageLoader = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-[#050505]">
    <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
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
            {/* Route Accueil */}
            <Route path="/" element={<Index />} />
            
            {/* Route Success (Donations) */}
            <Route path="/success" element={<Success />} />

            {/* Route Avatar (L'expérience immersive) */}
            <Route path="/mon-avatar" element={<AvatarPage />} />

            {/* Gestion de l'erreur 404 interne à React */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        
        {/* Le Chatbot reste accessible sur toutes les routes */}
        <Chatbot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
