import React, { useState, useEffect } from 'react';

interface AvatarSystemProps {
  onBack: () => void;
}

export default function AvatarSystem({ onBack }: AvatarSystemProps) {
  const [step, setStep] = useState(1);
  const [avatarConfig, setAvatarConfig] = useState({
    seed: Math.random().toString(36).substring(7),
    flip: false,
    backgroundColor: "b6e3f4", // Bleu ciel pro
  });

  const [userName, setUserName] = useState("");

  // Génération de l'URL de l'avatar (Style "Adventurer" - Pro et Fun)
  // On utilise l'API DiceBear qui est gratuite et ultra-performante
  const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarConfig.seed}&flip=${avatarConfig.flip}&backgroundColor=${avatarConfig.backgroundColor}`;

  const randomize = () => {
    setAvatarConfig(prev => ({ ...prev, seed: Math.random().toString(36).substring(7) }));
  };

  const handleSave = () => {
    if (!userName) return alert("Donne un nom à ton avatar pour sceller le contrat.");
    
    const finalAvatar = {
      name: userName,
      url: avatarUrl,
      level: 1,
      xp: 0,
      createdAt: new Date().toISOString(),
      daysActive: 0
    };
    
    localStorage.setItem('future_library_avatar', JSON.stringify(finalAvatar));
    setStep(3); // Passage à la confirmation/dashboard
  };

  return (
    <div className="min-h-screen aurora-bg text-white p-6 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Bouton Retour */}
      <button onClick={onBack} className="absolute top-8 left-8 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-emerald-400 transition-colors z-50">
        ← Quitter le Sanctuaire
      </button>

      <div className="max-w-4xl w-full z-10">
        {step === 1 && (
          <div className="text-center animate-in fade-in zoom-in-95 duration-700">
            <h2 className="text-5xl md:text-7xl font-black uppercase italic mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">Le Sanctuaire</h2>
            <p className="text-slate-400 max-w-lg mx-auto mb-12 italic text-sm leading-relaxed">
              "L'identité numérique est le premier pas vers la discipline physique. 
              Crée ton double pour débuter ta quête de 31 jours."
            </p>
            <button 
              onClick={() => setStep(2)}
              className="px-12 py-5 bg-emerald-500 text-black font-black uppercase text-[11px] rounded-full hover:scale-105 transition-all shadow-xl shadow-emerald-500/20"
            >
              Commencer la création
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-black/60 backdrop-blur-3xl p-8 md:p-12 rounded-[3rem] border border-white/10 animate-in slide-in-from-bottom-10 duration-700 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              
              {/* VISU AVATAR DYNAMIQUE */}
              <div className="relative group">
                <div className="w-full aspect-square bg-gradient-to-b from-white/10 to-transparent rounded-[2rem] flex items-center justify-center border border-white/10 p-8 relative overflow-hidden">
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]" />
                </div>
                <button 
                  onClick={randomize}
                  className="absolute -bottom-4 right-4 bg-white text-black p-4 rounded-full shadow-xl hover:rotate-180 transition-transform duration-500"
                >
                  🔄
                </button>
              </div>

              {/* CONTROLES */}
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-black uppercase text-emerald-500 mb-3 block tracking-widest">Nom de l'initié</label>
                  <input 
                    type="text" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Ton nom ou pseudo..."
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-emerald-500 transition-colors text-white font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <button 
                    onClick={() => setAvatarConfig(prev => ({...prev, flip: !prev.flip}))}
                    className="py-4 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase hover:bg-white/10 transition-all"
                  >
                    Pivoter
                  </button>
                  <button 
                    onClick={() => setAvatarConfig(prev => ({...prev, backgroundColor: prev.backgroundColor === "b6e3f4" ? "ffd5dc" : "b6e3f4"}))}
                    className="py-4 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase hover:bg-white/10 transition-all"
                  >
                    Changer Fond
                  </button>
                </div>

                <button 
                  onClick={handleSave}
                  className="w-full py-6 bg-emerald-500 text-black font-black uppercase text-[11px] rounded-2xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Finaliser l'incarnation
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center animate-in fade-in zoom-in-95 duration-700">
             <div className="w-40 h-40 mx-auto mb-8 bg-emerald-500/20 rounded-full p-4 border border-emerald-500/40">
                <img src={JSON.parse(localStorage.getItem('future_library_avatar') || '{}').url} alt="Final" className="w-full h-full object-contain" />
             </div>
             <h2 className="text-4xl font-black uppercase italic mb-4">Bienvenue, {userName}</h2>
             <p className="text-emerald-500 font-bold text-xs uppercase tracking-widest mb-10">Jour 1 / 31 — Initié</p>
             <button 
              onClick={onBack}
              className="px-12 py-5 border border-white/20 text-white font-black uppercase text-[10px] rounded-full hover:bg-white hover:text-black transition-all"
             >
              Commencer ma première lecture
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
