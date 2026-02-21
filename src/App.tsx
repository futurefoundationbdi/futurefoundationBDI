// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { App as CapApp } from '@capacitor/app'; 

// IMPORT DE TON NOUVEAU COEUR ISOLÉ
import AppMobile from "./AppMobile"; 
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-[#050505]">
    <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
  </div>
);

const App = () => {
  // Gestion du bouton "Retour" physique Android
  useEffect(() => {
    const backListener = CapApp.addListener('backButton', ({ canGoBack }) => {
      // Dans l'app isolée, si on est sur le Hall, on quitte l'app
      if (!canGoBack || window.location.pathname === "/") {
        CapApp.exitApp();
      } else {
        window.history.back();
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
              {/* LA ROUTE PRINCIPALE DE L'APK EST MAINTENANT APPMOBILE */}
              <Route path="/" element={<AppMobile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
