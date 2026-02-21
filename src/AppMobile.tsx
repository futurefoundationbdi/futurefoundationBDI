// src/AppMobile.tsx
import { useState, useEffect } from "react";
import AvatarSystem from "./components/AvatarSystem";

export default function AppMobile() {
  // État pour gérer le chargement (Splash Screen)
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simule un petit temps de chargement pour laisser le moteur mobile respirer
    const timer = setTimeout(() => setIsReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
        {/* Ton logo ou une icône de chargement stylée */}
        <div className="w-20 h-20 bg-purple-600 rounded-[22px] animate-pulse flex items-center justify-center shadow-[0_0_30px_rgba(147,51,234,0.5)]">
           <span className="text-white font-black text-2xl italic">SM</span>
        </div>
        <p className="mt-6 text-[10px] font-black text-purple-500 uppercase tracking-[0.5em] animate-bounce">
          Initialisation...
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#050505] overflow-hidden select-none">
      {/* On appelle le Hall directement */}
      <AvatarSystem onBack={() => {
        // Dans l'APK, on empêche de quitter pour ne pas tomber sur une page vide
        console.log("Retour bloqué dans l'APK");
      }} />

      <style>{`
        /* Désactive le scroll rebondissant sur iPhone/Android */
        html, body { 
          overflow: hidden !important; 
          position: fixed;
          width: 100%;
          height: 100%;
          background: #050505;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
}