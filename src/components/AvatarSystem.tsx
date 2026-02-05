import React, { useState, useEffect } from 'react';

// --- CONFIGURATION DES ARCHÉTYPES ---
const AVATAR_ARCHETYPES = [
  // FILLES
  { id: 'f1', seed: 'Aneka', label: 'La Stratège', gender: 'F' },
  { id: 'f2', seed: 'Bella', label: 'La Geekette', gender: 'F' },
  { id: 'f3', seed: 'Clara', label: 'La Star', gender: 'F' },
  { id: 'f4', seed: 'Eden', label: 'La Râleuse', gender: 'F' },
  { id: 'f5', seed: 'Fiona', label: 'L\'Influenceuse', gender: 'F' },
  { id: 'f6', seed: 'Grace', label: 'L\'Ambitieuse', gender: 'F' },
  { id: 'f7', seed: 'Jocelyn', label: 'La Mystérieuse', gender: 'F' },
  // GARÇONS
  { id: 'm1', seed: 'Nolan', label: 'Le Charmeur', gender: 'M' },
  { id: 'm2', seed: 'Ryker', label: 'Le Rebelle', gender: 'M' },
  { id: 'm3', seed: 'Caleb', label: 'Le Visionnaire', gender: 'M' },
  { id: 'm4', seed: 'Bastian', label: 'Le Comics', gender: 'M' },
  { id: 'm5', seed: 'Gage', label: 'Le Bosseur', gender: 'M' },
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

  const getAvatarStyle = (missedDays: number) => {
    if (missedDays >= 7) return { filter: 'grayscale(1) brightness(0.1) blur(10px)', opacity: 0.3 };
    const grayscale = (missedDays / 7) * 100;
    const brightness = 1 - (missedDays * 0.12);
    return {
      filter: `grayscale(${grayscale}%) brightness(${brightness})`,
      transition: 'all 1s ease',
      transform: `scale(${1 + (avatarData?.level || 1) * 0.015})` // L'avatar grandit physiquement avec le niveau
    };
  };

  const handleCreate = () => {
    if (!userName.trim()) return alert("Écris ton nom de soldat !");
    const archetype = AVATAR_ARCHETYPES.find(a => a.id === selectedId);
    const newAvatar = {
      name: userName,
      seed: archetype?.seed,
      label: archetype?.label,
      level: 1, // Commencer au niveau 1
      missedDays: 0,
      health: 100,
    };
    localStorage.setItem('future_library_avatar', JSON.stringify(newAvatar));
    setAvatarData(newAvatar);
    setStep(2);
  };

  const resetAvatar = () => {
    if(window.confirm("Tu vas tout perdre et mourir. Es-tu sûr ?")) {
      localStorage.removeItem('future_library_avatar');
      setStep(1);
      setAvatarData(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0505] text-white p-4 md:p-10 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* BOUTON RETOUR STYLE ARÈNE */}
      <button onClick={onBack} className="absolute top-6 left-6 text-[10px] font-black uppercase tracking-widest text-red-500/50 hover:text-red-500 z-50">
        ← SORTIR DE L'ARÈNE
      </button>

      <div className="max-w-6xl w-full z-10">
        
        {step === 1 && (
          <div className="space-y-12 animate-in fade-in duration-1000">
            <div className="text-center space-y-2">
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-red-900">
                L'INCARNATION
              </h2>
              <p className="text-red-500/60 text-xs font-bold tracking-[0.3em] uppercase">Choisis ton visage pour le combat</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {AVATAR_ARCHETYPES.map((arc) => (
                <div 
                  key={arc.id}
                  onClick={() => setSelectedId(arc.id)}
                  className={`relative cursor-pointer rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                    selectedId === arc.id ? 'border-red-600 bg-red-950/30 scale-105' : 'border-white/5 bg-black/40 hover:border-red-900'
                  }`}
                >
                  <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${arc.seed}`} alt="" className="w-full h-auto p-2" />
                  <div className={`p-2 text-center border-t ${selectedId === arc.id ? 'border-red-600' : 'border-transparent'}`}>
                    <p className="text-[10px] font-black uppercase">{arc.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="max-w-md mx-auto space-y-4">
              <input 
                type="text" 
                placeholder="TON NOM DE GUERRIER..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-white/5 border-b-2 border-red-900 p-4 text-center font-black uppercase focus:border-red-500 outline-none transition-all"
              />
              <button onClick={handleCreate} className="w-full py-5 bg-red-700 hover:bg-red-600 text-white font-black uppercase text-sm tracking-widest shadow-lg shadow-red-900/20 active:scale-95 transition-all">
                ENTRER DANS L'ARÈNE
              </button>
            </div>
          </div>
        )}

        {step === 2 && avatarData && (
          <div className="max-w-2xl mx-auto text-center space-y-10 animate-in zoom-in-95 duration-500">
            
            {/* L'AVATAR ET SON AURA */}
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-full blur-[100px] transition-all duration-1000"
                style={{ 
                  backgroundColor: avatarData.level > 20 ? '#fbbf24' : '#b91c1c',
                  opacity: avatarData.missedDays > 3 ? 0 : 0.4
                }}
              />
              <img 
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarData.seed}`} 
                style={getAvatarStyle(avatarData.missedDays)}
                className="w-64 h-64 md:w-80 md:h-80 mx-auto relative z-10 drop-shadow-[0_0_30px_rgba(0,0,0,1)]"
              />
              
              {avatarData.missedDays > 0 && (
                <div className="absolute top-0 inset-x-0 z-20">
                  <span className="bg-red-600 text-white font-black px-4 py-1 text-[10px] uppercase animate-pulse">
                    Tu t'es affaibli ! ({avatarData.missedDays} jours d'oubli)
                  </span>
                </div>
              )}
            </div>

            {/* INFOS ET MESSAGES SIMPLES */}
            <div className="space-y-2">
              <h3 className="text-5xl font-black uppercase italic">{avatarData.name}</h3>
              <p className="text-red-500 font-bold text-xs uppercase tracking-widest">Niveau {avatarData.level} — {avatarData.label}</p>
              
              <div className="pt-4">
                <p className="text-lg font-bold text-white/80 italic">
                  {avatarData.missedDays === 0 ? "Bravo ! Tu es fort. Continue comme ça !" : "Relève-toi ! Ne laisse pas ton avatar mourir."}
                </p>
              </div>
            </div>

            {/* BARRES DE PROGRESSION (ARÈNE) */}
            <div className="max-w-sm mx-auto space-y-6 bg-black/40 p-6 border border-white/5 rounded-2xl">
              {/* VITALITÉ */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span>Santé</span>
                  <span>{Math.max(0, 100 - (avatarData.missedDays * 14.2)).toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <div 
                    className="h-full bg-red-600 transition-all duration-1000"
                    style={{ width: `${Math.max(0, 100 - (avatarData.missedDays * 14.2))}%` }}
                  />
                </div>
              </div>

              {/* PROGRESSION VERS LE SOMMET */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span>Progression Totale</span>
                  <span>{Math.round((avatarData.level / 31) * 100)}%</span>
                </div>
                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-1">
                  <div 
                    className="h-full bg-gradient-to-r from-red-800 to-red-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                    style={{ width: `${(avatarData.level / 31) * 100}%` }}
                  />
                </div>
              </div>
              
              <p className="text-[10px] text-white/30 uppercase font-black">
                {avatarData.level < 31 ? `${31 - avatarData.level} jours avant la gloire` : "TU ES UNE LÉGENDE !"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button onClick={onBack} className="px-10 py-4 bg-white text-black font-black uppercase text-xs rounded-full hover:bg-red-600 hover:text-white transition-all">
                VOIR MES TÂCHES
               </button>
               <button onClick={resetAvatar} className="text-white/20 text-[10px] font-black uppercase hover:text-red-500 transition-all">
                Recommencer à zéro
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
