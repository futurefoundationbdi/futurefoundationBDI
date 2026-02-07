import React from 'react';

interface SquadJoinProps {
  inputCode: string;
  setInputCode: (val: string) => void;
  onJoin: (id: string, isNew: boolean) => void;
  isLoading: boolean;
  error: string;
  onBack: () => void;
}

export const SquadJoin = ({ inputCode, setInputCode, onJoin, isLoading, error, onBack }: SquadJoinProps) => (
  <div className="flex flex-col items-center justify-center p-6 space-y-10 min-h-[70vh] animate-in zoom-in duration-500">
    <div className="text-center space-y-3">
      <h2 className="text-6xl font-black italic uppercase text-transparent bg-clip-text bg-gradient-to-b from-purple-400 to-purple-800">Coalition</h2>
      <p className="text-[10px] text-white/30 uppercase tracking-[0.4em]">Discipline Collective • 31 Jours</p>
    </div>

    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2">
        <p className="text-[9px] font-black text-purple-500 uppercase ml-2 italic">Intégrer une unité existante :</p>
        <input 
          type="text" placeholder="ENTRER LE CODE..." value={inputCode}
          onChange={(e) => setInputCode(e.target.value.toUpperCase())}
          className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl text-center font-bold outline-none focus:border-purple-500 transition-all text-white"
        />
        <button onClick={() => onJoin(inputCode, false)} disabled={isLoading}
          className="w-full py-5 bg-purple-600 text-white font-black rounded-3xl shadow-xl shadow-purple-900/20 active:scale-95 transition-all">
          {isLoading ? "VÉRIFICATION..." : "INFILTRER"}
        </button>
      </div>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
        <div className="relative flex justify-center text-[8px] font-black uppercase text-white/10 bg-black px-4 italic">OU</div>
      </div>

      <div className="space-y-2 text-center">
        <button onClick={() => onJoin("", true)} className="w-full py-4 border border-purple-500/30 text-purple-400 font-black rounded-3xl hover:bg-purple-500/10 transition-all uppercase text-xs">
          Créer ma propre unité
        </button>
        <p className="text-[8px] text-white/20 uppercase tracking-widest leading-relaxed px-4">Génère un code unique et invite tes alliés (Max 6)</p>
      </div>
    </div>
    {error && <p className="text-red-500 text-[10px] font-black animate-pulse uppercase italic">⚠️ {error}</p>}
    <button onClick={onBack} className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">← Retour Hub</button>
  </div>
);
