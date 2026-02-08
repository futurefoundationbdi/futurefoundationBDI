import React from 'react';
import { ShieldCheck, PenTool, AlertCircle, Check } from 'lucide-react';

interface SquadContractProps {
  squadId: string;
  duration: number;
  onSign: () => void;
}

export const SquadContract = ({ squadId, duration, onSign }: SquadContractProps) => {
  return (
    <div className="flex flex-col h-screen bg-[#F8F9FF] p-6 justify-center animate-in slide-in-from-bottom-10 duration-700">
      <div className="max-w-md mx-auto w-full bg-white p-8 rounded-[40px] shadow-2xl shadow-purple-900/5 border border-slate-100 space-y-8 relative overflow-hidden">
        
        {/* Barre de décoration supérieure */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 to-blue-500"></div>

        {/* En-tête du Contrat */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
            <ShieldCheck size={32} className="text-purple-600" />
          </div>
          <h2 className="text-2xl font-black italic uppercase text-slate-900">Pacte d'Unité</h2>
          <div className="bg-slate-50 inline-block px-4 py-1 rounded-full border border-slate-100">
            <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase">ID : {squadId}</p>
          </div>
        </div>

        {/* Clauses de l'engagement (Inspiré de l'APK Me+) */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase text-purple-600 tracking-widest ml-1">Clauses de l'engagement</h4>
          
          <div className="space-y-3">
            {[
              `Engagement total pour une durée de ${duration} jours.`,
              "Solidarité absolue : le succès dépend de l'effort collectif.",
              "Discipline quotidienne : validation obligatoire des tâches.",
              "En cas d'abandon, l'impact sera reporté sur toute l'unité."
            ].map((text, index) => (
              <div key={index} className="flex gap-3 bg-slate-50/50 p-3 rounded-2xl border border-slate-50">
                <div className="mt-0.5">
                  <Check size={14} className="text-green-500 stroke-[3px]" />
                </div>
                <p className="text-[11px] font-bold text-slate-600 uppercase leading-tight italic">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Zone de Signature Tactile */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <p className="text-[10px] font-black text-slate-400 uppercase italic">Signature électronique</p>
            <PenTool size={12} className="text-slate-300" />
          </div>
          
          <div className="h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center relative group overflow-hidden">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] group-hover:hidden transition-all">
              Signez ici
            </span>
            {/* Simulation d'une zone de dessin */}
            <div className="absolute inset-0 cursor-crosshair active:bg-purple-50/30 transition-colors"></div>
            <div className="w-3/4 h-[1px] bg-slate-200 absolute bottom-10"></div>
          </div>
        </div>

        {/* Information importante */}
        <div className="flex gap-3 items-start bg-orange-50 p-4 rounded-2xl border border-orange-100">
          <AlertCircle size={16} className="text-orange-500 shrink-0" />
          <p className="text-[9px] font-bold text-orange-700 uppercase leading-relaxed">
            Attention : En cliquant sur le bouton ci-dessous, vous validez votre entrée officielle dans le challenge. Aucun retour en arrière n'est possible.
          </p>
        </div>

        {/* Bouton d'action final */}
        <button 
          onClick={onSign}
          className="w-full py-6 bg-black text-white font-black rounded-[24px] shadow-xl shadow-slate-200 active:scale-[0.98] transition-all uppercase italic tracking-widest text-sm"
        >
          Sceller mon destin
        </button>
      </div>

      <p className="text-center mt-8 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
        Propulsé par le système de coalition • 2026
      </p>
    </div>
  );
};
