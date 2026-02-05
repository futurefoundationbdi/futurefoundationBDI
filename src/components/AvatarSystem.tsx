import React, { useState, useEffect } from 'react';

const AVATAR_ARCHETYPES = [
  // FILLES
  { id: 'f1', seed: 'Aneka', label: 'La Stratège', gender: 'F' },
  { id: 'f2', seed: 'Bella', label: 'La Geekette', gender: 'F' },
  { id: 'f3', seed: 'Clara', label: 'L\'Ambitieuse', gender: 'F' },
  { id: 'f4', seed: 'Eden', label: 'La Râleuse', gender: 'F' },
  { id: 'f5', seed: 'Fiona', label: 'L\'Influenceuse', gender: 'F' },
  { id: 'f6', seed: 'Grace', label: 'La Visionnaire', gender: 'F' },
  { id: 'f7', seed: 'Jocelyn', label: 'La Charmeuse', gender: 'F' },
  // GARÇONS
  { id: 'm1', seed: 'Nolan', label: 'La Star', gender: 'M' },
  { id: 'm2', seed: 'Ryker', label: 'Le Rebelle', gender: 'M' },
  { id: 'm3', seed: 'Caleb', label: 'Le Flemard', gender: 'M' },
  { id: 'm4', seed: 'Bastian', label: 'Le Comics', gender: 'M' },
  { id: 'm5', seed: 'Gage', label: 'L\'Audacieux', gender: 'M' },
];

interface AvatarSystemProps {
  onBack: () => void;
}

