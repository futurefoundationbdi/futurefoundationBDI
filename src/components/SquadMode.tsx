import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, MessageSquare, Zap, User, 
  CheckCircle2, Trophy, ArrowLeft, ChevronLeft 
} from 'lucide-react';

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

  // --- UTILITAIRES DE VALIDATION ---
  const validateUsername = (name: string): string | null => {
    const trimmed = name.trim();
    // Vérifie s'il y a au moins une lettre (évite full emojis ou full chiffres)
    const hasLetters = /[a-zA-ZàâäéèêëîïôöùûüçÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ]/.test(trimmed);
    const isOnlyNumbers = /^\d+$/.test(trimmed);

    if (trimmed.length < 3) return "NOM TROP COURT (MIN. 3)";
    if (!hasLetters) return "LE NOM DOIT CONTENIR DES LETTRES";
    if (isOnlyNumbers) return "NOM UNIQUEMENT COMPOSÉ DE CHIFFRES REFUSÉ";
    return null;
  };

  // --- ACTIONS DE NAVIGATION ---
  const handleJoin = (id: string, isNew: boolean) => {
    setError(""); 
    
    // Vérification de l'existence d'un avatar Solo
    const savedAvatar = localStorage.getItem('future_library_avatar');
    if (!savedAvatar) {
      setError("INITIALISEZ VOTRE ADN EN MODE SOLO D'ABORD");
      return;
    }

    const userData = JSON.parse(savedAvatar);
    const nameValidationError = validateUsername(userData.name);
    if (nameValidationError) {
      setError(nameValidationError);
      return;
    }

    if (isNew) {
      // Création d'un nouveau code unique
      const newCode = "UNIT-" + Math.random().toString(36).substring(2, 7).toUpperCase();
      setSquadId(newCode);
      
      // Simuler l'enregistrement du code dans un registre global
      const registry = JSON.parse(localStorage.getItem('all_active_squads') || '[]');
      localStorage.setItem('all_active_squads', JSON.stringify([...registry, newCode]));
      
      setStep('config');
    } else {
      if (!id || id.trim() === "") {
        setError("CODE D'ACCÈS REQUIS");
        return;
      }

      // Vérifier si le code existe dans notre registre
      const registry = JSON.parse(localStorage.getItem('all_active_squads') || '[]');
      if (!registry.includes(id.toUpperCase())) {
        setError("CODE D'INFILTRATION INVALIDE OU INEXISTANT");
        return;
      }

      setSquadId(id.toUpperCase());
      localStorage.setItem('squad_id', id.toUpperCase());
      setStep('contract');
    }
  };

  const handleSign = () => {
    localStorage.setItem('squad_signed', 'true');
    setStep('dashboard');
  };

  const handleAbandonSquad = () => {
    if (window.confirm("VOULEZ-VOUS VRAIMENT QUITTER CETTE UNITÉ ? TOUTE PROGRESSION SERA PERDUE.")) {
      localStorage.removeItem('squad_id');
      localStorage.removeItem('squad_signed');
      setSquadId(null);
      setStep('join');
    }
  };

  // --- RENDU DU DASHBOARD FINAL ---
  const renderDashboard = () => {
    const avatar = JSON.parse(localStorage.getItem('future_library_avatar') || '{}');

    return (
      <div className="flex flex-col h-screen bg-black text-white max-w-md mx-auto overflow-hidden relative font-sans border-x border-white/5">
        
        {/* Header Tactique */}
        {activeTab !== 'chat' && (
          <header className="p-6 bg-[#0A0A0A] border-b border-white/10 animate-in fade-in slide-in-from-top duration-500 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <button 
                  onClick={onBack}
                  className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
                >
                  <ChevronLeft size={24} />
                </button>
                <div>
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">UNITÉ : {squadId}</h2>
                  <p className="text-[9px] font-black text-purple-500 uppercase tracking-[0.3em]">Opération active</p>
                </div>
              </div>

              {/* Affichage des membres RÉELS (Pour l'instant seulement l'utilisateur) */}
              <div className="flex -space-x-3">
                <div className="w-9 h-9 rounded-xl border-2 border-purple-500 bg-zinc-800 overflow-hidden shadow-lg z-10">
                  <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${avatar.seed}`} alt="member" />
                </div>
                {/* Slots vides pour les futurs membres */}
                <div className="w-9 h-9 rounded-xl border-2 border-dashed border-white/10 bg-black/40 flex items-center justify-center text-[10px] text-white/20 font-black italic">
                  +
                </div>
              </div>
            </div>

            <div className="space-y-2 bg-black/40 p-3 rounded-2xl border border-white/5">
              <div className="flex justify-between text-[8px] font-black uppercase text-white/30 tracking-widest">
                <span>Sync. Unité</span>
                <span className="text-purple-400">0%</span>
              </div>
              <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-900 to-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: '5%' }}></div>
              </div>
            </div>
          </header>
        )}

        {/* Contenu Principal */}
        <main className="flex-1 overflow-y-auto bg-black">
          {activeTab === 'routine' && (
            <div className="p-6 space-y-4 pb-32 animate-in fade-in slide-in-from-bottom-4">
               <h3 className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em]">Missions de l'escouade</h3>
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
            <div className="h-full flex flex-col">
              <div className="p-4 bg-[#0A0A0A] border-b border-white/5 flex items-center gap-3">
                <button onClick={() => setActiveTab('routine')} className="text-white/40"><ArrowLeft size={20}/></button>
                <span className="text-[10px] font-black uppercase tracking-widest italic">Canal de l'Unité</span>
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
              <button 
                onClick={handleAbandonSquad}
                className="w-full py-4 bg-red-950/20 border border-red-900/40 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-500 hover:text-white transition-all"
              >
                Quitter l'escouade actuelle
              </button>
            </div>
          )}

          {['membres', 'boosts'].includes(activeTab) && (
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
  };

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
            onBack={() => {
               localStorage.removeItem('squad_id');
               setSquadId(null);
               setStep('join');
            }} 
          />
        );
      case 'dashboard':
        return renderDashboard();
      default:
        return null;
    }
  };

  return (
    <div className="bg-black min-h-screen">
      {renderCurrentStep()}
    </div>
  );
}
