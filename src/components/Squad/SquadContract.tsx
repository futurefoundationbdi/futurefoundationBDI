import React from 'react';
import { ShieldCheck, AlertCircle, Check, X } from 'lucide-react';

interface SquadContractProps {
  squadId: string;
  duration: number;
  onSign: () => void;
  onBack: () => void;
}

export const SquadContract = ({ squadId, duration, onSign, onBack }: SquadContractProps) => {
  return (
    // CHANGEMENT ICI : min-h-screen et py-10 pour laisser respirer le contenu
    <div className="flex flex-col min-h-screen bg-black p-6 items-center justify-start overflow-y-auto animate-in slide-in-from-bottom-10 duration-700">
      <div className="max-w-md mx-auto w-full bg-[#0A0A0A] p-8 rounded-[40px] shadow-[0_20px_50px_rgba(147,51,234,0.15)] border border-white/5 space-y-8 relative overflow-hidden my-auto">
        
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-900 via-purple-500 to-purple-900"></div>

        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-purple-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 border border-purple-500/30">
            <ShieldCheck size={32} className="text-purple-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter">Pacte d'Unité</h2>
          <div className="bg-white/5 inline-block px-4 py-1 rounded-full border border-white/10">
            <p className="text-[10px] text-purple-400 font-black tracking-widest uppercase">SECTION : {squadId}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase text-purple-500 tracking-widest ml-1 text-center">Protocoles d'engagement</h4>
          <div className="space-y-3">
            {[
              `Opération active pour une durée de ${duration} jours.`,
              "Lien neuronal : le succès dépend de l'effort collectif.",
              "Discipline stricte : validation quotidienne obligatoire.",
              "Honneur et persévérance : aucun abandon toléré."
            ].map((text, index) => (
              <div key={index} className="flex gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                <Check size={14} className="text-purple-500 mt-0.5 shrink-0" />
                <p className="text-[11px] font-bold text-white/70 uppercase leading-tight italic">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 items-start bg-red-900/10 p-4 rounded-2xl border border-red-900/20">
          <AlertCircle size={16} className="text-red-500 shrink-0" />
          <p className="text-[9px] font-bold text-red-400 uppercase leading-relaxed">
            Attention : En agréant ce protocole, vous liez votre progression à celle de l'escouade.
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <button 
            onClick={onSign}
            className="w-full py-6 bg-purple-600 text-white font-black rounded-[24px] shadow-[0_10px_30px_rgba(147,51,234,0.3)] active:scale-95 transition-all uppercase italic tracking-widest text-sm border border-purple-400"
          >
            Agréer le protocole
          </button>
          
          <button 
            onClick={onBack}
            className="w-full py-2 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <X size={14} /> Annuler l'engagement
          </button>
        </div>
      </div>

      <p className="text-center mt-8 mb-8 text-[9px] font-bold text-white/20 uppercase tracking-widest italic">
        Coalition Intelligence System • 2026
      </p>
    </div>
  );
};
