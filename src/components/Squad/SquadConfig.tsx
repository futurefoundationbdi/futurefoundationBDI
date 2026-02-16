import React from 'react';
import { Calendar, ArrowRight, Shield, Clock, ArrowLeft, Users, Zap, Settings } from 'lucide-react';
import { ChallengeMode } from '../services/squadService';

interface SquadConfigProps {
  duration: number;
  setDuration: (val: number) => void;
  maxMembers: number;
  setMaxMembers: (val: number) => void;
  challengeMode: ChallengeMode; // Nouveau
  setChallengeMode: (val: ChallengeMode) => void; // Nouveau
  onConfirm: () => void;
  onBack: () => void;
}

export const SquadConfig = ({ 
  duration, setDuration, 
  maxMembers, setMaxMembers, 
  challengeMode, setChallengeMode, 
  onConfirm, onBack 
}: SquadConfigProps) => {
  
  const getEndDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + duration);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[80vh] bg-black text-white animate-in fade-in zoom-in duration-500">
      
      <div className="mb-6 bg-purple-900/30 text-purple-400 px-5 py-2 rounded-full flex items-center gap-2 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
        <Shield size={14} className="fill-purple-400/20" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Paramétrage de Mission</span>
      </div>

      <div className="w-full max-w-sm bg-[#0A0A0A] rounded-[40px] p-8 shadow-2xl border border-white/5 space-y-8 relative overflow-hidden">
        
        {/* --- SECTION 1 : TAILLE DE L'UNITÉ --- */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Users size={14} className="text-purple-500" />
            <p className="text-[10px] font-black uppercase text-white/40 tracking-widest italic">Capacité de l'Escouade</p>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => setMaxMembers(num)}
                className={`py-3 rounded-2xl font-black transition-all border ${
                  maxMembers === num 
                  ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                  : 'bg-black border-white/5 text-white/20 hover:border-white/20'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* --- SECTION 2 : ORIGINE DES DÉFIS (NOUVEAU) --- */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Zap size={14} className="text-purple-500" />
            <p className="text-[10px] font-black uppercase text-white/40 tracking-widest italic">Protocole de Défis</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setChallengeMode('SYSTEM')}
              className={`p-4 rounded-2xl border transition-all text-left relative overflow-hidden group ${
                challengeMode === 'SYSTEM' 
                ? 'bg-purple-600/20 border-purple-500 text-white' 
                : 'bg-black border-white/5 text-white/20 opacity-40 hover:opacity-100'
              }`}
            >
              <div className="flex flex-col gap-1 relative z-10">
                <p className="font-black uppercase italic text-[10px]">Système IA</p>
                <p className="text-[8px] uppercase font-bold opacity-60">Défis imposés</p>
              </div>
              {challengeMode === 'SYSTEM' && <div className="absolute top-0 right-0 p-2"><Settings size={10} className="animate-spin-slow" /></div>}
            </button>

            <button
              onClick={() => setChallengeMode('CUSTOM')}
              className={`p-4 rounded-2xl border transition-all text-left relative overflow-hidden group ${
                challengeMode === 'CUSTOM' 
                ? 'bg-purple-600/20 border-purple-500 text-white' 
                : 'bg-black border-white/5 text-white/20 opacity-40 hover:opacity-100'
              }`}
            >
              <div className="flex flex-col gap-1 relative z-10">
                <p className="font-black uppercase italic text-[10px]">Customisé</p>
                <p className="text-[8px] uppercase font-bold opacity-60">Choix libre</p>
              </div>
              {challengeMode === 'CUSTOM' && <div className="absolute top-0 right-0 p-2"><Zap size={10} /></div>}
            </button>
          </div>
          <p className="text-[8px] text-center text-white/20 uppercase font-bold px-4 leading-tight italic">
            {challengeMode === 'SYSTEM' 
              ? "L'IA génère les missions chaque matin à 05:00." 
              : "Le groupe choisit ses propres règles d'engagement."}
          </p>
        </div>

        {/* --- SECTION 3 : DURÉE --- */}
        <div className="space-y-6">
          <div className="bg-black rounded-[32px] p-6 text-center space-y-2 border border-white/5 shadow-inner">
            <div className="flex justify-center items-baseline gap-2">
              <span className="text-6xl font-black text-white tracking-tighter">{duration}</span>
              <span className="text-lg font-black text-purple-600 uppercase italic tracking-widest">Jours</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-white/40 pt-2 border-t border-white/5">
              <Clock size={10} className="text-purple-500" />
              <p className="text-[8px] font-black uppercase tracking-widest italic">Fin : {getEndDate()}</p>
            </div>
          </div>

          <div className="relative flex items-center px-1">
            <input 
              type="range" 
              min="7" 
              max="90" 
              step="1" 
              value={duration} 
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-purple-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4 pt-4">
          <button 
            onClick={onConfirm}
            className="w-full py-6 bg-white text-black font-black rounded-[24px] flex items-center justify-center gap-3 hover:bg-purple-500 hover:text-white active:scale-95 transition-all uppercase italic tracking-[0.2em] text-sm shadow-xl"
          >
            Sceller l'unité <ArrowRight size={18} />
          </button>
          
          <button 
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Retour
          </button>
        </div>
      </div>
    </div>
  );
};
