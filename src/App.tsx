import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { App as CapApp } from '@capacitor/app'; // Import pour gérer l'app native
import Chatbot from "./components/Chatbot";

import AvatarPage from "./pages/AvatarPage"; 

const Index = lazy(() => import("./pages/Index"));
const Success = lazy(() => import("./pages/Success"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-[#050505]">
    <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
  </div>
);

const App = () => {
  // --- LOGIQUE MOBILE : Gestion du bouton "Retour" sur Android ---
  useEffect(() => {
    // On écoute le bouton retour physique du téléphone
    const backListener = CapApp.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        CapApp.exitApp(); // Quitter l'app si on est à la racine
      } else {
        window.history.back(); // Revenir à la page précédente dans React Router
      }
    });

    return () => {
      backListener.then(l => l.remove());
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/success" element={<Success />} />
              <Route path="/mon-avatar" element={<AvatarPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Chatbot />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
