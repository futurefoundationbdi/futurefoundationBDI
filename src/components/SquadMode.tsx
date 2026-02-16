import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, MessageSquare, Zap, User, 
  CheckCircle2, Trophy, ArrowLeft, ChevronLeft, Share2, Copy, Plus, Clock 
} from 'lucide-react';

import { SquadJoin } from './Squad/SquadJoin';
import { SquadConfig } from './Squad/SquadConfig';
import { SquadContract } from './Squad/SquadContract';
import { SquadChat } from './Squad/SquadChat';
// Assure-toi que ChallengeMode est bien exporté dans squadService.ts
import { squadService, ChallengeMode } from '../services/squadService';

interface SquadModeProps {
  onBack: () => void;
}

export default function SquadMode({ onBack }: SquadModeProps) {
  const [step, setStep] = useState<'list' | 'join' | 'config' | 'contract' | 'dashboard'>('join');
  const [activeTab, setActiveTab] = useState('routine');
  const [mySquads, setMySquads] = useState<string[]>([]);
  const [squadId, setSquadId] = useState<string | null>(localStorage.getItem('squad_id'));
  const [duration, setDuration] = useState(30);
  const [maxMembers, setMaxMembers] = useState(3);
  const [challengeMode, setChallengeMode] = useState<ChallengeMode>('SYSTEM');
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState("");

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentMemberCount, setCurrentMemberCount] = useState(0);

  // --- INITIALISATION & SYNCHRONISATION ---
  useEffect(() => {
    const saved = squadService.getMySquads();
    setMySquads(saved);

    const currentId = localStorage.getItem('squad_id');
    if (currentId && saved.includes(currentId)) {
      const isSigned = localStorage.getItem(`squad_signed_${currentId}`) === 'true';
      setSquadId(currentId);
      
      const data = squadService.getUnitData(currentId);
      if (data) {
        setMaxMembers(data.max);
        setDuration(data.duration);
        if (data.challengeMode) setChallengeMode(data.challengeMode);
      }
      
      setStep(isSigned ? 'dashboard' : 'contract');
    } else if (saved.length > 0) {
      setStep('list');
    }
  }, []);

  useEffect(() => {
    if (step === 'dashboard' && squadId) {
      const sync = () => {
        setMessages(squadService.getMessages(squadId));
        setCurrentMemberCount(squadService.getMemberCount(squadId));
      };

      const syncInterval = setInterval(sync, 1500);
      window.addEventListener('squad_message_received', sync);
      window.addEventListener('storage', sync);

      return () => {
        clearInterval(syncInterval);
        window.removeEventListener('squad_message_received', sync);
        window.removeEventListener('storage', sync);
      };
    }
  }, [step, squadId]);

  const handleJoin = (id: string, isNew: boolean) => {
    setError("");
    const avatarStr = localStorage.getItem('future_library_avatar');
    if (!avatarStr) { setError("INITIALISEZ VOTRE ADN EN MODE SOLO D'ABORD"); return; }

    if (isNew) {
      if (mySquads.length >= 2) { setError("LIMITE ATTEINTE : MAX 2 UNITÉS"); return; }
      const newCode = "UNIT-" + Math.random().toString(36).substring(2, 7).toUpperCase();
      setSquadId(newCode);
      setStep('config');
    } else {
      const code = id.toUpperCase().trim();
      if (!code) { setError("CODE D'ACCÈS REQUIS"); return; }
      
      const data = squadService.getUnitData(code);
      if (!data) {
        setError("ÉCHEC d'INFILTRATION : CETTE UNITÉ N'EXISTE PAS.");
        return;
      }

      setSquadId(code);
      setDuration(data.duration);
      setMaxMembers(data.max);
      if (data.challengeMode) setChallengeMode(data.challengeMode);
      setStep('contract');
    }
  };

  const handleSign = () => {
    if (squadId) {
      if (!squadService.exists(squadId)) {
        squadService.registerUnit(squadId, maxMembers, duration, challengeMode);
      } else {
        squadService.addMember(squadId);
      }
      
      squadService.saveToMySquads(squadId);
      setMySquads(squadService.getMySquads());
      localStorage.setItem('squad_id', squadId);
      localStorage.setItem(`squad_signed_${squadId}`, 'true');
      setStep('dashboard');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !squadId) return;
    const avatar = JSON.parse(localStorage.getItem('future_library_avatar') || '{}');
    squadService.sendMessage(squadId, newMessage, avatar.name || "Moi");
    setNewMessage("");
  };

  const handleAbandonSquad = () => {
    if (window.confirm("VOULEZ-VOUS VRAIMENT QUITTER CETTE UNITÉ ?")) {
      const remaining = squadService.removeFromMySquads(squadId!);
      setMySquads(remaining);
      localStorage.removeItem(`squad_signed_${squadId}`);
      localStorage.removeItem('squad_id');
      setSquadId(null);
      setStep(remaining.length > 0 ? 'list' : 'join');
    }
  };

  const copyToClipboard = () => {
    if (squadId) {
      navigator.clipboard.writeText(squadId);
      alert("CODE COPIÉ !");
    }
  };

  const shareWhatsApp = () => {
    const text = `Rejoins mon unité sur SQUADMODE ! Code d'accès : ${squadId}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const renderSquadList = () => (
    <div className="p-6 flex flex-col items-center justify-center min-h-[80vh] space-y-8 animate-in fade-in bg-black text-white">
      <div className="text-center">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter">Vos Unités</h2>
        <p className="text-[10px] text-purple-500 font-black tracking-widest uppercase mt-1">Sélectionnez une mission</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        {mySquads.map((id) => (
          <button 
            key={id}
            onClick={() => { setSquadId(id); setStep('dashboard'); localStorage.setItem('squad_id', id); }}
            className="w-full p-6 bg-[#0A0A0A] border border-white/10 rounded-[28px] flex items-center justify-between hover:border-purple-500 transition-all group"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white font-black uppercase">
                {id.charAt(5) || "U"}
              </div>
              <div>
                <p className="font-black italic text-lg uppercase tracking-tighter">{id}</p>
                <p className="text-[9px] text-white/40 uppercase font-bold">Accéder au QG</p>
              </div>
            </div>
            <ChevronLeft size={20} className="rotate-180 text-white/20 group-hover:text-purple-500" />
          </button>
        ))}

        {mySquads.length < 2 && (
          <button 
            onClick={() => setStep('join')} 
            className="w-full p-6 border-2 border-dashed border-white/5 rounded-[28px] flex items-center justify-center gap-3 text-white/30 hover:text-white transition-all bg-white/5"
          >
            <Plus size={20} />
            <span className="font-black uppercase text-xs italic">Nouvelle Unité</span>
          </button>
        )}
      </div>
      <button onClick={onBack} className="text-[10px] font-black uppercase text-white/20 tracking-widest">Retour au Hub</button>
    </div>
  );

  const renderDashboard = () => {
    const avatar = JSON.parse(localStorage.getItem('future_library_avatar') || '{}');
    const isFull = currentMemberCount >= maxMembers;

    return (
      <div className="flex flex-col h-screen bg-black text-white max-w-md mx-auto overflow-hidden relative border-x border-white/5 font-sans">
        {activeTab !== 'chat' && (
          <header className="p-6 bg-[#0A0A0A] border-b border-white/10 animate-in fade-in slide-in-from-top duration-500 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <button onClick={() => setStep('list')} className="p-2 -ml-2 text-white/40 hover:text-white transition-colors">
                  <ChevronLeft size={24} />
                </button>
                <div>
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">UNITÉ : {squadId}</h2>
                  <div className="flex gap-3 mt-1">
                    <button onClick={copyToClipboard} className="flex items-center gap-1 text-[8px] font-black text-white/40 uppercase hover:text-white">
                      <Copy size={10} /> Copier
                    </button>
                    <button onClick={shareWhatsApp} className="flex items-center gap-1 text-[8px] font-black text-green-500 uppercase hover:text-green-400">
                      <Share2 size={10} /> Partager
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex -space-x-3">
                <div className="w-9 h-9 rounded-xl border-2 border-purple-500 bg-zinc-800 overflow-hidden shadow-lg z-10">
                  <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${avatar.seed}`} alt="member" />
                </div>
                {Array.from({ length: Math.max(0, maxMembers - 1) }).map((_, i) => (
                  <div key={i} className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center text-[10px] font-black transition-all ${i < (currentMemberCount - 1) ? 'bg-purple-900 border-purple-500 text-white' : 'bg-black/40 border-dashed border-white/10 text-white/20'}`}>
                    {i < (currentMemberCount - 1) ? 'OK' : '+'}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 bg-black/40 p-3 rounded-2xl border border-white/5">
              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                <span className={isFull ? "text-green-500" : "text-orange-500"}>
                  {isFull ? "● UNITÉ OPÉRATIONNELLE" : "○ SYNC. EN COURS..."}
                </span>
                <span className="text-white/40">{currentMemberCount} / {maxMembers} MEMBRES</span>
              </div>
              <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 ${isFull ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]'}`} 
                  style={{ width: `${(currentMemberCount / maxMembers) * 100}%` }}
                ></div>
              </div>
            </div>
          </header>
        )}

        <main className="flex-1 overflow-y-auto bg-black pb-24">
          {activeTab === 'routine' && (
  <div className="p-6 space-y-6">
    <h3 className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em]">Protocole de Mission</h3>
    
    {!isFull ? (
      // --- ÉTAT : EN ATTENTE ---
      <div className="bg-orange-500/5 border border-orange-500/20 p-8 rounded-[32px] space-y-4 text-center animate-in zoom-in duration-500">
        <div className="w-16 h-16 bg-orange-500/10 rounded-3xl flex items-center justify-center mx-auto border border-orange-500/20">
          <Clock size={32} className="text-orange-500 animate-pulse" />
        </div>
        <p className="text-sm font-black uppercase italic text-orange-400">En attente des membres...</p>
        <p className="text-[10px] text-white/30 uppercase leading-relaxed font-bold italic">L'unité doit être au complet pour activer le protocole {challengeMode}.</p>
      </div>
    ) : (
      // --- ÉTAT : OPÉRATIONNEL ---
      <div className="space-y-6 animate-in fade-in duration-700">
        {challengeMode === 'SYSTEM' ? (
          // Rendu Mode Système
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-500">
              <Zap size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Défis Système Actifs</span>
            </div>
            {/* On boucle sur les défis de base pour l'instant */}
            {SYSTEM_CHALLENGES.slice(0, 3).map((ch) => (
              <div key={ch.id} className="bg-[#0A0A0A] border border-white/5 p-5 rounded-[24px] flex items-center justify-between group hover:border-purple-500/50 transition-all">
                <div>
                  <p className="text-[10px] font-black text-white group-hover:text-purple-400 transition-colors uppercase italic">{ch.label}</p>
                  <p className="text-[14px] font-black text-purple-500">+{ch.points} PTS</p>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-white/10 flex items-center justify-center group-hover:border-purple-500 transition-all">
                  <div className="w-2 h-2 bg-transparent group-hover:bg-purple-500 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // ... dans ton renderDashboard, partie challengeMode === 'CUSTOM'
) : (
  <div className="space-y-4">
    <div className="flex items-center gap-2 text-purple-500">
      <Target size={14} />
      <span className="text-[10px] font-black uppercase tracking-widest">Objectif de l'unité</span>
    </div>

    {/* On vérifie s'il y a déjà un défi enregistré */}
    {squadService.getSquadChallenge(squadId!) ? (
      // SI UN DÉFI EXISTE : On l'affiche
      <div className="bg-purple-500/10 border border-purple-500/30 p-6 rounded-[24px] animate-in zoom-in duration-300">
        <p className="text-[10px] font-black text-purple-400 uppercase italic mb-1">Mission en cours</p>
        <p className="text-lg font-black text-white uppercase italic leading-tight">
          {squadService.getSquadChallenge(squadId!)?.label}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xl font-black text-purple-500">+{squadService.getSquadChallenge(squadId!)?.points} PTS</span>
          <span className="text-[8px] font-bold text-white/20 uppercase">Fixé aujourd'hui</span>
        </div>
      </div>
    ) : (
      // SI AUCUN DÉFI : On affiche le sélecteur
      <SquadCustomSelector onConfirm={(data) => {
        // 1. Sauvegarde dans le localStorage via le service
        squadService.setSquadChallenge(squadId!, {
          label: data.label,
          points: data.points,
          setAt: new Date().toISOString()
        });

        // 2. Notification automatique dans le chat
        squadService.sendMessage(squadId!, `🚨 NOUVEL OBJECTIF : ${data.label} (+${data.points} PTS)`, "SYSTEM");
        
        // 3. Forcer la mise à jour de l'affichage
        setActiveTab('routine'); 
      }} />
    )}
  </div>
)}
          {activeTab === 'chat' && (
            <div className="h-full flex flex-col">
              <div className="p-4 bg-[#0A0A0A] border-b border-white/5 flex items-center gap-3">
                <button onClick={() => setActiveTab('routine')} className="text-white/40"><ArrowLeft size={20}/></button>
                <span className="text-[10px] font-black uppercase tracking-widest italic">Canal Tactique : {squadId}</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <SquadChat 
                  messages={messages} 
                  newMessage={newMessage} 
                  setNewMessage={setNewMessage} 
                  onSend={handleSendMessage} 
                  myName={avatar.name || "Moi"} 
                />
              </div>
            </div>
          )}

          {activeTab === 'profil' && (
            <div className="p-8 flex flex-col items-center space-y-6">
              <div className="w-32 h-32 rounded-3xl border-2 border-purple-500 overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${avatar.seed}`} alt="Profile" />
              </div>
              <h3 className="text-2xl font-black uppercase italic">{avatar.name}</h3>
              <button onClick={handleAbandonSquad} className="w-full py-4 bg-red-950/20 border border-red-900/40 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                Démanteler la liaison
              </button>
            </div>
          )}
        </main>

        <nav className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-2xl border-t border-white/10 p-4 pb-8 flex justify-around items-center">
          <button onClick={() => setActiveTab('routine')} className={`flex flex-col items-center gap-1 ${activeTab === 'routine' ? 'text-purple-500' : 'text-white/20'}`}>
            <LayoutDashboard size={20} /><span className="text-[8px] font-black uppercase tracking-tighter">Missions</span>
          </button>
          <button onClick={() => setActiveTab('membres')} className={`flex flex-col items-center gap-1 ${activeTab === 'membres' ? 'text-purple-500' : 'text-white/20'}`}>
            <Users size={20} /><span className="text-[8px] font-black uppercase tracking-tighter">Unité</span>
          </button>
          <button onClick={() => setActiveTab('chat')} className={`p-4 rounded-[22px] -translate-y-8 shadow-[0_0_30px_rgba(147,51,234,0.3)] border-4 border-black transition-all ${activeTab === 'chat' ? 'bg-white text-black scale-110' : 'bg-purple-600 text-white'}`}>
            <MessageSquare size={26} />
          </button>
          <button onClick={() => setActiveTab('boosts')} className={`flex flex-col items-center gap-1 ${activeTab === 'boosts' ? 'text-purple-500' : 'text-white/20'}`}>
            <Zap size={20} /><span className="text-[8px] font-black uppercase tracking-tighter">Boosts</span>
          </button>
          <button onClick={() => setActiveTab('profil')} className={`flex flex-col items-center gap-1 ${activeTab === 'profil' ? 'text-purple-500' : 'text-white/20'}`}>
            <User size={20} /><span className="text-[8px] font-black uppercase tracking-tighter">Profil</span>
          </button>
        </nav>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 'list': return renderSquadList();
      case 'join': return <SquadJoin inputCode={inputCode} setInputCode={setInputCode} onJoin={handleJoin} isLoading={false} error={error} onBack={onBack} />;
      case 'config': return (
        <SquadConfig 
          duration={duration} 
          setDuration={setDuration} 
          maxMembers={maxMembers} 
          setMaxMembers={setMaxMembers} 
          challengeMode={challengeMode}
          setChallengeMode={setChallengeMode}
          onConfirm={() => setStep('contract')} 
          onBack={() => setStep('join')} 
        />
      );
      case 'contract': return <SquadContract squadId={squadId || "UNITÉ-ALPHA"} duration={duration} onSign={handleSign} onBack={() => setStep('join')} />;
      case 'dashboard': return renderDashboard();
      default: return null;
    }
  };

  return <div className="bg-black min-h-screen">{renderCurrentStep()}</div>;
}
