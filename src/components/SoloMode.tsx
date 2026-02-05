import React, { useState, useEffect, useMemo } from 'react';
import { QUEST_POOL } from '../data/SoloQuests';

const AVATAR_ARCHETYPES = [
  { id: 'f1', seed: 'Aneka', label: 'La Stratège' },
  { id: 'f2', seed: 'Bella', label: 'La Geekette' },
  { id: 'f3', seed: 'Clara', label: 'L\'Ambitieuse' },
  { id: 'f4', seed: 'Eden', label: 'La Râleuse' },
  { id: 'f5', seed: 'Fiona', label: 'L\'Influenceuse' },
  { id: 'f6', seed: 'Grace', label: 'La Visionnaire' },
  { id: 'f7', seed: 'Jocelyn', label: 'La Charmeuse' },
  { id: 'm1', seed: 'Nolan', label: 'La Star' },
  { id: 'm2', seed: 'Ryker', label: 'Le Rebelle' },
  { id: 'm3', seed: 'Caleb', label: 'Le Flemard' },
  { id: 'm4', seed: 'Bastian', label: 'Le Comics' },
  { id: 'm5', seed: 'Gage', label: 'L\'Audacieux' },
];

const MOTIVATIONAL_QUOTES = [
  "Excellent travail ! Ta discipline d'aujourd'hui forge ton succès.",
  "Mission accomplie. Le système enregistre ta progression.",
  "Tiens bon, le meilleur est à venir !",
  "Focus incroyable. Ton ADN se stabilise.",
  "Tu es plus fort(e) que tu ne le penses",
  "Focus incroyable. Ton ADN se stabilise.",
  " Rien n'est impossible, surtout pour toi.",
  "Lève-toi, brille, et montre au monde de quoi tu es capable !",
  "Fais chaque jour quelque chose qui te rapproche de ton objectif.",
  " Chaque petit pas est un progrès.",
  "Ils ne savaient pas que c'était impossible, alors ils l'ont fait.",
  "La constance est l'arme ultime. Repose-toi, guerrier.",
  "Fais de ta vie un rêve et d'un rêve une réalité. "
];

interface SoloModeProps {
  onBack: () => void;
}

