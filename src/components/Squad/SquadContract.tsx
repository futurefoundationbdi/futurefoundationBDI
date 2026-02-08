import React from 'react';
import { ShieldCheck, PenTool, AlertCircle, Check } from 'lucide-react';

interface SquadContractProps {
  squadId: string;
  duration: number;
  onSign: () => void;
}

export const SquadContract = ({ squadId, duration, onSign }: SquadContractProps) => {
  return (
    <div className="flex flex-col h-screen bg-black p-6 justify-center animate-in slide-in-from-bottom-10 duration-700">
      <div className="max-w-md mx-auto w-full bg-[#0A0A0A] p-8 rounded-[40px] shadow-[0_20px_50px_rgba(147,51,234,0.15)] border border-white/5 space-y-8 relative overflow-hidden">
        
        {/* Barre de décoration supérieure néon */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-900 via-purple-500 to-purple-900"></div>

        {/* En-tête du Contrat */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-purple-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 border border-purple-500/30">
            <ShieldCheck size={32} className="text-purple-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter">Pacte d'Unité</h2>
          <div className="bg-white/5 inline-block px-4 py-1 rounded-full border border-white/10">
            <p className="text-[10px] text-purple-400 font-black tracking-widest uppercase">SECTION : {squadId}</p>
          </div>
        </div>

        {/* Clauses de l'engagement (Style Tactique) */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase text-purple-500 tracking-widest ml-1">Protocoles d'engagement</h4>
          
          <div className="space-y-3">
            {[
              `Opération active pour une durée de ${duration} jours.`,
              "Lien neuronal : le succès dépend de l'effort collectif.",
              "Discipline stricte : validation quotidienne obligatoire.",
              "Échec critique : Tout abandon impacte l'unité entière."
            ].map((text, index) => (
              <div key={index} className="flex gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors">
                <div className="mt-0.5">
                  <Check size={14} className="text-purple-500 stroke-[3px]" />
                </div>
                <p className="text-[11px] font-bold text-white/70 uppercase leading-tight italic">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Zone de Signature Tactile */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <p className="text-[10px] font-black text-white/30 uppercase italic">Signature Biométrique</p>
            <PenTool size={12} className="text-purple-500" />
          </div>
          
          <div className="h-32 bg-black border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center relative group overflow-hidden transition-all hover:border-purple-500/50">
            <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.2em] group-hover:text-purple-500/30 transition-all">
              SCELLER ICI
            </span>
            {/* Simulation d'une zone de dessin */}
            <div className="absolute inset-0 cursor-crosshair active:bg-purple-500/5 transition-colors"></div>
            <div className="w-3/4 h-[1px] bg-white/5 absolute bottom-10"></div>
          </div>
        </div>

        {/* Alerte Risque */}
        <div className="flex gap-3 items-start bg-red-900/10 p-4 rounded-2xl border border-red-900/20">
          <AlertCircle size={16} className="text-red-500 shrink-0" />
          <p className="text-[9px] font-bold text-red-400 uppercase leading-relaxed">
            ALERTE : En scellant ce pacte, vous renoncez à l'abandon. Votre honneur est lié à celui de l'escouade.
          </p>
        </div>

        {/* Bouton d'action final */}
        <button 
          onClick={onSign}
          className="w-full py-6 bg-purple-600 text-white font-black rounded-[24px] shadow-[0_10px_30px_rgba(147,51,234,0.3)] active:scale-[0.98] hover:bg-purple-500 transition-all uppercase italic tracking-[0.2em] text-sm border border-purple-400/50"
        >
          Valider le protocole
        </button>
      </div>

      <p className="text-center mt-8 text-[9px] font-bold text-white/20 uppercase tracking-widest italic">
        Coalition Intelligence System • 2026
      </p>
    </div>
  );
};
