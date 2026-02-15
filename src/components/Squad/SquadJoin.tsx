import React from 'react';
import { Users, PlusCircle, ArrowLeft, Shield } from 'lucide-react';

interface SquadJoinProps {
  inputCode: string;
  setInputCode: (val: string) => void;
  onJoin: (id: string, isNew: boolean) => void;
  isLoading: boolean;
  error: string;
  onBack: () => void;
}

export const SquadJoin = ({ inputCode, setInputCode, onJoin, isLoading, error, onBack }: SquadJoinProps) => (
  <div className="flex flex-col items-center justify-center p-6 space-y-10 min-h-[80vh] bg-black text-white animate-in zoom-in duration-500">
    
    {/* En-tête Tactique */}
    <div className="text-center space-y-3">
      <div className="bg-purple-600 text-white w-16 h-16 rounded-[22px] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(147,51,234,0.3)] mb-4 rotate-3 border border-purple-400">
        <Users size={32} />
      </div>
      <h2 className="text-5xl font-black italic uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-800 tracking-tighter">
        Coalition
      </h2>
      <div className="flex items-center justify-center gap-2">
        <span className="h-[1px] w-8 bg-purple-900"></span>
        <p className="text-[10px] text-purple-500 font-black uppercase tracking-[0.3em]">Discipline Collective</p>
        <span className="h-[1px] w-8 bg-purple-900"></span>
      </div>
    </div>

    <div className="w-full max-w-sm space-y-8">
      {/* SECTION : REJOINDRE */}
      <div className="space-y-3">
        <p className="text-[10px] font-black text-purple-400 uppercase ml-2 italic tracking-widest">Infiltrer une unité existante :</p>
        <div className="relative">
          <input 
            type="text" 
            placeholder="ENTRER LE CODE D'ACCÈS..." 
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            // MODIFICATION ICI : Ajout du bounce et de la bordure rouge si erreur
            className={`w-full bg-white/5 border ${error ? 'border-red-500 animate-bounce' : 'border-white/10'} p-5 rounded-[24px] text-center font-black outline-none focus:border-purple-500 focus:ring-1 ring-purple-500/50 transition-all text-white shadow-inner placeholder:text-white/10 uppercase`}
          />
        </div>
        <button 
          onClick={() => onJoin(inputCode, false)} 
          disabled={isLoading || !inputCode}
          className="w-full py-5 bg-purple-600 text-white font-black rounded-[24px] shadow-xl shadow-purple-900/40 active:scale-95 transition-all uppercase italic text-sm tracking-widest disabled:opacity-50 disabled:bg-slate-800"
        >
          {isLoading ? "LOCALISATION EN COURS..." : "LANCER L'INFILTRATION"}
        </button>
      </div>

      {/* SÉPARATEUR */}
      <div className="relative py-2 flex items-center justify-center">
        <div className="absolute w-full border-t border-white/5"></div>
        <span className="relative bg-black px-4 text-[10px] font-black text-white/20 uppercase italic tracking-widest">OU</span>
      </div>

      {/* SECTION : CRÉER */}
      <div className="space-y-4">
        {/* MODIFICATION ICI : Le bouton "Fonder" peut aussi bénéficier du bounce s'il y a une erreur d'ADN */}
        <button 
          onClick={() => onJoin("", true)} 
          className={`w-full py-5 border-2 border-dashed ${error ? 'border-red-500 animate-bounce' : 'border-purple-900/50'} text-purple-400 font-black rounded-[24px] hover:bg-purple-900/20 hover:border-purple-500 transition-all uppercase text-sm flex items-center justify-center gap-3 italic`}
        >
          <PlusCircle size={18} /> Fonder une escouade
        </button>
        <p className="text-[9px] text-white/30 text-center font-bold uppercase leading-relaxed px-6 tracking-tight">
          Générez un code unique et invitez vos alliés à sceller leur destin avec le vôtre.
        </p>
      </div>
    </div>

    {/* ERREUR TACTIQUE */}
    {error && (
      <div className="bg-red-950/30 text-red-500 p-4 rounded-2xl border border-red-900/50 animate-in fade-in slide-in-from-bottom-2">
        <p className="text-[10px] font-black uppercase italic flex items-center gap-2">
            ⚠️ ALERTE : {error}
        </p>
      </div>
    )}

    {/* RETOUR */}
    <button 
      onClick={onBack} 
      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-purple-500 transition-colors"
    >
      <ArrowLeft size={14} /> Abandonner et retourner au Hub
    </button>
  </div>
);
