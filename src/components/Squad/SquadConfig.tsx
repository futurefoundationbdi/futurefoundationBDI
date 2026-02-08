import React from 'react';
import { Calendar, ArrowRight, Shield, Clock, ArrowLeft } from 'lucide-react';

interface SquadConfigProps {
  duration: number;
  setDuration: (val: number) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export const SquadConfig = ({ duration, setDuration, onConfirm, onBack }: SquadConfigProps) => {
  
  // Calculer la date de fin pour renforcer l'aspect sérieux
  const getEndDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + duration);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[80vh] bg-black text-white animate-in fade-in zoom-in duration-500">
      
      {/* Badge de statut */}
      <div className="mb-8 bg-purple-900/30 text-purple-400 px-5 py-2 rounded-full flex items-center gap-2 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
        <Shield size={14} className="fill-purple-400/20" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Paramétrage de Mission</span>
      </div>

      <div className="w-full max-w-sm bg-[#0A0A0A] rounded-[40px] p-8 shadow-2xl border border-white/5 space-y-8 relative overflow-hidden">
        
        {/* Header de la carte */}
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-black text-white uppercase italic leading-none tracking-tighter">Plan d'Opération</h3>
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest italic">Définition de la fenêtre temporelle</p>
        </div>

        {/* Display central de la durée */}
        <div className="bg-black rounded-[32px] p-8 text-center space-y-2 border border-white/5 shadow-inner">
          <div className="flex justify-center items-baseline gap-2">
            <span className="text-7xl font-black text-white tracking-tighter animate-pulse">{duration}</span>
            <span className="text-xl font-black text-purple-600 uppercase italic tracking-widest">Jours</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-white/40 pt-2 border-t border-white/5">
            <Clock size={12} className="text-purple-500" />
            <p className="text-[9px] font-black uppercase tracking-widest italic">Échéance : {getEndDate()}</p>
          </div>
        </div>

        {/* Slider custom Dark Mode */}
        <div className="space-y-6">
          <div className="flex justify-between text-[10px] font-black text-white/20 uppercase italic px-1">
            <span>Minimum</span>
            <span>Objectif Max</span>
          </div>
          
          <div className="relative flex items-center">
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

          {/* Marqueurs tactiques */}
          <div className="flex justify-between px-1">
            {[7, 30, 60, 90].map((mark) => (
              <div key={mark} className="flex flex-col items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${duration >= mark ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'bg-white/10'}`} />
                <span className={`text-[9px] font-black transition-colors ${duration >= mark ? 'text-white' : 'text-white/20'}`}>{mark}j</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4 pt-4">
          <button 
            onClick={onConfirm}
            className="w-full py-6 bg-white text-black font-black rounded-[24px] flex items-center justify-center gap-3 hover:bg-purple-500 hover:text-white active:scale-95 transition-all uppercase italic tracking-[0.2em] text-sm shadow-xl"
          >
            Lancer le challenge <ArrowRight size={18} />
          </button>
          
          <button 
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Retour
          </button>
        </div>
      </div>

      <p className="mt-8 text-[9px] text-white/20 text-center max-w-[250px] font-black leading-relaxed uppercase italic tracking-tighter">
        Avertissement : La durée choisie engage l'ensemble des futurs membres de l'escouade.
      </p>
    </div>
  );
};
