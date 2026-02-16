import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, MessageSquare, Zap, User, 
  CheckCircle2, Trophy, ArrowLeft, ChevronLeft, Share2, Copy, Plus 
} from 'lucide-react';

import { SquadJoin } from './Squad/SquadJoin';
import { SquadConfig } from './Squad/SquadConfig';
import { SquadContract } from './Squad/SquadContract';
import { SquadChat } from './Squad/SquadChat';
import { squadService } from '../services/squadService'; // Import du service

interface SquadModeProps {
  onBack: () => void;
}

export default function SquadMode({ onBack }: SquadModeProps) {
  // --- ÉTATS ---
  const [step, setStep] = useState<'list' | 'join' | 'config' | 'contract' | 'dashboard'>('join');
  const [activeTab, setActiveTab] = useState('routine');
  const [mySquads, setMySquads] = useState<string[]>([]);
  const [squadId, setSquadId] = useState<string | null>(localStorage.getItem('squad_id'));
  const [duration, setDuration] = useState(30);
  const [maxMembers, setMaxMembers] = useState(3);
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState("");

  // --- INITIALISATION ---
  useEffect(() => {
    const saved = squadService.getMySquads();
    setMySquads(saved);

    const currentId = localStorage.getItem('squad_id');
    if (currentId && saved.includes(currentId)) {
      const isSigned = localStorage.getItem(`squad_signed_${currentId}`) === 'true';
      setSquadId(currentId);
      setStep(isSigned ? 'dashboard' : 'contract');
    } else if (saved.length > 0) {
      setStep('list');
    }
  }, []);

  // --- VALIDATION ADN ---
  const validateUsername = (name: string): string | null => {
    const trimmed = name.trim().toLowerCase();
    if (trimmed.length < 3) return "NOM TROP COURT";
    if (/^\d+$/.test(trimmed)) return "IDENTIFIANT NUMÉRIQUE REFUSÉ";
    if (!/[a-z]/.test(trimmed)) return "LETTRES REQUISES";
    return null;
  };

  // --- ACTIONS ---
  const handleJoin = (id: string, isNew: boolean) => {
    setError("");
    const avatar = localStorage.getItem('future_library_avatar');
    if (!avatar) { setError("INITIALISEZ VOTRE ADN EN SOLO"); return; }

    if (isNew) {
      if (mySquads.length >= 2) { setError("LIMITE : 2 UNITÉS MAX"); return; }
      const newCode = "UNIT-" + Math.random().toString(36).substring(2, 7).toUpperCase();
      setSquadId(newCode);
      setStep('config');
    } else {
      const code = id.toUpperCase().trim();
      if (!code) { setError("CODE REQUIS"); return; }

      // VÉRIFICATION D'EXISTENCE VIA SERVICE
      if (!squadService.exists(code)) {
        setError("UNITÉ INTROUVABLE. VÉRIFIEZ LE CODE OU CRÉEZ UNE UNITÉ.");
        return;
      }

      setSquadId(code);
      setStep('contract');
    }
  };

  const handleSign = () => {
    if (squadId) {
      squadService.registerUnit(squadId); // Enregistre dans le système global
      squadService.saveToMySquads(squadId); // Ajoute à ma liste
      setMySquads(squadService.getMySquads());
      
      localStorage.setItem('squad_id', squadId);
      localStorage.setItem(`squad_signed_${squadId}`, 'true');
      setStep('dashboard');
    }
  };

  const handleAbandonSquad = () => {
    if (window.confirm("QUITTER CETTE UNITÉ ?")) {
      const remaining = squadService.removeFromMySquads(squadId!);
      setMySquads(remaining);
      localStorage.removeItem('squad_id');
      setSquadId(null);
      setStep(remaining.length > 0 ? 'list' : 'join');
    }
  };

  // --- PARTAGE ---
  const copyToClipboard = () => {
    if (squadId) { navigator.clipboard.writeText(squadId); alert("CODE COPIÉ !"); }
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=Rejoins mon unité : ${squadId}`, '_blank');
  };

  // --- RENDUS ---
  const renderSquadList = () => (
    <div className="p-6 flex flex-col items-center justify-center min-h-[80vh] space-y-8 animate-in fade-in bg-black">
      <div className="text-center">
        <h2 className="text-3xl font-black italic uppercase text-white">Vos Unités</h2>
        <p className="text-[10px] text-purple-500 font-black tracking-widest uppercase">Sélectionnez une mission</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        {mySquads.map((id) => (
          <button 
            key={id}
            onClick={() => { setSquadId(id); setStep('dashboard'); localStorage.setItem('squad_id', id); }}
            className="w-full p-6 bg-[#0A0A0A] border border-white/10 rounded-[28px] flex items-center justify-between hover:border-purple-500 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white font-black">{id.charAt(5) || "U"}</div>
              <div className="text-left">
                <p className="font-black italic text-lg uppercase text-white">{id}</p>
                <p className="text-[9px] text-white/40 uppercase font-bold">Entrer dans la base</p>
              </div>
            </div>
            <ChevronLeft size={20} className="rotate-180 text-white/20 group-hover:text-purple-500" />
          </button>
        ))}

        {mySquads.length < 2 && (
          <button onClick={() => setStep('join')} className="w-full p-6 border-2 border-dashed border-white/5 rounded-[28px] flex items-center justify-center gap-3 text-white/30 hover:text-white transition-all">
            <Plus size={20} /> <span className="font-black uppercase text-xs italic">Nouvelle Unité</span>
          </button>
        )}
      </div>
      <button onClick={onBack} className="text-[10px] font-black uppercase text-white/20">Retour au Hub</button>
    </div>
  );

  const renderDashboard = () => {
    const avatar = JSON.parse(localStorage.getItem('future_library_avatar') || '{}');
    return (
      <div className="flex flex-col h-screen bg-black text-white max-w-md mx-auto overflow-hidden relative border-x border-white/5 font-sans">
        {activeTab !== 'chat' && (
          <header className="p-6 bg-[#0A0A0A] border-b border-white/10 animate-in fade-in slide-in-from-top duration-500 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <button onClick={() => setStep('list')} className="p-2 -ml-2 text-white/40 hover:text-white transition-colors"><ChevronLeft size={24} /></button>
                <div>
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">UNITÉ : {squadId}</h2>
                  <div className="flex gap-3 mt-1">
                    <button onClick={copyToClipboard} className="flex items-center gap-1 text-[8px] font-black text-white/40 uppercase hover:text-white"><Copy size={10} /> Copier</button>
                    <button onClick={shareWhatsApp} className="flex items-center gap-1 text-[8px] font-black text-green-500 uppercase hover:text-green-400"><Share2 size={10} /> WhatsApp</button>
                  </div>
                </div>
              </div>
              <div className="flex -space-x-3">
                <div className="w-9 h-9 rounded-xl border-2 border-purple-500 bg-zinc-800 overflow-hidden shadow-lg z-10">
                  <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${avatar.seed}`} alt="member" />
                </div>
                {Array.from({ length: Math.min(maxMembers - 1, 3) }).map((_, i) => (
                  <div key={i} className="w-9 h-9 rounded-xl border-2 border-dashed border-white/10 bg-black/40 flex items-center justify-center text-[10px] text-white/20 font-black">+</div>
                ))}
              </div>
            </div>
            <div className="space-y-2 bg-black/40 p-3 rounded-2xl border border-white/5">
              <div className="flex justify-between text-[8px] font-black uppercase text-white/30 tracking-widest">
                <span>Sync. Unité ({maxMembers} membres)</span>
                <span className="text-purple-400 italic animate-pulse">Recherche...</span>
              </div>
              <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-900 to-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: '15%' }}></div>
              </div>
            </div>
          </header>
        )}

        <main className="flex-1 overflow-y-auto bg-black pb-24">
          {activeTab === 'routine' && (
            <div className="p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4">
               <h3 className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em]">Missions de l'escouade</h3>
               <div className="bg-[#0A0A0A] p-5 rounded-[28px] border border-white/5 flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-2xl border border-white/5 flex items-center justify-center text-xl text-orange-500">⚡</div>
                    <div>
                      <p className="text-[9px] font-bold uppercase text-orange-500 italic">En attente de déploiement</p>
                      <p className="font-black text-white uppercase italic text-sm">Rassemblement</p>
                    </div>
                  </div>
                  <CheckCircle2 size={20} className="text-white/10" />
               </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="h-full flex flex-col">
              <div className="p-4 bg-[#0A0A0A] border-b border-white/5 flex items-center gap-3">
                <button onClick={() => setActiveTab('routine')} className="text-white/40"><ArrowLeft size={20}/></button>
                <span className="text-[10px] font-black uppercase tracking-widest italic">Canal {squadId}</span>
              </div>
              <div className="flex-1">
                <SquadChat messages={[]} newMessage="" setNewMessage={() => {}} onSend={(e:any) => e.preventDefault()} myName={avatar.name || "Moi"} />
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

          {['membres', 'boosts'].includes(activeTab) && (
            <div className="h-full flex flex-col items-center justify-center text-white/10 space-y-4 min-h-[50vh]">
              <Trophy size={48} />
              <p className="font-black uppercase text-[10px] tracking-[0.4em] italic text-center px-10">Données restreintes</p>
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
          <button onClick={() => setActiveTab('chat')} className={`p-4 rounded-[22px] -translate-y-8 shadow-[0_0_30px_rgba(147,51,234,0.3)] border-4 border-black transition-all ${activeTab === 'chat' ? 'bg-white text-black' : 'bg-purple-600 text-white'}`}>
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
      case 'config': return <SquadConfig duration={duration} setDuration={setDuration} maxMembers={maxMembers} setMaxMembers={setMaxMembers} onConfirm={() => setStep('contract')} onBack={() => setStep('join')} />;
      case 'contract': return <SquadContract squadId={squadId || "UNITÉ-ALPHA"} duration={duration} onSign={handleSign} onBack={() => setStep('join')} />;
      case 'dashboard': return renderDashboard();
      default: return null;
    }
  };

  return <div className="bg-black min-h-screen">{renderCurrentStep()}</div>;
}