export default function AvatarSystem({ onBack }: AvatarSystemProps) {
  const [step, setStep] = useState(1); 
  const [selectedId, setSelectedId] = useState('f1');
  const [userName, setUserName] = useState("");
  const [avatarData, setAvatarData] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('future_library_avatar');
    if (saved) {
      const data = JSON.parse(saved);
      setAvatarData(data);
      setStep(2);
    }
  }, []);

  // --- LOGIQUE VISUELLE : COULEUR ET AURA ---
  const getVisualStatus = (missedDays: number, level: number) => {
    // 1. État de l'image (couleur)
    const grayscale = (missedDays / 7) * 100;
    const brightness = 1 - (missedDays * 0.12);
    
    const imgStyle = {
      filter: missedDays >= 7 
        ? 'grayscale(1) brightness(0.1) blur(8px)' 
        : `grayscale(${grayscale}%) brightness(${brightness})`,
      transition: 'all 1s ease'
    };

    // 2. Énergie de l'Aura (change selon le niveau)
    let auraColor = 'rgba(16, 185, 129, 0.3)'; // Vert au début
    if (level > 10) auraColor = 'rgba(59, 130, 246, 0.4)'; // Bleu au milieu
    if (level > 25) auraColor = 'rgba(251, 191, 36, 0.5)'; // Or à la fin

    return { imgStyle, auraColor };
  };

  const handleCreate = () => {
    if (!userName.trim()) return alert("Hé ! Il nous faut ton nom.");
    const archetype = AVATAR_ARCHETYPES.find(a => a.id === selectedId);
    const newAvatar = {
      name: userName,
      seed: archetype?.seed,
      label: archetype?.label,
      level: 1, // Change ce chiffre pour tester la barre et l'aura (ex: 15)
      missedDays: 0, 
    };
    localStorage.setItem('future_library_avatar', JSON.stringify(newAvatar));
    setAvatarData(newAvatar);
    setStep(2);
  };

  const resetAvatar = () => {
    if(window.confirm("Tu veux vraiment tout supprimer et redevenir un inconnu ?")) {
      localStorage.removeItem('future_library_avatar');
      setStep(1);
      setAvatarData(null);
    }
  };

  const visuals = avatarData ? getVisualStatus(avatarData.missedDays, avatarData.level) : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 flex flex-col items-center justify-center relative font-sans">
      
      <button onClick={onBack} className="absolute top-8 left-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-emerald-400 transition-all">
        ← Quitter l'Arène
      </button>

      <div className="max-w-5xl w-full">
        
        {/* --- CRÉATION --- */}
        {step === 1 && (
          <div className="space-y-10 animate-in fade-in duration-700">
            <div className="text-center">
              <h2 className="text-5xl font-black italic tracking-tighter mb-2">L'ARÈNE DES SPARTANS</h2>
              <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-[0.4em]">Forge ton identité</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {AVATAR_ARCHETYPES.map((arc) => (
                <div 
                  key={arc.id}
                  onClick={() => setSelectedId(arc.id)}
                  className={`cursor-pointer rounded-2xl border-2 p-2 transition-all ${
                    selectedId === arc.id ? 'border-emerald-500 bg-emerald-500/5 scale-105' : 'border-white/5 bg-white/5 opacity-40 hover:opacity-100'
                  }`}
                >
                  <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${arc.seed}`} className="w-full h-auto" />
                  <p className="text-[8px] text-center font-black uppercase mt-2 tracking-widest">{arc.label}</p>
                </div>
              ))}
            </div>

            <div className="max-w-xs mx-auto space-y-4">
              <input 
                type="text" placeholder="TON NOM..." 
                value={userName} onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-center font-bold outline-none focus:border-emerald-500"
              />
              <button onClick={handleCreate} className="w-full py-4 bg-emerald-500 text-black font-black uppercase text-xs rounded-xl hover:bg-emerald-400 transition-all">
                Commencer la formation
              </button>
            </div>
          </div>
        )}

        {/* --- DASHBOARD --- */}
        {step === 2 && avatarData && (
          <div className="max-w-md mx-auto flex flex-col items-center gap-8 animate-in zoom-in-95 duration-500">
            
            {/* AVATAR + AURA */}
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-full blur-[80px] opacity-50 animate-pulse transition-all duration-1000"
                style={{ backgroundColor: visuals?.auraColor }}
              />
              <img 
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarData.seed}`} 
                style={visuals?.imgStyle}
                className="w-64 h-64 relative z-10 drop-shadow-2xl"
              />
              {avatarData.missedDays > 0 && (
                <div className="absolute -top-4 -right-4 bg-red-600 px-3 py-1 rounded-lg text-[10px] font-black animate-bounce shadow-xl">
                   ABSENT : {avatarData.missedDays}J
                </div>
              )}
            </div>

            {/* INFOS NOM/NIVEAU */}
            <div className="text-center">
              <h3 className="text-4xl font-black uppercase italic">{avatarData.name}</h3>
              <p className="text-emerald-500 font-bold text-[10px] tracking-widest uppercase">Niveau {avatarData.level} • {avatarData.label}</p>
            </div>

            {/* BARRE DE PROGRESSION */}
            <div className="w-full space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-white/40">Objectif 31 jours</span>
                <span>{Math.round((avatarData.level / 31) * 100)}%</span>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full border border-white/10 overflow-hidden p-[2px]">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all duration-1000"
                  style={{ width: `${(avatarData.level / 31) * 100}%` }}
                />
              </div>
            </div>

            {/* MESSAGE D'ENCOURAGEMENT CLAIR */}
            <div className="text-center px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-sm text-white/80 italic">
                {avatarData.missedDays >= 7 
                  ? "Game Over. Ton avatar est mort... Recommence et sois plus fort." 
                  : avatarData.missedDays > 0 
                  ? "Hé ! Ton avatar perd ses couleurs. Reviens vite faire ton défi !" 
                  : avatarData.level >= 30 
                  ? "Incroyable. Tu es presque une légende. Ne lâche rien !"
                  : "C'est bien, tu avances. Chaque jour compte pour devenir un Spartan."}
              </p>
            </div>

            <div className="flex gap-4 w-full">
               <button onClick={onBack} className="flex-1 py-4 bg-white text-black font-black uppercase text-[10px] tracking-tighter rounded-xl hover:bg-emerald-500 transition-all">
                Mes Défis
               </button>
               <button onClick={resetAvatar} className="px-6 py-4 bg-white/5 border border-white/10 text-white/20 font-black uppercase text-[10px] rounded-xl hover:text-red-500 transition-all">
                Reset
               </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
