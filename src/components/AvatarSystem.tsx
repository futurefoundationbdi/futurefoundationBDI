import React, { useState, useEffect } from 'react';

// --- CONFIGURATION DES ARCHÉTYPES ---
const AVATAR_ARCHETYPES = [
  { id: 'f1', seed: 'Aneka', label: 'La Stratège', gender: 'F' },
  { id: 'f2', seed: 'Bella', label: 'La Geekette', gender: 'F' },
  { id: 'f3', seed: 'Clara', label: 'L\'Ambitieuse', gender: 'F' },
  { id: 'f4', seed: 'Eden', label: 'La Râleuse', gender: 'F' },
  { id: 'f5', seed: 'Fiona', label: 'L\'Influenceuse', gender: 'F' },
  { id: 'f6', seed: 'Grace', label: 'La Visionnaire', gender: 'F' },
  { id: 'f7', seed: 'Jocelyn', label: 'La Charmeuse', gender: 'F' },
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
  const [timeLeft, setTimeLeft] = useState<string>("24:00:00");
  const [history, setHistory] = useState<any[]>([]);

  // 1. CHARGEMENT INITIAL
  useEffect(() => {
    const savedAvatar = localStorage.getItem('future_library_avatar');
    const savedHistory = localStorage.getItem('quest_history');
    
    if (savedAvatar) {
      setAvatarData(JSON.parse(savedAvatar));
      setStep(2);
    }
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // 2. LOGIQUE DU CHRONO (SOLO LEVELING)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!avatarData || step !== 2) return;

      const now = new Date().getTime();
      const lastValidation = new Date(avatarData.lastValidation || avatarData.createdAt).getTime();
      const deadline = lastValidation + (24 * 60 * 60 * 1000);
      const distance = deadline - now;

      if (distance <= 0) {
        handlePenalty();
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [avatarData, step]);

  // 3. ACTIONS
  const handleCreate = () => {
    if (!userName.trim()) return alert("Hé ! Donne-nous ton nom.");
    const archetype = AVATAR_ARCHETYPES.find(a => a.id === selectedId);
    const newAvatar = {
      name: userName,
      seed: archetype?.seed,
      label: archetype?.label,
      level: 1,
      missedDays: 0,
      createdAt: new Date().toISOString(),
      lastValidation: new Date().toISOString()
    };
    setAvatarData(newAvatar);
    localStorage.setItem('future_library_avatar', JSON.stringify(newAvatar));
    setStep(2);
  };

  const completeQuest = () => {
    const newData = {
      ...avatarData,
      level: avatarData.level + 1,
      missedDays: 0,
      lastValidation: new Date().toISOString()
    };
    
    const newLog = { date: new Date().toLocaleDateString(), status: 'SUCCESS', level: newData.level };
    const updatedHistory = [newLog, ...history].slice(0, 5);
    
    setAvatarData(newData);
    setHistory(updatedHistory);
    localStorage.setItem('future_library_avatar', JSON.stringify(newData));
    localStorage.setItem('quest_history', JSON.stringify(updatedHistory));
    alert("DÉFI TERMINÉ. TU MONTES EN PUISSANCE !");
  };

  const handlePenalty = () => {
    const newData = { 
      ...avatarData, 
      missedDays: Math.min(7, avatarData.missedDays + 1), 
      lastValidation: new Date().toISOString() 
    };
    setAvatarData(newData);
    localStorage.setItem('future_library_avatar', JSON.stringify(newData));
  };

  const resetAvatar = () => {
    if(window.confirm("Tout supprimer ? Ta légende s'arrêtera ici.")) {
      localStorage.clear();
      setAvatarData(null);
      setHistory([]);
      setStep(1);
    }
  };

  // 4. STYLE VISUEL (AURA & MORT)
  const getVisuals = () => {
    if (!avatarData) return {};
    const { missedDays, level } = avatarData;
    
    const grayscale = (missedDays / 7) * 100;
    const brightness = 1 - (missedDays * 0.12);
    
    let auraColor = 'rgba(16, 185, 129, 0.3)'; // Vert
    if (level > 10) auraColor = 'rgba(59, 130, 246, 0.4)'; // Bleu
    if (level > 25) auraColor = 'rgba(251, 191, 36, 0.5)'; // Or

    return {
      imgStyle: {
        filter: missedDays >= 7 ? 'grayscale(1) brightness(0.1) blur(8px)' : `grayscale(${grayscale}%) brightness(${brightness})`,
        transition: 'all 1s ease'
      },
      auraColor
    };
  };

  const visuals = getVisuals();

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 flex flex-col items-center justify-center font-sans overflow-x-hidden">
      
      {/* HEADER */}
      <button onClick={onBack} className="absolute top-8 left-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-emerald-500 transition-all z-50">
        ← Retour au portail
      </button>

      <div className="max-w-6xl w-full">
        
        {/* STEP 1 : SELECTION SPARTAN */}
        {step === 1 && (
          <div className="space-y-10 animate-in fade-in duration-700">
            <div className="text-center space-y-2">
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase">L'Arène</h2>
              <p className="text-emerald-500 text-[10px] font-bold tracking-[0.5em] uppercase text-center">Choisis ton visage, Spartan</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {AVATAR_ARCHETYPES.map((arc) => (
                <div key={arc.id} onClick={() => setSelectedId(arc.id)} className={`cursor-pointer rounded-2xl border-2 p-2 transition-all ${selectedId === arc.id ? 'border-emerald-500 bg-emerald-500/10 scale-105' : 'border-white/5 opacity-40'}`}>
                  <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${arc.seed}`} className="w-full h-auto" />
                  <p className="text-[8px] text-center font-black uppercase mt-2">{arc.label}</p>
                </div>
              ))}
            </div>
            <div className="max-w-xs mx-auto space-y-4">
              <input type="text" placeholder="TON NOM..." value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-center font-bold outline-none focus:border-emerald-500" />
              <button onClick={handleCreate} className="w-full py-4 bg-emerald-500 text-black font-black uppercase text-xs rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20">Initialiser le système</button>
            </div>
          </div>
        )}

        {/* STEP 2 : INTERFACE SOLO LEVELING */}
        {step === 2 && avatarData && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-10 items-start animate-in zoom-in-95 duration-500">
            
            {/* GAUCHE : HISTORIQUE */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 border-b border-white/10 pb-2">Journal de bord</h4>
              <div className="space-y-3">
                {history.length === 0 && <p className="text-white/20 text-[10px] italic">Aucune mission accomplie...</p>}
                {history.map((log, i) => (
                  <div key={i} className="flex justify-between items-center text-[11px] bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="font-bold opacity-60">{log.date}</span>
                    <span className="text-emerald-400 font-black">LVL {log.level} ACCOMPLI</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CENTRE : CHRONO & AVATAR */}
            <div className="flex flex-col items-center space-y-10">
              <div className="text-center">
                <div className="text-5xl md:text-7xl font-black text-red-600 font-mono tracking-tighter drop-shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                  {timeLeft}
                </div>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.4em] mt-2">Délai avant pénalité système</p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-[100px] opacity-40 animate-pulse" style={{ backgroundColor: visuals.auraColor }} />
                <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarData.seed}`} style={visuals.imgStyle} className="w-64 h-64 md:w-80 md:h-80 relative z-10" />
                {avatarData.missedDays > 0 && (
                  <div className="absolute top-0 right-0 bg-red-600 px-4 py-1 rounded-full text-[10px] font-black animate-bounce shadow-2xl">ABSENT {avatarData.missedDays}J</div>
                )}
              </div>

              <button onClick={completeQuest} className="w-full max-w-xs py-5 bg-emerald-600 text-black font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl hover:bg-emerald-400 hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
                Valider ma Discipline
              </button>
            </div>

            {/* DROITE : STATS & INFOS */}
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center space-y-4">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter">{avatarData.name}</h3>
                <span className="inline-block px-4 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">{avatarData.label}</span>
                
                <div className="pt-6 space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span className="opacity-40">Niveau {avatarData.level} / 31</span>
                    <span>{Math.round((avatarData.level / 31) * 100)}%</span>
                  </div>
                  <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: `${(avatarData.level / 31) * 100}%` }} />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl italic text-[12px] text-white/50 text-center leading-relaxed">
                {avatarData.missedDays >= 7 
                  ? "Ton avatar a été effacé par le système. Recommence, Spartan." 
                  : avatarData.missedDays > 0 
                  ? "Reviens vite ! Ta discipline fane et ton avatar s'efface." 
                  : "Excellent. Ta force vitale est au maximum. Continue ainsi."}
              </div>

              <button onClick={resetAvatar} className="w-full py-4 text-[10px] font-black uppercase text-white/20 hover:text-red-500 transition-colors">Réinitialiser l'ADN</button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
