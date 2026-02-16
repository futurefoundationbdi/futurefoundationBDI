import React, { useState } from 'react';
import { Target, Plus, Zap } from 'lucide-react';

interface SquadCustomSelectorProps {
  onConfirm: (challenge: { label: string; points: number }) => void;
}

export const SquadCustomSelector = ({ onConfirm }: SquadCustomSelectorProps) => {
  const [label, setLabel] = useState("");
  const [points, setPoints] = useState(50);

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-[32px] p-6 space-y-4 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center gap-2 mb-2">
        <Target size={16} className="text-purple-500" />
        <p className="text-[10px] font-black uppercase text-white/40 tracking-widest italic">Édition du Défi Custom</p>
      </div>

      <input 
        type="text" 
        placeholder="EX: 1H DE CODE SANS PAUSE..."
        value={label}
        onChange={(e) => setLabel(e.target.value.toUpperCase())}
        className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white text-xs font-bold focus:border-purple-500 outline-none transition-all"
      />

      <div className="flex items-center justify-between bg-black/50 p-4 rounded-2xl border border-white/5">
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Récompense</span>
          <span className="text-xl font-black text-purple-500 italic">+{points} PTS</span>
        </div>
        <input 
          type="range" min="10" max="100" step="5"
          value={points}
          onChange={(e) => setPoints(parseInt(e.target.value))}
          className="w-1/2 accent-purple-600"
        />
      </div>

      <button 
        disabled={!label.trim()}
        onClick={() => onConfirm({ label, points })}
        className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase italic text-xs flex items-center justify-center gap-2 hover:bg-purple-500 hover:text-white disabled:opacity-20 transition-all"
      >
        Lancer le défi <Zap size={14} />
      </button>
    </div>
  );
};
