import React from 'react';
import { Calendar, ArrowRight, Shield, Clock } from 'lucide-react';

interface SquadConfigProps {
  duration: number;
  setDuration: (val: number) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export const SquadConfig = ({ duration, setDuration, onConfirm, onBack }: SquadConfigProps) => {
  
  // Calculer la date de fin approximative
  const getEndDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + duration);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[80vh] animate-in fade-in zoom-in duration-500">
      
      {/* Badge de configuration */}
      <div className="mb-8 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full flex items-center gap-2">
        <Shield size={14} className="fill-purple-700" />
        <span className="text-[10px] font-black uppercase tracking-widest">Initialisation de l'Unité</span>
      </div>

      <div className="w-full max-w-sm bg-white rounded-[40px] p-8 shadow-2xl shadow-purple-900/10 border border-slate-100 space-y-8">
        
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-black text-slate-900 uppercase italic leading-none">Plan de Mission</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Définissez la durée de l'engagement</p>
        </div>

        {/* Affichage de la durée sélectionnée */}
        <div className="bg-slate-50 rounded-[32px] p-6 text-center space-y-1 border border-slate-50">
          <div className="flex justify-center items-baseline gap-2">
            <span className="text-6xl font-black text-slate-900 tracking-tighter">{duration}</span>
            <span className="text-lg font-black text-purple-600 uppercase italic">Jours</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <Clock size={12} />
            <p className="text-[9px] font-bold uppercase">Fin prévue : {getEndDate()}</p>
          </div>
        </div>

        {/* Slider stylisé */}
        <div className="space-y-4">
          <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase italic px-1">
            <span>Minimum (1 sem)</span>
            <span>Maximum (3 mois)</span>
          </div>
          
          <div className="relative flex items-center">
            <input 
              type="range" 
              min="7" 
              max="90" 
              step="1" 
              value={duration} 
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-purple-600 focus:outline-none"
            />
          </div>

          {/* Marqueurs visuels */}
          <div className="flex justify-between px-1">
            {[7, 30, 60, 90].map((mark) => (
              <div key={mark} className="flex flex-col items-center gap-1">
                <div className={`w-1 h-1 rounded-full ${duration >= mark ? 'bg-purple-600' : 'bg-slate-200'}`} />
                <span className="text-[8px] font-bold text-slate-300">{mark}j</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bouton de confirmation */}
        <div className="space-y-4 pt-2">
          <button 
            onClick={onConfirm}
            className="w-full py-6 bg-black text-white font-black rounded-[24px] flex items-center justify-center gap-3 hover:bg-slate-800 active:scale-95 transition-all uppercase italic tracking-widest text-sm shadow-xl shadow-slate-200"
          >
            Confirmer la durée <ArrowRight size={18} />
          </button>
          
          <button 
            onClick={onBack}
            className="w-full text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-500 transition-colors"
          >
            Annuler et retourner
          </button>
        </div>

      </div>

      {/* Note de bas de page style APK Me+ */}
      <p className="mt-8 text-[9px] text-slate-400 text-center max-w-[250px] font-medium leading-relaxed uppercase">
        Une fois validée, la durée ne pourra plus être modifiée par les membres de l'escouade.
      </p>
    </div>
  );
};
