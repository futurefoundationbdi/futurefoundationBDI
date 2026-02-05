import React, { useState, useEffect } from 'react';

// 12 Styles différents (Seeds) pour DiceBear - Style "Adventurer"
const AVATAR_ARCHETYPES = [
  { id: "1", seed: "Felix", label: "L'Explorateur" },
  { id: "2", seed: "Aneka", label: "La Gardienne" },
  { id: "3", seed: "Jack", label: "Le Mentor" },
  { id: "4", seed: "Aiden", label: "Le Visionnaire" },
  { id: "5", seed: "Luna", label: "L'Érudite" },
  { id: "6", seed: "Zoe", label: "La Rebelle" },
  { id: "7", seed: "Jasper", label: "Le Stratège" },
  { id: "8", seed: "Milo", label: "L'Optimiste" },
  { id: "9", seed: "Sasha", label: "L'Analyste" },
  { id: "10", seed: "Oliver", label: "L'Artisan" },
  { id: "11", seed: "Nova", label: "L'Héroïne" },
  { id: "12", seed: "Leo", label: "Le Brave" },
];

export default function AvatarSystem({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [selectedSeed, setSelectedSeed] = useState(AVATAR_ARCHETYPES[0].seed);
  const [name, setName] = useState("");
  const [status, setStatus] = useState({ health: 100, isDead: false });

  // URL dynamique DiceBear
  const getAvatarUrl = (seed: string) => `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=b6e3f4,ffd5dc,c0aede`;

  const handleCreate = () => {
    if (!name) return alert("Nomme ton avatar avant d'entrer dans le Sanctuaire.");
    const newAvatar = { name, seed: selectedSeed, health: 100, level: 1, lastActive: new Date() };
    localStorage.setItem('future_avatar', JSON.stringify(newAvatar));
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-12">
        <button onClick={onBack} className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 hover:opacity-100">← Retour</button>
        <h1 className="text-xl font-black italic tracking-tighter uppercase text-emerald-500">The Sanctuary</h1>
      </div>

      {step === 1 && (
        <div className="text-center space-y-8 animate-in fade-in duration-700">
          <h2 className="text-6xl font-black uppercase italic leading-none">Choisis ton <br/> <span className="text-emerald-500">Archétype</span></h2>
          
          {/* Grille de 12 Avatars */}
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl">
            {AVATAR_ARCHETYPES.map((avatar) => (
              <button 
                key={avatar.id}
                onClick={() => setSelectedSeed(avatar.seed)}
                className={`p-2 rounded-2xl border-2 transition-all ${selectedSeed === avatar.seed ? 'border-emerald-500 bg-emerald-500/10 scale-105' : 'border-white/5 hover:border-white/20'}`}
              >
                <img src={getAvatarUrl(avatar.seed)} alt={avatar.label} className="w-full h-auto" />
                <p className="text-[8px] font-black uppercase mt-2 opacity-60">{avatar.label}</p>
              </button>
            ))}
          </div>

          <div className="pt-8">
            <input 
              type="text" 
              placeholder="Nom de l'initié..." 
              className="bg-white/5 border border-white/10 px-6 py-4 rounded-full text-center font-bold outline-none focus:border-emerald-500 mb-6 w-64"
              onChange={(e) => setName(e.target.value)}
            />
            <br/>
            <button onClick={handleCreate} className="px-12 py-5 bg-white text-black font-black uppercase text-[10px] rounded-full hover:bg-emerald-500 transition-all">Incarnation</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center space-y-6">
          <div className="relative group">
            {/* L'IMAGE QUI FANE SELON LA SANTÉ */}
            <div 
              className="w-64 h-64 mx-auto transition-all duration-1000"
              style={{ 
                filter: `saturate(${status.health}%) brightness(${50 + status.health/2}%) ${status.isDead ? 'grayscale(100%)' : ''}`,
                transform: status.isDead ? 'translateY(20px) rotate(5deg)' : 'none'
              }}
            >
              <img src={getAvatarUrl(selectedSeed)} alt="Avatar" />
              {status.isDead && <div className="absolute inset-0 flex items-center justify-center text-6xl">🪦</div>}
            </div>

            {/* Barre de Vie */}
            <div className="w-48 h-1 bg-white/10 mx-auto rounded-full mt-8 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${status.health < 30 ? 'bg-red-500' : 'bg-emerald-500'}`}
                style={{ width: `${status.health}%` }}
              />
            </div>
            <p className="text-[10px] font-black uppercase mt-2 tracking-widest text-white/40">Vitalité : {status.health}%</p>
          </div>

          <div className="pt-8">
            <h3 className="text-3xl font-black uppercase italic">{name}</h3>
            <p className="text-emerald-500 font-bold text-xs uppercase tracking-[0.3em]">
              {status.isDead ? "ÉCHEC DE LA MISSION" : "JOUR 1 / 31"}
            </p>
            
            {status.isDead ? (
              <button 
                onClick={() => window.location.reload()}
                className="mt-8 px-10 py-4 bg-red-600 text-white font-black uppercase text-[10px] rounded-full"
              >
                Recommencer à zéro
              </button>
            ) : (
              <button onClick={onBack} className="mt-8 px-10 py-4 border border-white/20 hover:bg-white hover:text-black font-black uppercase text-[10px] rounded-full transition-all">
                Accéder aux lectures
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
