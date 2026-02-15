import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, MessageSquare, Zap, User, 
  Droplets, CheckCircle2, Trophy, ShieldAlert
} from 'lucide-react';

// Import de tes composants (Chemin : ./Squad/...)
import { SquadJoin } from './Squad/SquadJoin';
import { SquadConfig } from './Squad/SquadConfig';
import { SquadContract } from './Squad/SquadContract';
import { SquadChat } from './Squad/SquadChat';

interface SquadModeProps {
  onBack: () => void;
}

export default function SquadMode({ onBack }: SquadModeProps) {
  // --- ÉTATS DE NAVIGATION ---
  const [step, setStep] = useState<'join' | 'config' | 'contract' | 'dashboard'>('join');
  const [activeTab, setActiveTab] = useState('routine');
  
  // --- ÉTATS DE DONNÉES ---
  const [squadId, setSquadId] = useState<string | null>(localStorage.getItem('squad_id'));
  const [duration, setDuration] = useState(30);
  const [inputCode, setInputCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // --- LOGIQUE D'INITIALISATION ---
  useEffect(() => {
    const savedSquadId = localStorage.getItem('squad_id');
    const isSigned = localStorage.getItem('squad_signed') === 'true';

    if (savedSquadId) {
      setSquadId(savedSquadId);
      setStep(isSigned ? 'dashboard' : 'contract');
    }
  }, []);

  // --- ACTIONS DE NAVIGATION ---

  const handleJoin = (id: string, isNew: boolean) => {
    setError(""); // Reset de l'erreur
    
    if (isNew) {
      // CAS 1 : Création d'une nouvelle escouade
      setStep('config');
    } else {
      // CAS 2 : Tentative de rejoindre une escouade existante
      if (!id || id.trim() === "") {
        setError("CODE D'ACCÈS REQUIS");
        return;
      }
      // Simulation de succès (À lier plus tard à ta DB)
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

  const renderCurrentStep = () => {
    switch (step) {
      case 'join':
        return (
          <SquadJoin 
            inputCode={inputCode} 
            setInputCode={setInputCode} 
            onJoin={handleJoin} 
            isLoading={isLoading} 
            error={error} 
            onBack={onBack} 
          />
        );

      case 'config':
        return (
          <SquadConfig 
            duration={duration} 
            setDuration={setDuration} 
            onConfirm={() => setStep('contract')} 
            onBack={() => setStep('join')}
          />
        );

      case 'contract':
        return (
          <SquadContract 
            squadId={squadId || "UNITÉ-ALPHA"} 
            duration={duration} 
            onSign={handleSign} 
            onBack={() => setStep('join')} // Retourne à l'accueil du mode Squad si refusé
          />
        );
      case 'dashboard':
        return renderDashboard();

      default:
        return null;
    }
  };

  // --- RENDU DU DASHBOARD FINAL ---
  const renderDashboard = () => (
    <div className="flex flex-col h-screen bg-black text-white max-w-md mx-auto overflow-hidden relative font-sans border-x border-white/5">
      
      {/* Header Tactique */}
      {activeTab !== 'chat' && (
        <header className="p-6 bg-[#0A0A0A] border-b border-white/10 animate-in fade-in slide-in-from-top duration-500 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">JOUR 01</h2>
              <p className="text-[9px] font-black text-purple-500 uppercase tracking-[0.3em]">Opération active</p>
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

          <div className="space-y-2 bg-black/40 p-3 rounded-2xl border border-white/5">
            <div className="flex justify-between text-[8px] font-black uppercase text-white/30 tracking-widest">
              <span>Sync. Unité</span>
              <span className="text-purple-400">12.5%</span>
            </div>
            <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-900 to-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: '12.5%' }}></div>
            </div>
          </div>
        </header>
      )}

      {/* Contenu Principal */}
      <main className="flex-1 overflow-y-auto bg-black">
        {activeTab === 'routine' && (
          <div className="p-6 space-y-4 pb-32 animate-in fade-in slide-in-from-bottom-4">
             <h3 className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em]">Missions de l'escouade</h3>
             {/* Tes missions ici... */}
             <div className="bg-[#0A0A0A] p-5 rounded-[28px] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black rounded-2xl border border-white/5 flex items-center justify-center text-xl shadow-inner text-orange-500">⚡</div>
                  <div>
                    <p className="text-[9px] font-bold uppercase text-orange-500">06:00 • Système</p>
                    <p className="font-black text-white uppercase italic text-sm">Rassemblement</p>
                  </div>
                </div>
                <CheckCircle2 size={20} className="text-white/10" />
             </div>
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
            <p className="font-black uppercase text-[10px] tracking-[0.4em] italic text-center px-10">Accès restreint aux membres certifiés</p>
          </div>
        )}
      </main>

      {/* Navigation Basse */}
      <nav className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-2xl border-t border-white/10 p-4 pb-8 flex justify-around items-center">
        <button onClick={() => setActiveTab('routine')} className={`flex flex-col items-center gap-1 ${activeTab === 'routine' ? 'text-purple-500' : 'text-white/20'}`}>
          <LayoutDashboard size={20} />
          <span className="text-[8px] font-black uppercase tracking-tighter">Missions</span>
        </button>
        
        <button onClick={() => setActiveTab('membres')} className={`flex flex-col items-center gap-1 ${activeTab === 'membres' ? 'text-purple-500' : 'text-white/20'}`}>
          <Users size={20} />
          <span className="text-[8px] font-black uppercase tracking-tighter">Unité</span>
        </button>

        <button 
          onClick={() => setActiveTab('chat')} 
          className={`p-4 rounded-[22px] -translate-y-8 shadow-[0_0_30px_rgba(147,51,234,0.3)] border-4 border-black transition-all ${
            activeTab === 'chat' ? 'bg-white text-black' : 'bg-purple-600 text-white'
          }`}
        >
          <MessageSquare size={26} />
        </button>

        <button onClick={() => setActiveTab('boosts')} className={`flex flex-col items-center gap-1 ${activeTab === 'boosts' ? 'text-purple-500' : 'text-white/20'}`}>
          <Zap size={20} />
          <span className="text-[8px] font-black uppercase tracking-tighter">Boosts</span>
        </button>

        <button onClick={() => setActiveTab('profil')} className={`flex flex-col items-center gap-1 ${activeTab === 'profil' ? 'text-purple-500' : 'text-white/20'}`}>
          <User size={20} />
          <span className="text-[8px] font-black uppercase tracking-tighter">Profil</span>
        </button>
      </nav>
    </div>
  );

  return (
    <div className="bg-black min-h-screen">
      {renderCurrentStep()}
    </div>
  );
}
