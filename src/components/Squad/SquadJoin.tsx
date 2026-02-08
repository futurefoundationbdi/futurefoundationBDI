import React from 'react';
import { Users, PlusCircle, ArrowLeft } from 'lucide-react';

interface SquadJoinProps {
  inputCode: string;
  setInputCode: (val: string) => void;
  onJoin: (id: string, isNew: boolean) => void;
  isLoading: boolean;
  error: string;
  onBack: () => void;
}

export const SquadJoin = ({ inputCode, setInputCode, onJoin, isLoading, error, onBack }: SquadJoinProps) => (
  <div className="flex flex-col items-center justify-center p-6 space-y-10 min-h-[80vh] animate-in zoom-in duration-500">
    <div className="text-center space-y-2">
      <div className="bg-purple-600 text-white w-16 h-16 rounded-[22px] flex items-center justify-center mx-auto shadow-lg shadow-purple-200 mb-4 rotate-3">
        <Users size={32} />
      </div>
      <h2 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter">Coalition</h2>
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">Discipline Collective</p>
    </div>

    <div className="w-full max-w-sm space-y-8">
      {/* Rejoindre */}
      <div className="space-y-3">
        <p className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Rejoindre une unité</p>
        <div className="relative">
          <input 
            type="text" placeholder="CODE DE L'UNITÉ" value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            className="w-full bg-white border border-slate-100 p-5 rounded-[24px] text-center font-bold outline-none focus:ring-2 ring-purple-500/20 transition-all text-slate-800 shadow-sm placeholder:text-slate-200"
          />
        </div>
        <button 
          onClick={() => onJoin(inputCode, false)} 
          disabled={isLoading || !inputCode}
          className="w-full py-5 bg-black text-white font-black rounded-[24px] shadow-xl shadow-slate-200 active:scale-95 transition-all uppercase italic text-sm"
        >
          {isLoading ? "LOCALISATION..." : "Infiltrer l'unité"}
        </button>
      </div>

      <div className="relative py-2 flex items-center justify-center">
        <div className="absolute w-full border-t border-slate-100"></div>
        <span className="relative bg-[#F8F9FF] px-4 text-[10px] font-black text-slate-300 uppercase italic">OU</span>
      </div>

      {/* Créer */}
      <div className="space-y-4">
        <button 
          onClick={() => onJoin("", true)} 
          className="w-full py-5 border-2 border-dashed border-purple-200 text-purple-600 font-black rounded-[24px] hover:bg-purple-50 transition-all uppercase text-sm flex items-center justify-center gap-3"
        >
          <PlusCircle size={18} /> Créer une escouade
        </button>
        <p className="text-[9px] text-slate-400 text-center font-bold uppercase leading-relaxed px-6">
          Générez un code et invitez jusqu'à 6 membres à vous suivre.
        </p>
      </div>
    </div>

    {error && (
      <div className="bg-red-50 text-red-500 p-4 rounded-2xl border border-red-100 animate-bounce">
        <p className="text-[10px] font-black uppercase italic">⚠️ {error}</p>
      </div>
    )}

    <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-purple-600 transition-colors">
      <ArrowLeft size={14} /> Retour au Hub
    </button>
  </div>
);
