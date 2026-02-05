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
  // NAVIGATION STATES
  const [view, setView] = useState<'hall' | 'solo'>('hall'); 
  const [step, setStep] = useState(1);
  const [selectedId, setSelectedId] = useState('f1');
  const [userName, setUserName] = useState("");
  const [avatarData, setAvatarData] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<string>("24:00:00");
  const [history, setHistory] = useState<any[]>([]);

  // 1. CHARGEMENT
  useEffect(() => {
    const savedAvatar = localStorage.getItem('future_library_avatar');
    const savedHistory = localStorage.getItem('quest_history');
    if (savedAvatar) {
      setAvatarData(JSON.parse(savedAvatar));
      setStep(2);
    }
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // 2. CHRONO SOLO
  useEffect(() => {
    const timer = setInterval(() => {
      if (!avatarData || view !== 'solo' || step !== 2) return;
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
  }, [avatarData, view, step]);

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
    const messages = ["BIEN JOUÉ SPARTAN !", "SYSTÈME SATISFAIT.", "UN PAS DE PLUS VERS LA LÉGENDE.", "DISCIPLINE DE FER."];
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString();

    const newData = { ...avatarData, level: avatarData.level + 1, missedDays: 0, lastValidation: now.toISOString() };
    const newLog = { date: dateString, time: timeString, level: newData.level };
    const updatedHistory = [newLog, ...history];
    
    setAvatarData(newData);
    setHistory(updatedHistory);
    localStorage.setItem('future_library_avatar', JSON.stringify(newData));
    localStorage.setItem('quest_history', JSON.stringify(updatedHistory));
    alert(messages[Math.floor(Math.random() * messages.length)]);
  };

  const handlePenalty = () => {
    const newData = { ...avatarData, missedDays: Math.min(7, avatarData.missedDays + 1), lastValidation: new Date().toISOString() };
    setAvatarData(newData);
    localStorage.setItem('future_library_avatar', JSON.stringify(newData));
  };

  const resetAvatar = () => {
    if(window.confirm("Tout supprimer ?")) {
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
    const glowLevel = Math.min(level * 2, 40); // L'aura augmente avec le niveau
    
    let auraColor = 'rgba(6, 182, 212, 0.3)'; 
    if (level > 10) auraColor = 'rgba(59, 130, 246, 0.5)';
    if (level > 25) auraColor = 'rgba(168, 85, 247, 0.6)';

    return {
      imgStyle: {
        filter: missedDays >= 7 ? 'grayscale(1) brightness(0.1) blur(8px)' : `grayscale(${grayscale}%) brightness(${brightness}) drop-shadow(0 0 ${glowLevel}px ${auraColor})`,
        transition: 'all 1s ease'
      },
      auraColor
    };
  })();

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 flex flex-col items-center justify-center font-sans overflow-x-hidden">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #06b6d4; border-radius: 10px; }
        .hall-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .hall-card:hover { border-color: #06b6d4; background: rgba(6, 182, 212, 0.05); transform: translateY(-5px); }
      `}</style>

      {/* BACK BUTTON */}
      <button onClick={view === 'hall' ? onBack : () => setView('hall')} className="absolute top-8 left-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-cyan-400 transition-all z-50">
        ← {view === 'hall' ? 'Quitter' : 'Retour au Hall'}
      </button>

      <div className="max-w-6xl w-full">
        
        {/* --- VUE 1 : LE HALL DES CHASSEURS --- */}
        {view === 'hall' && (
          <div className="animate-in fade-in zoom-in-95 duration-700">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase">Hall des <span className="text-cyan-500">Chasseurs</span></h2>
              <p className="text-white/30 text-xs font-bold tracking-[0.5em] uppercase text-center">Sélectionnez votre contrat de discipline</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* SOLO */}
              <div onClick={() => setView('solo')} className="hall-card p-10 rounded-[40px] cursor-pointer group">
                <div className="text-cyan-500 font-black text-[10px] tracking-widest uppercase mb-6 italic">Accès Gratuit</div>
                <h3 className="text-3xl font-black uppercase italic mb-4">Le Monarque</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-8">Défie tes propres limites. 31 jours pour forger ton destin seul.</p>
                <div className="text-cyan-400 font-black text-[10px] group-hover:translate-x-3 transition-transform uppercase tracking-widest">Entrer dans l'Arène →</div>
              </div>

              {/* ESCOUADE (BLOQUÉ) */}
              <div className="hall-card p-10 rounded-[40px] opacity-40 grayscale relative overflow-hidden">
                <div className="absolute top-6 right-8 bg-cyan-600 text-black text-[8px] px-3 py-1 rounded-full font-black uppercase">Premium</div>
                <h3 className="text-3xl font-black uppercase italic mb-4">Escouade</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-8">Coopération de 3 à 10 membres. La santé est partagée. Ne trahis pas tes frères.</p>
                <div className="text-white/20 font-black text-[10px] uppercase tracking-widest italic">Bientôt disponible...</div>
              </div>

              {/* GUILDE (BLOQUÉ) */}
              <div className="hall-card p-10 rounded-[40px] opacity-40 grayscale relative">
                <div className="absolute top-6 right-8 bg-red-600 text-white text-[8px] px-3 py-1 rounded-full font-black uppercase">Guerre</div>
                <h3 className="text-3xl font-black uppercase italic mb-4">La Guilde</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-8">Compétition nationale. Domine le classement du Burundi avec ton clan.</p>
                <div className="text-white/20 font-black text-[10px] uppercase tracking-widest italic">Bientôt disponible...</div>
              </div>
            </div>
          </div>
        )}

        {/* --- VUE 2 : MODE SOLO --- */}
        {view === 'solo' && (
          <>
            {step === 1 ? (
              <div className="space-y-10 animate-in fade-in duration-700">
                <div className="text-center space-y-2">
                   <h2 className="text-5xl font-black italic tracking-tighter uppercase text-cyan-500">Éveil du Monarque</h2>
                   <p className="text-white/30 text-[10px] font-bold tracking-[0.5em] uppercase">Initialisation de ton double numérique</p>
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
                  <input type="text" placeholder="NOM DU CHASSEUR..." value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-center font-bold outline-none focus:border-cyan-500 transition-all uppercase tracking-widest" />
                  <button onClick={handleCreate} className="w-full py-4 bg-cyan-600 text-black font-black uppercase text-xs rounded-xl hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20">Commencer l'ascension</button>
                </div>
              </div>
            ) : (
              <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-10 items-start animate-in zoom-in-95 duration-500">
                {/* HISTORIQUE */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl h-[450px] flex flex-col">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-cyan-500 border-b border-white/10 pb-4 mb-4 italic">Registre du Système</h4>
                  <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                    {history.length === 0 && <p className="text-white/20 text-[10px] italic text-center pt-10 uppercase tracking-widest">Néant...</p>}
                    {history.map((log, i) => (
                      <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col gap-1 transition-all hover:border-cyan-500/30">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-cyan-400">LEVEL {log.level}</span>
                          <span className="text-[9px] opacity-40 font-mono italic">{log.time}</span>
                        </div>
                        <div className="text-[10px] font-bold opacity-70 uppercase">{log.date}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CENTRE : AVATAR & CHRONO */}
                <div className="flex flex-col items-center space-y-10">
                  <div className="text-center">
                    <div className="text-6xl md:text-8xl font-black text-cyan-400 font-mono tracking-tighter drop-shadow-[0_0_20px_rgba(6,182,212,0.6)] animate-pulse">
                      {timeLeft}
                    </div>
                    <p className="text-[9px] font-bold text-cyan-500/40 uppercase tracking-[0.5em] mt-4">Délai avant pénalité</p>
                  </div>

                  <div className="relative">
                    <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarData.seed}`} style={visuals.imgStyle} className="w-64 h-64 md:w-80 md:h-80 relative z-10" />
                    {avatarData.missedDays > 0 && (
                      <div className="absolute top-0 right-0 bg-red-600 px-4 py-1 rounded-full text-[10px] font-black animate-bounce shadow-2xl z-20 italic">AVATAR FANÉ</div>
                    )}
                  </div>

                  <button onClick={completeQuest} className="w-full max-w-xs py-5 bg-cyan-600 text-black font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl hover:bg-cyan-400 hover:scale-105 transition-all shadow-xl shadow-cyan-500/40 active:scale-95">Soumettre le Rapport</button>
                </div>

                {/* STATS */}
                <div className="space-y-6">
                  <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center space-y-4">
                    <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white">{avatarData.name}</h3>
                    <span className="inline-block px-4 py-1 bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 rounded-full text-[10px] font-black uppercase tracking-widest italic">{avatarData.label}</span>
                    <div className="pt-6 space-y-2 text-left">
                      <div className="flex justify-between text-[10px] font-black uppercase">
                        <span className="opacity-40 tracking-widest italic text-white/50">Progression</span>
                        <span className="text-cyan-400">{Math.round((avatarData.level / 31) * 100)}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                        <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-1000" style={{ width: `${(avatarData.level / 31) * 100}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl italic text-[11px] text-white/40 text-center leading-relaxed uppercase tracking-widest">
                    {avatarData.missedDays >= 7 
                      ? "Sujet éliminé. La volonté a fait défaut." 
                      : avatarData.missedDays > 0 
                      ? "Attention... ton existence s'efface." 
                      : "État optimal. Le système observe ta force."}
                  </div>
                  <button onClick={resetAvatar} className="w-full py-4 text-[10px] font-black uppercase text-white/10 hover:text-red-500 transition-colors tracking-widest italic">Supprimer ADN</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
