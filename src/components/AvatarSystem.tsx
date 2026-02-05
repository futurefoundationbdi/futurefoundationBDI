import React, { useState, useEffect, useMemo } from 'react';
import { QUEST_POOL } from '../data/SoloQuests';

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
  const [view, setView] = useState<'hall' | 'solo'>('hall'); 
  const [step, setStep] = useState(1);
  const [selectedId, setSelectedId] = useState('f1');
  const [userName, setUserName] = useState("");
  const [avatarData, setAvatarData] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<string>("24:00:00");
  const [history, setHistory] = useState<any[]>([]);
  
  // ÉTAT DES TÂCHES COCHÉES (STYLE ME+)
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  // 1. CHARGEMENT
  useEffect(() => {
    const savedAvatar = localStorage.getItem('future_library_avatar');
    const savedHistory = localStorage.getItem('quest_history');
    const savedChecks = localStorage.getItem('daily_checks');
    
    if (savedAvatar) {
      setAvatarData(JSON.parse(savedAvatar));
      setStep(2);
    }
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    // Charger les tâches cochées si c'est le même jour
    if (savedChecks) {
      const { date, tasks } = JSON.parse(savedChecks);
      if (date === new Date().toLocaleDateString()) {
        setCompletedTasks(tasks);
      }
    }
  }, []);

  // 2. LOGIQUE DE SÉLECTION DES QUÊTES (Mémorisée pour la journée)
  const currentQuests = useMemo(() => {
    if (!avatarData) return [];
    const allQuests = [...QUEST_POOL.mental, ...QUEST_POOL.physique, ...QUEST_POOL.discipline];
    const level = avatarData.level;
    
    let count = 1;
    if (level > 20) count = (level % 2 === 0) ? 4 : 5;
    else if (level > 10) count = (level % 2 === 0) ? 3 : 4;
    else count = (level % 2 === 0) ? 1 : 2;

    const startIndex = (level * 3) % allQuests.length;
    let selected = allQuests.slice(startIndex, startIndex + count);
    if (selected.length < count) {
      selected = [...selected, ...allQuests.slice(0, count - selected.length)];
    }
    return selected;
  }, [avatarData?.level]);

  // 3. CHRONO
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

  // 4. ACTIONS & AUTO-VALIDATION
  const toggleQuest = (questName: string) => {
    if (completedTasks.includes(questName)) return; // On ne peut pas décocher pour éviter la triche

    const newCompleted = [...completedTasks, questName];
    setCompletedTasks(newCompleted);
    
    // Sauvegarde temporaire des checks
    localStorage.setItem('daily_checks', JSON.stringify({
      date: new Date().toLocaleDateString(),
      tasks: newCompleted
    }));

    // SI TOUTES LES TÂCHES SONT FAITES -> VALIDATION AUTO
    if (newCompleted.length === currentQuests.length) {
      setTimeout(() => {
        completeQuest();
      }, 500); // Petit délai pour laisser l'utilisateur voir le dernier check
    }
  };

  const completeQuest = () => {
    const messages = ["QUÊTE TERMINÉE", "SYSTÈME SATISFAIT", "LEVEL UP !"];
    const now = new Date();
    const newData = { ...avatarData, level: avatarData.level + 1, missedDays: 0, lastValidation: now.toISOString() };
    const newLog = { date: now.toLocaleDateString(), time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), level: newData.level };
    
    setAvatarData(newData);
    setHistory([newLog, ...history]);
    setCompletedTasks([]); // Reset des checks pour le nouveau niveau
    localStorage.setItem('future_library_avatar', JSON.stringify(newData));
    localStorage.setItem('quest_history', JSON.stringify([newLog, ...history]));
    localStorage.removeItem('daily_checks');
    alert(messages[Math.floor(Math.random() * messages.length)]);
  };

  const handlePenalty = () => {
    const newData = { ...avatarData, missedDays: Math.min(7, avatarData.missedDays + 1), lastValidation: new Date().toISOString() };
    setAvatarData(newData);
    setCompletedTasks([]);
    localStorage.setItem('future_library_avatar', JSON.stringify(newData));
    localStorage.removeItem('daily_checks');
  };

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

  const resetAvatar = () => {
    if(window.confirm("Tout supprimer ?")) {
      localStorage.clear();
      setAvatarData(null);
      setHistory([]);
      setCompletedTasks([]);
      setStep(1);
    }
  };

  const visuals = (() => {
    if (!avatarData) return {};
    const { missedDays, level } = avatarData;
    const grayscale = (missedDays / 7) * 100;
    const brightness = 1 - (missedDays * 0.12);
    const glowLevel = Math.min(level * 2, 40);
    let auraColor = level > 25 ? 'rgba(168, 85, 247, 0.6)' : level > 10 ? 'rgba(59, 130, 246, 0.5)' : 'rgba(6, 182, 212, 0.3)';

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
        .quest-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .quest-card:active { transform: scale(0.95); }
      `}</style>

      <button onClick={view === 'hall' ? onBack : () => setView('hall')} className="absolute top-8 left-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-cyan-400 transition-all z-50">
        ← {view === 'hall' ? 'Quitter' : 'Retour au Hall'}
      </button>

      <div className="max-w-6xl w-full">
        {view === 'hall' && (
          <div className="animate-in fade-in zoom-in-95 duration-700">
             <div className="text-center mb-16 space-y-4">
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase">Hall des <span className="text-cyan-500">Chasseurs</span></h2>
              <p className="text-white/30 text-xs font-bold tracking-[0.5em] uppercase text-center">Sélectionnez votre contrat de discipline</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div onClick={() => setView('solo')} className="bg-white/5 border border-white/10 p-10 rounded-[40px] cursor-pointer group hover:border-cyan-500 hover:bg-cyan-500/5 transition-all">
                <div className="text-cyan-500 font-black text-[10px] tracking-widest uppercase mb-6 italic">Accès Gratuit</div>
                <h3 className="text-3xl font-black uppercase italic mb-4">Le Monarque</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-8">Défie tes propres limites. 31 jours pour forger ton destin seul.</p>
                <div className="text-cyan-400 font-black text-[10px] group-hover:translate-x-3 transition-transform uppercase tracking-widest">Entrer dans l'Arène →</div>
              </div>
              {/* ESCOUADE & GUILDE resteraient grisés */}
              <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] opacity-20 grayscale cursor-not-allowed">
                <h3 className="text-3xl font-black uppercase italic mb-4 text-white/20">Escouade</h3>
              </div>
              <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] opacity-20 grayscale cursor-not-allowed">
                <h3 className="text-3xl font-black uppercase italic mb-4 text-white/20">La Guilde</h3>
              </div>
            </div>
          </div>
        )}

        {view === 'solo' && (
          <>
            {step === 1 ? (
              <div className="space-y-10 animate-in fade-in duration-700">
                <div className="text-center space-y-2">
                   <h2 className="text-5xl font-black italic tracking-tighter uppercase text-cyan-500">Éveil du Monarque</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {AVATAR_ARCHETYPES.map((arc) => (
                    <div key={arc.id} onClick={() => setSelectedId(arc.id)} className={`cursor-pointer rounded-2xl border-2 p-2 transition-all ${selectedId === arc.id ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/5 opacity-40'}`}>
                      <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${arc.seed}`} className="w-full h-auto" />
                    </div>
                  ))}
                </div>
                <div className="max-w-xs mx-auto space-y-4">
                  <input type="text" placeholder="NOM..." value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-center outline-none focus:border-cyan-500 uppercase font-bold" />
                  <button onClick={handleCreate} className="w-full py-4 bg-cyan-600 text-black font-black uppercase rounded-xl">Activer l'ADN</button>
                </div>
              </div>
            ) : (
              <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                {/* GAUCHE : REGISTRE */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl h-[500px] flex flex-col order-2 lg:order-1">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-cyan-500 border-b border-white/10 pb-4 mb-4 italic">Registre</h4>
                  <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                    {history.map((log, i) => (
                      <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="flex justify-between text-[10px] font-black text-cyan-400">
                          <span>LEVEL {log.level}</span>
                          <span className="opacity-40">{log.time}</span>
                        </div>
                        <div className="text-[10px] font-bold opacity-70 uppercase mt-1">{log.date}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CENTRE : CHECKLIST STYLE ME+ */}
                <div className="flex flex-col items-center space-y-8 order-1 lg:order-2">
                  <div className="text-center">
                    <div className="text-7xl font-black text-cyan-400 font-mono tracking-tighter drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                      {timeLeft}
                    </div>
                    <p className="text-[9px] font-bold text-cyan-500/40 uppercase tracking-[0.3em] mt-2">Délai de la Mission</p>
                  </div>

                  <div className="w-full max-w-sm space-y-3">
                    <div className="flex justify-between items-end px-2 mb-4">
                      <h5 className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Quêtes de Rang {avatarData.level > 20 ? 'S' : avatarData.level > 10 ? 'A' : 'B'}</h5>
                      <span className="text-[10px] font-mono text-cyan-500">{completedTasks.length}/{currentQuests.length}</span>
                    </div>
                    
                    {currentQuests.map((quest, index) => {
                      const isDone = completedTasks.includes(quest);
                      return (
                        <div 
                          key={index}
                          onClick={() => toggleQuest(quest)}
                          className={`quest-card cursor-pointer p-5 rounded-2xl border flex items-center gap-4 transition-all ${
                            isDone 
                            ? 'bg-cyan-500/10 border-cyan-500/40 opacity-50' 
                            : 'bg-white/5 border-white/10 hover:border-cyan-400/50'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isDone ? 'bg-cyan-500 border-cyan-500' : 'border-white/20'}`}>
                            {isDone && <span className="text-black text-xs font-bold">✓</span>}
                          </div>
                          <p className={`text-[12px] font-bold tracking-tight ${isDone ? 'line-through text-white/30' : 'text-white/90'}`}>
                            {quest}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="relative pt-6">
                    <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarData.seed}`} style={visuals.imgStyle} className="w-48 h-48 md:w-56 md:h-56 relative z-10" />
                    {avatarData.missedDays > 0 && <div className="absolute top-0 right-0 bg-red-600 px-4 py-1 rounded-full text-[10px] font-black animate-bounce italic z-20">ADN FANÉ</div>}
                  </div>
                </div>

                {/* DROITE : STATS */}
                <div className="space-y-6 order-3">
                  <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center">
                    <h3 className="text-3xl font-black italic uppercase text-white">{avatarData.name}</h3>
                    <div className="mt-6 space-y-2 text-left">
                      <div className="flex justify-between text-[10px] font-black uppercase">
                        <span className="opacity-40">Progression</span>
                        <span className="text-cyan-400">{avatarData.level}/31</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                        <div className="h-full bg-cyan-500 transition-all duration-1000 shadow-[0_0_10px_#06b6d4]" style={{ width: `${(avatarData.level / 31) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                  <button onClick={resetAvatar} className="w-full py-4 text-[10px] font-black text-white/10 hover:text-red-500 transition-colors uppercase italic">Supprimer ADN</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
