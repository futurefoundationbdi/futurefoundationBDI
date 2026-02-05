import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    const savedAvatar = localStorage.getItem('future_library_avatar');
    const savedHistory = localStorage.getItem('quest_history');
    if (savedAvatar) {
      setAvatarData(JSON.parse(savedAvatar));
      setStep(2);
    }
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

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
    const messages = [
      "BIEN JOUÉ SPARTAN ! TA DISCIPLINE FAIT TA FORCE.",
      "QUÊTE TERMINÉE. LE SYSTÈME EST SATISFAIT.",
      "UN PAS DE PLUS VERS LA LÉGENDE. CONTINUE !",
      "PAS D'EXCUSES, QUE DES RÉSULTATS. BRAVO !",
      "TON AVATAR REPREND DES COULEURS. BIEN JOUÉ !",
      "DISCIPLINE DE FER. NE LÂCHE RIEN."
    ];
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString();

    const newData = {
      ...avatarData,
      level: avatarData.level + 1,
      missedDays: 0,
      lastValidation: now.toISOString()
    };
    
    const newLog = { date: dateString, time: timeString, level: newData.level };
    const updatedHistory = [newLog, ...history];
    
    setAvatarData(newData);
    setHistory(updatedHistory);
    localStorage.setItem('future_library_avatar', JSON.stringify(newData));
    localStorage.setItem('quest_history', JSON.stringify(updatedHistory));
    
    alert(messages[Math.floor(Math.random() * messages.length)]);
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

  const visuals = (() => {
    if (!avatarData) return {};
    const { missedDays, level } = avatarData;
    const grayscale = (missedDays / 7) * 100;
    const brightness = 1 - (missedDays * 0.12);
    let auraColor = 'rgba(16, 185, 129, 0.3)';
    if (level > 10) auraColor = 'rgba(6, 182, 212, 0.4)'; // Cyan Solo Leveling
    if (level > 25) auraColor = 'rgba(251, 191, 36, 0.5)';
    return {
      imgStyle: {
        filter: missedDays >= 7 ? 'grayscale(1) brightness(0.1) blur(8px)' : `grayscale(${grayscale}%) brightness(${brightness})`,
        transition: 'all 1s ease'
      },
      auraColor
    };
  })();

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 flex flex-col items-center justify-center font-sans overflow-x-hidden">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #06b6d4; border-radius: 10px; }
      `}</style>

      <button onClick={onBack} className="absolute top-8 left-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-cyan-400 transition-all z-50">
        ← Retour au portail
      </button>

      <div className="max-w-6xl w-full">
        {step === 1 && (
          <div className="space-y-10 animate-in fade-in duration-700">
            <div className="text-center space-y-2">
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase">L'Arène</h2>
              <p className="text-cyan-500 text-[10px] font-bold tracking-[0.5em] uppercase">Initialisation du Système</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {AVATAR_ARCHETYPES.map((arc) => (
                <div key={arc.id} onClick={() => setSelectedId(arc.id)} className={`cursor-pointer rounded-2xl border-2 p-2 transition-all ${selectedId === arc.id ? 'border-cyan-500 bg-cyan-500/10 scale-105 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : 'border-white/5 opacity-40'}`}>
                  <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${arc.seed}`} className="w-full h-auto" />
                  <p className="text-[8px] text-center font-black uppercase mt-2">{arc.label}</p>
                </div>
              ))}
            </div>
            <div className="max-w-xs mx-auto space-y-4">
              <input type="text" placeholder="NOM DU JOUEUR..." value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-center font-bold outline-none focus:border-cyan-500 transition-all" />
              <button onClick={handleCreate} className="w-full py-4 bg-cyan-600 text-black font-black uppercase text-xs rounded-xl hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20">Lancer l'Éveil</button>
            </div>
          </div>
        )}

        {step === 2 && avatarData && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-10 items-start animate-in zoom-in-95 duration-500">
            
            {/* GAUCHE : HISTORIQUE SCROLLABLE */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl h-[450px] flex flex-col">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-cyan-500 border-b border-white/10 pb-4 mb-4">Journal de Quête</h4>
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {history.length === 0 && <p className="text-white/20 text-[10px] italic text-center pt-10">Aucun enregistrement...</p>}
                {history.map((log, i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col gap-1 transition-all hover:border-cyan-500/30">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-cyan-400 tracking-tighter">LEVEL {log.level} COMPLETE</span>
                      <span className="text-[9px] opacity-40 font-mono tracking-tighter">{log.time}</span>
                    </div>
                    <div className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{log.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CENTRE : HUD SOLO LEVELING (CHRONO BLEU) */}
            <div className="flex flex-col items-center space-y-10">
              <div className="text-center">
                <div className="text-5xl md:text-7xl font-black text-cyan-400 font-mono tracking-tighter drop-shadow-[0_0_15px_rgba(6,182,212,0.6)] animate-pulse">
                  {timeLeft}
                </div>
                <p className="text-[9px] font-bold text-cyan-500/40 uppercase tracking-[0.5em] mt-3">Temps restant • Quête Journalière</p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-[100px] opacity-40 animate-pulse" style={{ backgroundColor: visuals.auraColor }} />
                <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarData.seed}`} style={visuals.imgStyle} className="w-64 h-64 md:w-80 md:h-80 relative z-10" />
                {avatarData.missedDays > 0 && (
                  <div className="absolute top-0 right-0 bg-red-600 px-4 py-1 rounded-full text-[10px] font-black animate-bounce shadow-2xl z-20">PÉNALITÉ: {avatarData.missedDays}J</div>
                )}
              </div>

              <button onClick={completeQuest} className="w-full max-w-xs py-5 bg-cyan-600 text-black font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl hover:bg-cyan-400 hover:scale-105 transition-all shadow-xl shadow-cyan-500/40 active:scale-95">
                Soumettre le Rapport
              </button>
            </div>

            {/* DROITE : STATS DU JOUEUR */}
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center space-y-4">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">{avatarData.name}</h3>
                <span className="inline-block px-4 py-1 bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">{avatarData.label}</span>
                <div className="pt-6 space-y-2 text-left">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span className="opacity-40">Progression Rang</span>
                    <span className="text-cyan-400">{Math.round((avatarData.level / 31) * 100)}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-1000" style={{ width: `${(avatarData.level / 31) * 100}%` }} />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl italic text-[11px] text-white/40 text-center leading-relaxed">
                {avatarData.missedDays >= 7 
                  ? "Sujet éliminé. La volonté a fait défaut." 
                  : avatarData.missedDays > 0 
                  ? "DANGER : Ton existence numérique s'effrite. Agis immédiatement." 
                  : "État optimal détecté. Ta détermination nourrit le système."}
              </div>

              <button onClick={resetAvatar} className="w-full py-4 text-[10px] font-black uppercase text-white/10 hover:text-red-500 transition-colors">Réinitialiser les données de combat</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
