// src/components/SquadMode.tsx
import React from 'react';

interface SquadModeProps {
  onBack: () => void;
}

export default function SquadMode({ onBack }: SquadModeProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 animate-in fade-in duration-700">
      <div className="w-20 h-20 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center mb-6">
        <span className="text-3xl">🛡️</span>
      </div>
      <h2 className="text-4xl font-black italic uppercase text-purple-500 tracking-tighter">Mode Escouade</h2>
      <p className="text-white/40 text-xs mt-4 uppercase tracking-[0.2em] font-bold">Initialisation du réseau de guilde...</p>
      
      <div className="mt-10 p-6 border border-white/5 bg-white/[0.02] rounded-3xl max-w-sm">
        <p className="text-[10px] text-white/60 leading-relaxed uppercase">
          Ce mode permettra bientôt de lier ton compte à d'autres chasseurs pour partager vos quêtes.
        </p>
      </div>

      <button 
        onClick={onBack} 
        className="mt-12 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-purple-400 transition-colors"
      >
        ← Retour au Hall
      </button>
    </div>
  );
}
