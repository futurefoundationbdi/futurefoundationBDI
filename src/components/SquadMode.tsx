import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, MessageSquare, Zap, User, 
  Droplets, CheckCircle2, Trophy 
} from 'lucide-react';

// Import de tes composants séparés
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
      if (!id) return setError("Code requis");
      setSquadId(id);
      localStorage.setItem('squad_id', id);
      setStep('contract');
    }
  };

  const handleSign = () => {
    localStorage.setItem('squad_signed', 'true');
    setStep('dashboard');
  };

  // --- RENDU DES ÉTAPES ---

  if (step === 'join') return (
    <div className="bg-[#F8F9FF] min-h-screen">
      <SquadJoin 
        inputCode={inputCode} setInputCode={setInputCode} 
        onJoin={handleJoin} isLoading={isLoading} 
        error={error} onBack={onBack} 
      />
    </div>
  );

  if (step === 'config') return (
    <div className="bg-[#F8F9FF] min-h-screen">
      <SquadConfig 
        duration={duration} setDuration={setDuration} 
        onConfirm={() => setStep('contract')} 
        onBack={() => setStep('join')}
      />
    </div>
  );

  if (step === 'contract') return (
    <SquadContract 
      squadId={squadId || "NOUVELLE UNITÉ"} 
      duration={duration} 
      onSign={handleSign} 
    />
  );

  // --- DASHBOARD FINAL (Look Me+) ---
  return (
    <div className="flex flex-col h-screen bg-[#F8F9FF] text-slate-900 max-w-md mx-auto shadow-2xl overflow-hidden relative font-sans">
      
      {/* 1. Header Tactique */}
      {activeTab !== 'chat' && (
        <header className="p-6 bg-white border-b border-slate-100 animate-in fade-in slide-in-from-top duration-500">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-black italic uppercase tracking-tighter">Jour 01</h2>
            <div className="flex -space-x-2">
              {[1, 2].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="member" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-600 flex items-center justify-center text-[10px] text-white font-bold">+1</div>
            </div>
          </div>

          {/* Barre de progression d'unité */}
          <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-black uppercase text-slate-400 tracking-widest">
              <span>Progression Unité</span>
              <span className="text-purple-600">8%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 transition-all duration-1000" style={{ width: '8%' }}></div>
            </div>
          </div>

          {/* Objectif Eau Collectif */}
          <div className="mt-4 bg-blue-50/50 p-4 rounded-[24px] border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl text-blue-500 shadow-sm"><Droplets size={20} /></div>
              <div>
                <p className="text-[9px] font-black text-blue-400 uppercase">Objectif Eau</p>
                <p className="text-sm font-black text-blue-900 tracking-tight">2.5L / 15L</p>
              </div>
            </div>
            <button className="bg-white text-blue-600 p-2 rounded-full shadow-sm hover:scale-110 transition-transform">
              <CheckCircle2 size={24} />
            </button>
          </div>
        </header>
      )}

      {/* 2. Contenu Principal */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'routine' && (
          <div className="p-6 space-y-4 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Missions du jour</h3>
            {/* Exemple de tâche système */}
            <div className="bg-white p-5 rounded-[28px] border border-slate-50 flex items-center justify-between shadow-sm group active:scale-95 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl">⚡</div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">08:00 • Système</p>
                  <p className="font-black text-slate-800 uppercase italic text-sm">Réveil Stratégique</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-200">
                <CheckCircle2 size={20} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="h-full">
            <SquadChat messages={[]} newMessage="" setNewMessage={() => {}} onSend={(e) => e.preventDefault()} myName="Moi" />
          </div>
        )}
        
        {/* Placeholder pour les autres onglets */}
        {['membres', 'boosts', 'profil'].includes(activeTab) && (
          <div className="h-full flex items-center justify-center text-slate-300 font-black uppercase text-xs italic">
            Section {activeTab} en cours...
          </div>
        )}
      </main>

      {/* 3. Tab Bar (Navigation Basse) */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-4 pb-8 flex justify-around items-center">
        <button onClick={() => setActiveTab('routine')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'routine' ? 'text-purple-600 scale-110' : 'text-slate-300'}`}>
          <LayoutDashboard size={20} />
          <span className="text-[8px] font-black uppercase">Routine</span>
        </button>
        
        <button onClick={() => setActiveTab('membres')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'membres' ? 'text-purple-600 scale-110' : 'text-slate-300'}`}>
          <Users size={20} />
          <span className="text-[8px] font-black uppercase">Unité</span>
        </button>

        {/* Bouton Central Chat */}
        <button onClick={() => setActiveTab('chat')} className={`p-4 rounded-full -translate-y-6 shadow-2xl transition-all border-4 border-[#F8F9FF] ${activeTab === 'chat' ? 'bg-black text-white' : 'bg-purple-600 text-white'}`}>
          <MessageSquare size={24} />
        </button>

        <button onClick={() => setActiveTab('boosts')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'boosts' ? 'text-purple-600 scale-110' : 'text-slate-300'}`}>
          <Zap size={20} />
          <span className="text-[8px] font-black uppercase">Boosts</span>
        </button>

        <button onClick={() => setActiveTab('profil')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'profil' ? 'text-purple-600 scale-110' : 'text-slate-300'}`}>
          <User size={20} />
          <span className="text-[8px] font-black uppercase">Profil</span>
        </button>
      </nav>
    </div>
  );
}