export default function SoloMode({ onBack }: SoloModeProps) {
  const [step, setStep] = useState(1);
  const [selectedId, setSelectedId] = useState('f1');
  const [userName, setUserName] = useState("");
  const [avatarData, setAvatarData] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<string>("24:00:00");
  const [history, setHistory] = useState<any[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [coachMessage, setCoachMessage] = useState("");

  // 1. CHARGEMENT INITIAL
  useEffect(() => {
    const savedAvatar = localStorage.getItem('future_library_avatar');
    const savedHistory = localStorage.getItem('quest_history');
    const savedChecks = localStorage.getItem('daily_checks');
    
    if (savedAvatar) {
      const parsedAvatar = JSON.parse(savedAvatar);
      setAvatarData(parsedAvatar);
      setStep(2);
      const today = new Date().toLocaleDateString();
      if (new Date(parsedAvatar.lastValidation).toLocaleDateString() === today && parsedAvatar.level > 1) {
        setSessionFinished(true);
        setCoachMessage(MOTIVATIONAL_QUOTES[0]);
      }
    }
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedChecks) {
      const { date, tasks } = JSON.parse(savedChecks);
      if (date === new Date().toLocaleDateString()) setCompletedTasks(tasks);
    }
  }, []);

  // 2. LOGIQUE DES QUÊTES
  const currentQuests = useMemo(() => {
    if (!avatarData) return [];
    const allQuests = [...QUEST_POOL.mental, ...QUEST_POOL.physique, ...QUEST_POOL.discipline];
    const level = avatarData.level;
    let count = level > 20 ? (level % 2 === 0 ? 4 : 5) : level > 10 ? (level % 2 === 0 ? 3 : 4) : (level % 2 === 0 ? 1 : 2);
    const startIndex = (level * 3) % allQuests.length;
    let selected = allQuests.slice(startIndex, startIndex + count);
    if (selected.length < count) selected = [...selected, ...allQuests.slice(0, count - selected.length)];
    return selected;
  }, [avatarData?.level]);

  // 3. TIMER
  useEffect(() => {
    const timer = setInterval(() => {
      if (!avatarData || step !== 2 || sessionFinished) return;
      const now = new Date().getTime();
      const lastValidation = new Date(avatarData.lastValidation || avatarData.createdAt).getTime();
      const deadline = lastValidation + (24 * 60 * 60 * 1000);
      const distance = deadline - now;
      if (distance <= 0) handlePenalty();
      else {
        const h = Math.floor((distance % 86400000) / 3600000);
        const m = Math.floor((distance % 3600000) / 60000);
        const s = Math.floor((distance % 60000) / 1000);
        setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [avatarData, step, sessionFinished]);

  const toggleQuest = (questName: string) => {
    if (completedTasks.includes(questName) || sessionFinished) return;
    const newCompleted = [...completedTasks, questName];
    setCompletedTasks(newCompleted);
    localStorage.setItem('daily_checks', JSON.stringify({ date: new Date().toLocaleDateString(), tasks: newCompleted }));
    if (newCompleted.length === currentQuests.length) setTimeout(completeQuest, 600);
  };

  const completeQuest = () => {
    const now = new Date();
    const newData = { ...avatarData, level: avatarData.level + 1, missedDays: 0, lastValidation: now.toISOString() };
    const newLog = { date: now.toLocaleDateString(), time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), level: newData.level };
    setAvatarData(newData);
    setHistory([newLog, ...history]);
    setCoachMessage(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
    setSessionFinished(true);
    localStorage.setItem('future_library_avatar', JSON.stringify(newData));
    localStorage.setItem('quest_history', JSON.stringify([newLog, ...history]));
    localStorage.removeItem('daily_checks');
  };

  const handlePenalty = () => {
    const newData = { ...avatarData, missedDays: Math.min(7, avatarData.missedDays + 1), lastValidation: new Date().toISOString() };
    setAvatarData(newData);
    localStorage.setItem('future_library_avatar', JSON.stringify(newData));
  };

  const handleCreate = () => {
    if (!userName.trim()) return alert("Nom requis.");
    const archetype = AVATAR_ARCHETYPES.find(a => a.id === selectedId);
    const newAvatar = { name: userName, seed: archetype?.seed, level: 1, missedDays: 0, createdAt: new Date().toISOString(), lastValidation: new Date().toISOString() };
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
      setSessionFinished(false);
      setStep(1);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 md:px-6 py-4 animate-in fade-in duration-500">
      {/* Bouton retour adapté mobile */}
      <button onClick={onBack} className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-8 flex items-center gap-2">
        ← Retour Hub
      </button>

      {step === 1 ? (
        <div className="flex flex-col items-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-black italic uppercase text-cyan-500 text-center tracking-tighter">Éveil du Monarque</h2>
          
          {/* Grille avatars : 3 colonnes sur mobile, 6 sur desktop */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 w-full">
            {AVATAR_ARCHETYPES.map((arc) => (
              <div key={arc.id} onClick={() => setSelectedId(arc.id)} 
                className={`cursor-pointer rounded-xl border-2 p-1 transition-all ${selectedId === arc.id ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/5 opacity-40'}`}>
                <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${arc.seed}`} alt="avatar" className="w-full h-auto" />
              </div>
            ))}
          </div>

          <div className="w-full max-w-xs space-y-4">
            <input type="text" placeholder="NOM DU MONARQUE..." value={userName} onChange={(e) => setUserName(e.target.value)} 
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-center outline-none focus:border-cyan-500 uppercase font-bold" />
            <button onClick={handleCreate} className="w-full py-4 bg-cyan-600 text-black font-black uppercase rounded-2xl shadow-lg shadow-cyan-900/20 active:scale-95 transition-transform">
              Activer l'ADN
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
          
          {/* GAUCHE : REGISTRE (Masqué ou réduit sur mobile) */}
          <div className="hidden lg:flex flex-col bg-white/5 border border-white/10 p-6 rounded-[32px] h-[500px]">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-cyan-500 border-b border-white/10 pb-4 mb-4 italic">Registre d'Élite</h4>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {history.map((log, i) => (
                <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between text-[10px] font-black text-cyan-400">
                    <span>LEVEL {log.level}</span>
                    <span className="opacity-40">{log.time}</span>
                  </div>
                  <div className="text-[10px] font-bold opacity-70 mt-1">{log.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CENTRE : ACTION PRINCIPALE */}
          <div className="flex flex-col items-center space-y-6 md:space-y-8">
            <div className="text-center">
              <div className={`text-5xl md:text-7xl font-black font-mono tracking-tighter ${sessionFinished ? 'text-white/10' : 'text-cyan-400'}`}>
                {sessionFinished ? "COMPLÉTÉ" : timeLeft}
              </div>
              <p className="text-[8px] md:text-[10px] font-bold text-cyan-500/40 uppercase tracking-[0.3em] mt-2 italic">Protocole Temporel</p>
            </div>

            {/* Checklist adaptée mobile */}
            <div className="w-full space-y-3 relative">
              {sessionFinished && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex items-center justify-center rounded-3xl border border-cyan-500/30 text-center p-6 animate-in fade-in duration-300">
                  <div>
                    <div className="text-4xl mb-3">🏆</div>
                    <p className="text-sm font-black uppercase text-white mb-1">Discipline Validée</p>
                    <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Le système se réinitialise à minuit</p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-end px-2 mb-2">
                <h5 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Objectifs du Jour</h5>
                <span className="text-xs font-mono text-cyan-500">{completedTasks.length}/{currentQuests.length}</span>
              </div>

              {currentQuests.map((quest, index) => {
                const isDone = completedTasks.includes(quest);
                return (
                  <div key={index} onClick={() => toggleQuest(quest)} 
                    className={`p-4 md:p-5 rounded-2xl border flex items-center gap-4 active:scale-98 transition-all ${isDone ? 'bg-cyan-500/5 border-cyan-500/20 opacity-40' : 'bg-white/5 border-white/10'}`}>
                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center ${isDone ? 'bg-cyan-500 border-cyan-500' : 'border-white/20'}`}>
                      {isDone && <span className="text-black text-[10px] font-black">✓</span>}
                    </div>
                    <p className={`text-xs md:text-sm font-bold leading-tight ${isDone ? 'line-through text-white/20' : 'text-white/90'}`}>{quest}</p>
                  </div>
                );
              })}
            </div>

            <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarData.seed}`} 
                 className="w-32 h-32 md:w-56 md:h-56 object-contain drop-shadow-[0_0_20px_rgba(6,182,212,0.2)]" alt="avatar" />
          </div>

          {/* DROITE : STATS & COACH */}
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[32px] text-center relative overflow-hidden">
              <h3 className="text-2xl md:text-3xl font-black italic uppercase">{avatarData.name}</h3>
              <div className="mt-6 space-y-2 text-left">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span className="opacity-40">Niveau Actuel</span>
                  <span className="text-cyan-400">{avatarData.level} / 31</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: `${(avatarData.level / 31) * 100}%` }} />
                </div>
              </div>

              {sessionFinished && (
                <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl animate-in zoom-in duration-500">
                  <p className="text-[9px] font-black text-cyan-400 uppercase mb-2 tracking-widest italic text-left">Message du Coach :</p>
                  <p className="text-[11px] text-white/80 leading-relaxed italic text-left font-medium">"{coachMessage}"</p>
                </div>
              )}
            </div>

            {/* Boutons d'action adaptés mobile */}
            <div className="grid grid-cols-1 gap-3">
              <button onClick={onBack} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10">
                Menu Principal
              </button>
              <button onClick={resetAvatar} className="w-full py-2 text-[9px] font-black text-white/10 hover:text-red-500 transition-colors uppercase italic tracking-[0.2em]">
                Réinitialiser ADN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
