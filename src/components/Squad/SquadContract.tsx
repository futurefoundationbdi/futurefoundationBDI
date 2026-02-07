import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const SquadContract = ({ squadId, onSign }: { squadId: string, onSign: () => void }) => (
  <div className="max-w-xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="bg-white/5 border border-purple-500/20 rounded-[40px] p-8 space-y-8 backdrop-blur-xl">
      <div className="text-center">
        <ShieldCheck size={40} className="mx-auto text-purple-500 mb-4" />
        <h3 className="text-2xl font-black uppercase italic text-white">Contrat d'Élite</h3>
        <p className="text-[10px] text-purple-400 font-black tracking-widest mt-1">UNITÉ {squadId}</p>
      </div>

      <div className="space-y-4 text-[11px] font-medium leading-relaxed text-white/70 uppercase italic">
        <p className="flex gap-3"><span className="text-purple-500">01.</span> Le challenge dure 31 jours sans interruption.</p>
        <p className="flex gap-3"><span className="text-purple-500">02.</span> Si un membre échoue, le niveau de toute l'unité stagne.</p>
        <p className="flex gap-3"><span className="text-purple-500">03.</span> 7 jours d'inactivité entraînent l'exclusion et l'échec du groupe.</p>
        <p className="flex gap-3 text-white/90 font-bold bg-white/5 p-3 rounded-xl border border-white/5 italic">
          Le compte à rebours global débutera demain à 00:00 pour tous les membres.
        </p>
      </div>

      <button 
        onClick={onSign}
        className="w-full py-6 bg-purple-600 text-white font-black rounded-3xl shadow-2xl shadow-purple-900/40 hover:scale-[1.02] transition-transform uppercase"
      >
        SCELLER MON ENGAGEMENT
      </button>
    </div>
  </div>
);
