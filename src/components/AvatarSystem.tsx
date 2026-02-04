import React, { useState } from 'react';

interface AvatarSystemProps {
  onBack: () => void;
}

export default function AvatarSystem({ onBack }: AvatarSystemProps) {
  const [step, setStep] = useState(1); // 1: Welcome, 2: Creation
  const [avatar, setAvatar] = useState(() => {
    const saved = localStorage.getItem('future_library_avatar');
    return saved ? JSON.parse(saved) : {
      name: "",
      skin: "#FFDBAC",
      outfit: "#10b981",
      goal: "discipline",
      level: 1,
      createdDate: Date.now()
    };
  });

  const skinTones = ["#FFDBAC", "#F1C27D", "#E0AC69", "#8D5524", "#C68642"];
  const outfitColors = ["#10b981", "#3b82f6", "#ef4444", "#f59e0b", "#8b5cf6"];

  const handleSave = () => {
    localStorage.setItem('future_library_avatar', JSON.stringify(avatar));
    alert("Avatar synchronisé avec ton âme. Prêt pour 31 jours de quête.");
    onBack();
  };

  return (
    <div className="min-h-screen aurora-bg text-white p-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Bouton Retour */}
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-emerald-400 transition-colors"
      >
        ← Retour à la bibliothèque
      </button>

      <div className="max-w-4xl w-full z-10">
        {step === 1 ? (
          <div className="text-center animate-in fade-in zoom-in-95 duration-700">
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/30">
              <span className="text-4xl">✨</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase italic mb-6 tracking-tighter">Le Sanctuaire</h2>
            <p className="text-slate-400 max-w-lg mx-auto mb-12 leading-relaxed italic text-sm">
              "La connaissance est vaine sans l'incarnation. Ici, ton esprit prend forme. 
              Pendant les 31 prochains jours, ton avatar grandira à chaque défi relevé."
            </p>
            <button 
              onClick={() => setStep(2)}
              className="px-12 py-5 bg-emerald-500 text-black font-black uppercase text-[11px] rounded-full hover:scale-105 transition-all shadow-xl shadow-emerald-500/20"
            >
              Initialiser mon double numérique
            </button>
          </div>
        ) : (
          <div className="bg-black/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3rem] border border-white/10 animate-in slide-in-from-bottom-10 duration-700">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              
              {/* VISUEL AVATAR */}
              <div className="relative flex flex-col items-center">
                <div className="w-64 h-64 bg-gradient-to-b from-white/5 to-transparent rounded-full flex items-center justify-center border border-white/10 shadow-2xl relative">
                   <svg viewBox="0 0 100 100" className="w-40 h-40 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <path d="M20,95 Q50,40 80,95" fill={avatar.outfit} />
                    <circle cx="50" cy="45" r="22" fill={avatar.skin} />
                    <circle cx="43" cy="43" r="2" fill="#000" />
                    <circle cx="57" cy="43" r="2" fill="#000" />
                    <path d="M45,55 Q50,58 55,55" stroke="#000" strokeWidth="1" fill="none" />
                  </svg>
                  <div className="absolute -bottom-4 bg-emerald-500 text-black px-6 py-1 rounded-full text-[10px] font-black uppercase">Niveau {avatar.level}</div>
                </div>
              </div>

              {/* CONFIGURATION */}
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-white/30 mb-3 block tracking-widest">Nom du personnage</label>
                  <input 
                    type="text" 
                    value={avatar.name}
                    onChange={(e) => setAvatar({...avatar, name: e.target.value})}
                    placeholder="Ex: Neo, Athena..."
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-white/30 mb-3 block tracking-widest">Essence (Peau)</label>
                  <div className="flex gap-3">
                    {skinTones.map(t => (
                      <button key={t} onClick={() => setAvatar({...avatar, skin: t})} style={{backgroundColor: t}} className={`w-8 h-8 rounded-full border-2 ${avatar.skin === t ? 'border-white shadow-lg' : 'border-transparent opacity-50'}`} />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-white/30 mb-3 block tracking-widest">Armure (Vêtement)</label>
                  <div className="flex gap-3">
                    {outfitColors.map(c => (
                      <button key={c} onClick={() => setAvatar({...avatar, outfit: c})} style={{backgroundColor: c}} className={`w-8 h-8 rounded-lg border-2 ${avatar.outfit === c ? 'border-white' : 'border-transparent opacity-50'}`} />
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleSave}
                  className="w-full py-5 bg-white text-black font-black uppercase text-[10px] rounded-2xl hover:bg-emerald-500 transition-colors"
                >
                  Sceller mon destin
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
