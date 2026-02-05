import React, { useState, useEffect } from 'react';

// --- CONFIGURATION DES ARCHÉTYPES (7 Filles, 5 Garçons) ---
// Mise à jour des seeds pour une distinction claire Homme/Femme et labels réalistes
const AVATAR_ARCHETYPES = [
  // FILLES (Identité visuelle claire)
  { id: 'f1', seed: 'Aneka', label: 'Le Stratège', gender: 'F' },
  { id: 'f2', seed: 'Bella', label: 'a Geekette', gender: 'F' },
  { id: 'f3', seed: 'Clara', label: 'L\'Ambitieuse', gender: 'F' },
  { id: 'f4', seed: 'Eden', label: 'La Râleuse', gender: 'F' },
  { id: 'f5', seed: 'Fiona', label: 'L\'Influenceuse', gender: 'F' },
  { id: 'f6', seed: 'Grace', label: 'Le Visionnaire', gender: 'F' },
  { id: 'f7', seed: 'Jocelyn', label: 'Le Charmeur', gender: 'F' },
  // GARÇONS (Seeds avec traits masculins marqués : barbe, mâchoire, coiffure)
  { id: 'm1', seed: 'Nolan', label: 'Le Charmeur', gender: 'M' },
  { id: 'm2', seed: 'Ryker', label: 'La Rebelle', gender: 'M' },
  { id: 'm3', seed: 'Caleb', label: 'La flemmarde', gender: 'M' },
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

  const getAvatarStyle = (missedDays: number) => {
    if (missedDays >= 7) {
      return { 
        filter: 'grayscale(1) brightness(0.1) blur(8px)', 
        opacity: 0.3,
        transition: 'all 2s ease'
      };
    }
    
    const grayscale = (missedDays / 7) * 100;
    const brightness = 1 - (missedDays * 0.12);
    const sepia = missedDays * 10;
    
    return {
      filter: `grayscale(${grayscale}%) brightness(${brightness}) sepia(${sepia}%)`,
      transition: 'all 1s ease',
      transform: missedDays > 0 ? `scale(${1 - (missedDays * 0.02)})` : 'scale(1)'
    };
  };

  const handleCreate = () => {
    if (!userName.trim()) return alert("Veuillez entrer votre nom d'initié.");
    
    const archetype = AVATAR_ARCHETYPES.find(a => a.id === selectedId);
    const newAvatar = {
      name: userName,
      seed: archetype?.seed,
      label: archetype?.label,
      gender: archetype?.gender,
      level: 1,
      missedDays: 0, 
      health: 100,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('future_library_avatar', JSON.stringify(newAvatar));
    setAvatarData(newAvatar);
    setStep(2);
  };

  const resetAvatar = () => {
    if(window.confirm("Ton avatar va être supprimé et ton cycle de 31 jours sera réinitialisé. Es-tu sûr ?")) {
      localStorage.removeItem('future_library_avatar');
      setStep(1);
      setAvatarData(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-10 flex flex-col items-center justify-center">
      
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-emerald-500 transition-all z-50"
      >
        ← Retour au portail
      </button>

      <div className="max-w-6xl w-full">
        
        {step === 1 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">
                Choisis ton <span className="text-emerald-500">ADN numérique</span>
              </h2>
              <p className="text-white/40 text-sm max-w-md mx-auto italic">
                Séléctionne l'archétype qui te ressemble le plus pour entamer ta discipline.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {AVATAR_ARCHETYPES.map((arc) => (
                <div 
                  key={arc.id}
                  onClick={() => setSelectedId(arc.id)}
                  className={`relative group cursor-pointer rounded-2xl border-2 p-2 transition-all duration-500 ${
                    selectedId === arc.id 
                    ? 'border-emerald-500 bg-emerald-500/10 scale-105 shadow-[0_0_30px_rgba(16,185,129,0.2)]' 
                    : 'border-white/5 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <img 
                    src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${arc.seed}&backgroundColor=transparent`} 
                    alt={arc.label}
                    className="w-full h-auto drop-shadow-lg"
                  />
                  <div className="mt-2 text-center">
                    <p className={`text-[9px] font-black uppercase tracking-widest ${selectedId === arc.id ? 'text-emerald-400' : 'text-white/40'}`}>
                      {arc.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="max-w-md mx-auto flex flex-col gap-4">
              <input 
                type="text" 
                placeholder="ENTRE TON NOM ICI..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-center font-black uppercase tracking-widest focus:border-emerald-500 focus:bg-emerald-500/5 transition-all outline-none"
              />
              <button 
                onClick={handleCreate}
                className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all shadow-xl active:scale-95"
              >
                Initialiser l'Avatar
              </button>
            </div>
          </div>
        )}

        {step === 2 && avatarData && (
          <div className="max-w-2xl mx-auto text-center space-y-8 animate-in zoom-in-95 duration-700">
            
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarData.seed}&backgroundColor=transparent`} 
                  style={getAvatarStyle(avatarData.missedDays)}
                  className="w-72 h-72 md:w-96 md:h-96 mx-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                />
              </div>

              {avatarData.missedDays > 0 && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="bg-red-600/90 text-white font-black px-6 py-2 rounded-full text-[10px] uppercase animate-bounce shadow-2xl tracking-widest">
                    ALERTE : {avatarData.missedDays} JOUR(S) D'ABSENCE
                  </div>
                </div>
              )}

              <div 
                className={`absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full -z-10 transition-opacity duration-1000 ${avatarData.missedDays > 3 ? 'opacity-0' : 'opacity-100'}`}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                {avatarData.name}
              </h3>
              <div className="flex items-center justify-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-4 py-1 rounded-full border border-emerald-500/20">
                  {avatarData.label}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                  Phase d'Éveil
                </span>
              </div>
            </div>

            <div className="max-w-xs mx-auto space-y-2">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mb-1">
                <span>Vitalité de l'être</span>
                <span className={avatarData.missedDays > 4 ? 'text-red-500' : 'text-emerald-500'}>
                  {Math.max(0, 100 - (avatarData.missedDays * 14.2)).toFixed(0)}%
                </span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div 
                  className={`h-full transition-all duration-1000 ${avatarData.missedDays > 4 ? 'bg-red-600 shadow-[0_0_10px_#ef4444]' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'}`}
                  style={{ width: `${Math.max(0, 100 - (avatarData.missedDays * 14.2))}%` }}
                />
              </div>
              <p className="text-[10px] text-white/20 italic mt-4 leading-relaxed">
                {avatarData.missedDays >= 7 
                  ? "Dissolution imminente. La discipline a été rompue." 
                  : avatarData.missedDays > 0 
                  ? "Ton double s'efface. Agis maintenant pour restaurer ton éclat." 
                  : "Ton avatar est en pleine possession de ses moyens."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8 justify-center">
               <button 
                onClick={onBack}
                className="px-8 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-emerald-500 transition-all active:scale-95"
               >
                Accéder aux Défis
               </button>
               <button 
                onClick={resetAvatar}
                className="px-8 py-4 bg-white/5 border border-white/10 text-white/40 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all active:scale-95"
               >
                Réinitialiser l'ADN
               </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
