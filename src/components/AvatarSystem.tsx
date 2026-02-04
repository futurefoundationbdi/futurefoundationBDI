import React, { useState } from 'react';

// Configuration des options pro
const SKIN_COLORS = ["#FFDBAC", "#F1C27D", "#E0AC69", "#8D5524", "#C68642"];
const HAIR_STYLES = ["long", "short", "shaved", "fade", "braids"];
const EVOLUTION_STAGES = ["Initiate", "Scholar", "Guardian", "Master"];

export default function AvatarCreator() {
  const [config, setConfig] = useState({
    skin: SKIN_COLORS[0],
    hair: HAIR_STYLES[1],
    height: 100, // Pour faire grandir le corps
    energy: 100, // Pour le côté "fané" ou "vibrant"
  });

  // Fonction pour générer le corps en fonction de l'évolution
  const renderAvatarBody = () => {
    // Ici, on dessine le corps en SVG. 
    // Plus la 'height' est haute, plus les jambes s'allongent.
    // Plus l' 'energy' est basse, plus les épaules s'affaissent (transform: rotate).
    return (
      <svg viewBox="0 0 200 500" className="w-64 h-auto transition-all duration-1000">
        {/* JAMBES (Grandissent selon l'évolution) */}
        <rect x="75" y={350 - (config.height * 0.5)} width="20" height={config.height} fill={config.skin} />
        <rect x="105" y={350 - (config.height * 0.5)} width="20" height={config.height} fill={config.skin} />
        
        {/* TRONC (Change de couleur selon l'énergie) */}
        <rect x="70" y="200" width="60" height="120" rx="20" fill={config.energy > 50 ? "#10b981" : "#64748b"} />
        
        {/* TÊTE PERSONNALISÉE */}
        <circle cx="100" cy="150" r="40" fill={config.skin} />
        
        {/* CHEVEUX (Conditionnels) */}
        {config.hair === "long" && <path d="M60 150 Q100 50 140 150" stroke="black" strokeWidth="20" fill="none" />}
      </svg>
    );
  };

  return (
    <div className="grid md:grid-cols-2 gap-10 bg-black/40 p-10 rounded-3xl border border-white/5">
      {/* AFFICHAGE DE L'AVATAR (Corps Entier) */}
      <div className="flex flex-col items-center justify-center bg-white/5 rounded-2xl p-8 border border-white/10">
        <div className="relative">
            {renderAvatarBody()}
            {/* Effet d'aura si énergie haute */}
            {config.energy > 80 && (
                <div className="absolute inset-0 bg-emerald-500/20 blur-[50px] -z-10 animate-pulse rounded-full" />
            )}
        </div>
        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">
            Statut : {config.height > 150 ? "Maître Éclairé" : "Apprenti"}
        </p>
      </div>

      {/* PANNEAU DE PERSONNALISATION */}
      <div className="space-y-8">
        <h3 className="text-2xl font-black uppercase italic">Configure ton ADN</h3>
        
        {/* Couleur de Peau */}
        <div>
          <label className="text-[10px] font-black uppercase mb-4 block opacity-50">Teint de peau</label>
          <div className="flex gap-3">
            {SKIN_COLORS.map(color => (
              <button 
                key={color} 
                onClick={() => setConfig({...config, skin: color})}
                className={`w-8 h-8 rounded-full border-2 ${config.skin === color ? 'border-white' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Style de Cheveux */}
        <div>
          <label className="text-[10px] font-black uppercase mb-4 block opacity-50">Coupe de cheveux</label>
          <div className="flex flex-wrap gap-2">
            {HAIR_STYLES.map(style => (
              <button 
                key={style}
                onClick={() => setConfig({...config, hair: style})}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${config.hair === style ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white'}`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Preview de l'évolution (Simulation) */}
        <div className="pt-6 border-t border-white/10">
            <label className="text-[10px] font-black uppercase mb-4 block text-amber-500">Test d'Évolution (Simuler 31 jours)</label>
            <input 
                type="range" 
                min="100" max="250" 
                onChange={(e) => setConfig({...config, height: Number(e.target.value)})}
                className="w-full accent-emerald-500"
            />
        </div>

        <button className="w-full py-5 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 transition-all">
          Enregistrer dans la matrice
        </button>
      </div>
    </div>
  );
}
