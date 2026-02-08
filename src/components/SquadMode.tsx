import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, MessageSquare, Zap, User, 
  Droplets, CheckCircle2, Trophy, ShieldAlert
} from 'lucide-react';

// Import de tes composants mis à jour
import { SquadJoin } from './Squad/SquadJoin';
import { SquadConfig } from './Squad/SquadConfig';
import { SquadContract } from './Squad/SquadContract';
import { SquadChat } from './Squad/SquadChat';

export default function SquadMode({ onBack }: { onBack: () => void }) {
  // États de navigation
  const [step, setStep] = useState<'join' | 'config' | 'contract' | 'dashboard'>('join');
  const [activeTab, setActiveTab] = useState('routine');
  
  // États de données
  const [squadId, setSquadId] = useState<string | null>(localStorage.getItem('squad_id'));
  const [duration, setDuration] = useState(30);
  const [inputCode, setInputCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialisation au chargement
  useEffect(() => {
    if (squadId) {
      const signed = localStorage.getItem('squad_signed') === 'true';
      setStep(signed ? 'dashboard' : 'contract');
    }
  }, [squadId]);

  // Actions
  const handleJoin = (id: string, isNew: boolean) => {
    if (isNew) {
      setStep('config');
    } else {
      if (!id) return setError("Code d'unité requis");
      setSquadId(id);
      localStorage.setItem('squad_id', id);
      setStep('contract');
    }
  };

  const handleSign = () => {
    localStorage.setItem('squad_signed', 'true');
    setStep('dashboard');
  };

  // --- RENDU DES ÉTAPES DE PRÉPARATION ---

  if (step === 'join') return (
    <div className="bg-black min-h-screen">
      <SquadJoin 
        inputCode={inputCode} setInputCode={setInputCode} 
        onJoin={handleJoin} isLoading={isLoading} 
        error={error} onBack={onBack} 
      />
    </div>
  );

  if (step === 'config') return (
    <div className="bg-black min-h-screen">
      <SquadConfig 
        duration={duration} setDuration={setDuration} 
        onConfirm={() => setStep('contract')} 
        onBack={() => setStep('join')}
      />
    </div>
  );

  if (step === 'contract') return (
    <SquadContract 
      squadId={squadId || "UNITÉ-ALPHA"} 
      duration={duration} 
      onSign={handleSign} 
    />
  );

  // --- DASHBOARD FINAL (Look Dark Tactique) ---
  return (
    <div className="flex flex-col h-screen bg-black text-white max-w-md mx-auto overflow-hidden relative font-sans border-x border-white/5">
      
      {/* 1. Header Tactique / Status Bar */}
      {activeTab !== 'chat' && (
        <header className="p-6 bg-[#0A0A0A] border-b border-white/10 animate-in fade-in slide-in-from-top duration-500 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">JOUR 01</h2>
              <p className="text-[9px] font-black text-purple-500 uppercase tracking-[0.3em]">Opération en cours</p>
            </div>
            
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-9 h-9 rounded-xl border-2 border-black bg-zinc-800 overflow-hidden shadow-lg">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Elite${i}`} alt="member" />
                </div>
              ))}
              <div className="w-9 h-9 rounded-xl border-2 border-black bg-purple-600 flex items-center justify-center text-[10px] text-white font-black shadow-lg">+2</div>
            </div>
          </div>

          {/* Barre de progression d'unité style "Gauge" */}
          <div className="space-y-2 bg-black/40 p-3 rounded-2xl border border-white/5">
            <div className="flex justify-between text-[8px] font-black uppercase text-white/30 tracking-widest">
              <span>Synchronisation Unité</span>
              <span className="text-purple-400">12.5%</span>
            </div>
            <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-900 to-purple-500 transition-all duration-1000 shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: '12.5%' }}></div>
            </div>
          </div>

          {/* Widget Eau Tactique */}
          <div className="mt-4 bg-purple-900/10 p-4 rounded-[24px] border border-purple-500/20 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="bg-black p-3 rounded-2xl text-purple-500 border border-purple-500/30 shadow-inner">
                <Droplets size={20} className="animate-pulse" />
              </div>
              <div>
                <p className="text-[8px] font-black text-purple-400 uppercase tracking-widest">Collectif Eau</p>
                <p className="text-lg font-black text-white tracking-tighter">4.2<span className="text-xs text-white/40"> / 18L</span></p>
              </div>
            </div>
            <button className="bg-purple-600 text-white p-3 rounded-2xl shadow-lg active:scale-90 transition-all border border-purple-400">
              <CheckCircle2 size={20} />
            </button>
          </div>
        </header>
      )}

      {/* 2. Main Content Zone */}
      <main className="flex-1 overflow-y-auto bg-black">
        {activeTab === 'routine' && (
          <div className="p-6 space-y-4 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em]">Missions de l'escouade</h3>
              <ShieldAlert size={14} className="text-white/10" />
            </div>

            {/* Liste de tâches style "Liste Noire" */}
            {[
              { time: "06:00", title: "Rassemblement", type: "Système", icon: "⚡", color: "text-orange-500" },
              { time: "12:00", title: "Focus Profond", type: "Discipline", icon: "🧠", color: "text-blue-500" },
              { time: "18:00", title: "Entraînement", type: "Physique", icon: "🔥", color: "text-red-500" }
            ].map((task, idx) => (
              <div key={idx} className="bg-[#0A0A0A] p-5 rounded-[28px] border border-white/5 flex items-center justify-between shadow-sm group active:bg-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black rounded-2xl border border-white/5 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                    {task.icon}
                  </div>
                  <div>
                    <p className={`text-[9px] font-bold uppercase tracking-tighter ${task.color}`}>{task.time} • {task.type}</p>
                    <p className="font-black text-white uppercase italic text-sm tracking-tight">{task.title}</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/10 group-hover:border-purple-500/50 transition-colors">
                  <CheckCircle2 size={20} />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="h-full">
            <SquadChat messages={[]} newMessage="" setNewMessage={() => {}} onSend={(e:any) => e.preventDefault()} myName="Moi" />
          </div>
        )}
        
        {['membres', 'boosts', 'profil'].includes(activeTab) && (
          <div className="h-full flex flex-col items-center justify-center text-white/10 space-y-4">
            <Trophy size={48} />
            <p className="font-black uppercase text-[10px] tracking-[0.4em] italic">Section Cryptée</p>
          </div>
        )}
      </main>

      {/* 3. Navigation Basse (Tab Bar) */}
      <nav className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-2xl border-t border-white/10 p-4 pb-8 flex justify-around items-center">
        <button onClick={() => setActiveTab('routine')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'routine' ? 'text-purple-500 scale-110' : 'text-white/20'}`}>
          <LayoutDashboard size={20} />
          <span className="text-[8px] font-black uppercase tracking-tighter">Missions</span>
        </button>
        
        <button onClick={() => setActiveTab('membres')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'membres' ? 'text-purple-500 scale-110' : 'text-white/20'}`}>
          <Users size={20} />
          <span className="text-[8px] font-black uppercase tracking-tighter">Unité</span>
        </button>

        {/* Bouton Central Chat Style Bouton d'urgence */}
        <button 
          onClick={() => setActiveTab('chat')} 
          className={`p-4 rounded-[22px] -translate-y-8 shadow-[0_0_30px_rgba(147,51,234,0.3)] transition-all border-4 border-black ${
            activeTab === 'chat' ? 'bg-white text-black' : 'bg-purple-600 text-white'
          }`}
        >
          <MessageSquare size={26} />
        </button>

        <button onClick={() => setActiveTab('boosts')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'boosts' ? 'text-purple-500 scale-110' : 'text-white/20'}`}>
          <Zap size={20} />
          <span className="text-[8px] font-black uppercase tracking-tighter">Boosts</span>
        </button>

        <button onClick={() => setActiveTab('profil')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'profil' ? 'text-purple-500 scale-110' : 'text-white/20'}`}>
          <User size={20} />
          <span className="text-[8px] font-black uppercase tracking-tighter">Profil</span>
        </button>
      </nav>
    </div>
  );
}
