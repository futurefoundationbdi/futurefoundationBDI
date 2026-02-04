import React, { useState, useEffect, useCallback } from 'react';

// --- INTERFACES ---
interface AvatarConfig {
  name: string;
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  outfit: string;
  aura: string; // Pour les effets d'aura
  level: number;
  xp: number;
  health: number; // Pour le côté "fané" ou "vibrant"
  createdAt: string;
}

interface AvatarSystemProps {
  onBack: () => void;
}

// --- DONNÉES DE PERSONNALISATION (Modernisées) ---
const SKIN_TONES = [
  { name: "Céleste", color: "#E0AC69" },
  { name: "Aube", color: "#FFDBAC" },
  { name: "Sable", color: "#F1C27D" },
  { name: "Ombre", color: "#8D5524" },
  { name: "Ébène", color: "#6A4524" },
];

const HAIR_STYLES = [
  { id: 'none', name: 'Aucun' },
  { id: 'short-spiky', name: 'Court Spiky' },
  { id: 'long-wavy', name: 'Long Ondulé' },
  { id: 'buzz-cut', name: 'Rasé' },
  { id: 'braids', name: 'Tresses' },
];

const HAIR_COLORS = [
  { name: "Noir Jais", color: "#2c2c2c" },
  { name: "Brun Profond", color: "#5a452a" },
  { name: "Blond Platine", color: "#f0e68c" },
  { name: "Argent", color: "#c0c0c0" },
  { name: "Émeraude", color: "#10b981" },
];

const OUTFITS = [
  { name: "Tunique Initié", color: "#1e40af" }, // Bleu marine
  { name: "Veste Synthétique", color: "#ef4444" }, // Rouge
  { name: "Combinaison Tech", color: "#a855f7" }, // Violet
  { name: "Manteau Sage", color: "#059669" }, // Vert foncé
];

// --- COMPOSANT AVATAR (SVG MODULAIRE) ---
const AvatarDisplay: React.FC<{ config: AvatarConfig }> = ({ config }) => {
  const levelScale = 0.8 + (config.level / 10) * 0.2;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg 
        viewBox="0 0 200 350" 
        className="w-full h-full drop-shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-700"
        style={{ transform: `scale(${levelScale})` }}
      >
        {/* OMBRE AU SOL */}
        <ellipse cx="100" cy="330" rx="40" ry="10" fill="black" opacity="0.2" />

        {/* CORPS TECH-FUTURISTE (Détails d'armure) */}
        <g id="body">
          {/* Tronc principal */}
          <path d="M70 110 L130 110 L140 180 L125 240 L75 240 L60 180 Z" fill={config.outfit} />
          {/* Détails d'armure (Lignes de lumière) */}
          <path d="M85 110 L100 160 L115 110" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          <path d="M70 180 L130 180" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="4" />
          
          {/* Épaules */}
          <circle cx="65" cy="120" r="15" fill={config.outfit} />
          <circle cx="135" cy="120" r="15" fill={config.outfit} />
          
          {/* Jambes avec muscles dessinés */}
          <path d="M75 240 L65 320 L90 320 L95 240 Z" fill={config.outfit} brightness="0.8" />
          <path d="M125 240 L135 320 L110 320 L105 240 Z" fill={config.outfit} brightness="0.8" />
        </g>

        {/* COU */}
        <rect x="90" y="90" width="20" height="25" fill={config.skinColor} filter="brightness(0.9)" />

        {/* TÊTE ET VISAGE */}
        <g id="head">
          <path d="M65 60 C65 20 135 20 135 60 C135 100 100 115 100 115 C100 115 65 100 65 60 Z" fill={config.skinColor} />
          
          {/* Yeux stylisés */}
          <g opacity="0.8">
            <ellipse cx="85" cy="65" rx="6" ry="3" fill="white" />
            <circle cx="85" cy="65" r="2" fill="#333" />
            <ellipse cx="115" cy="65" rx="6" ry="3" fill="white" />
            <circle cx="115" cy="65" r="2" fill="#333" />
          </g>

          {/* Cheveux (Mise à jour des tracés pour éviter le bug visuel) */}
          <path 
            d={config.hairStyle === 'short-spiky' 
              ? "M60 60 Q60 10 100 10 Q140 10 140 60 L130 50 Q100 30 70 50 Z" 
              : config.hairStyle === 'long-wavy'
              ? "M60 60 C40 40 40 120 60 130 M140 60 C160 40 160 120 140 130 M60 60 C60 10 140 10 140 60 Z"
              : "M65 50 C65 25 135 25 135 50 Z"} 
            fill={config.hairColor} 
          />
        </g>

        {/* EFFET D'EVOLUTION (Aura dorée si niveau > 5) */}
        {config.level > 5 && (
          <g opacity="0.3">
            <circle cx="100" cy="150" r="100" fill="url(#auraGradient)" />
            <defs>
              <radialGradient id="auraGradient">
                <stop offset="60%" stopColor="transparent" />
                <stop offset="100%" stopColor="#10b981" />
              </radialGradient>
            </defs>
          </g>
        )}
      </svg>
    </div>
  );
};

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg 
        viewBox="0 0 100 200" 
        className="w-full h-full transition-all duration-700 ease-out"
        style={{ transform: `scale(${levelScale}) translateY(${bodyYOffset}px)`, opacity: healthOpacity }}
      >
        {/* Ombres et Effets de Lumière (base) */}
        <defs>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.3)"/>
          </filter>
        </defs>

        {/* Corps (Tronc et Jambes) */}
        <rect x="25" y="80" width="50" height="90" rx="10" fill={config.outfit} style={{ filter: 'url(#shadow)' }} />
        <rect x="30" y="170" width="15" height="30" fill={config.outfit} />
        <rect x="55" y="170" width="15" height="30" fill={config.outfit} />

        {/* Tête */}
        <circle cx="50" cy="50" r="30" fill={config.skinColor} style={{ filter: 'url(#shadow)' }} />

        {/* Cheveux */}
        <g transform="translate(0, 0)"> {/* Ajustement de la position des cheveux */}
          <path d={getHairPath(config.hairStyle)} fill={config.hairColor} />
        </g>
       
        {/* Yeux */}
        <circle cx="40" cy="45" r="3" fill="#333" />
        <circle cx="60" cy="45" r="3" fill="#333" />

        {/* Bouche (expression simple) */}
        <path d="M45 60 Q50 65 55 60" stroke="#333" strokeWidth="1" fill="none" />
      </svg>
      {/* Aura (conditionnelle) */}
      {config.aura && (
        <div 
          className="absolute inset-0 rounded-full blur-2xl opacity-40 animate-pulse z-0" 
          style={{ backgroundColor: config.aura }}
        />
      )}
    </div>
  );
};


// --- COMPOSANT PRINCIPAL AVATARSYSTEM ---
export default function AvatarSystem({ onBack }: AvatarSystemProps) {
  const [step, setStep] = useState(1); // 1: Welcome, 2: Creation, 3: Dashboard/Completion
  const [currentConfig, setCurrentConfig] = useState<AvatarConfig>({
    name: "",
    skinColor: SKIN_TONES[0].color,
    hairStyle: HAIR_STYLES[1].id,
    hairColor: HAIR_COLORS[0].color,
    outfit: OUTFITS[0].color,
    aura: "",
    level: 1,
    xp: 0,
    health: 100,
    createdAt: new Date().toISOString(),
  });
  
  const [savedAvatar, setSavedAvatar] = useState<AvatarConfig | null>(null);

  // Charger l'avatar depuis localStorage au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('future_library_avatar');
    if (saved) {
      setSavedAvatar(JSON.parse(saved));
      setStep(3); // Si l'avatar existe, on va directement au dashboard
    }
  }, []);

  // Gérer le changement des champs
  const handleChange = useCallback((key: keyof AvatarConfig, value: any) => {
    setCurrentConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = () => {
    if (!currentConfig.name.trim()) {
      alert("Veuillez donner un nom à votre avatar.");
      return;
    }
    const finalAvatar = { ...currentConfig, createdAt: new Date().toISOString() };
    localStorage.setItem('future_library_avatar', JSON.stringify(finalAvatar));
    setSavedAvatar(finalAvatar);
    setStep(3); // Aller au tableau de bord / confirmation
  };

  const handleResetAvatar = () => {
    if (window.confirm("Voulez-vous vraiment réinitialiser votre avatar et perdre toute progression ?")) {
      localStorage.removeItem('future_library_avatar');
      setSavedAvatar(null);
      setCurrentConfig({ // Réinitialiser à la configuration par défaut
        name: "",
        skinColor: SKIN_TONES[0].color,
        hairStyle: HAIR_STYLES[1].id,
        hairColor: HAIR_COLORS[0].color,
        outfit: OUTFITS[0].color,
        aura: "",
        level: 1,
        xp: 0,
        health: 100,
        createdAt: new Date().toISOString(),
      });
      setStep(2); // Retour à la création
    }
  };


  return (
    <div className="min-h-screen aurora-bg text-white p-6 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Bouton Quitter */}
      <button onClick={onBack} className="absolute top-8 left-8 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-emerald-400 transition-colors z-50">
        ← Quitter le Sanctuaire
      </button>

      {/* Bouton Réinitialiser (visible si avatar existe et n'est pas en création) */}
      {savedAvatar && step === 3 && (
        <button onClick={handleResetAvatar} className="absolute top-8 right-8 text-[10px] font-black uppercase tracking-widest text-red-400/40 hover:text-red-300 transition-colors z-50">
          Réinitialiser
        </button>
      )}


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
              
              {/* VISUEL AVATAR DYNAMIQUE */}
              <div className="relative group min-h-[300px] flex items-center justify-center">
                <div className="w-full h-full max-h-[400px] aspect-auto bg-gradient-to-b from-white/10 to-transparent rounded-[2rem] flex items-center justify-center border border-white/10 p-8 relative overflow-hidden">
                  <AvatarDisplay config={currentConfig} />
                </div>
                {/* Ici, on pourrait ajouter un bouton "Randomize" si on voulait une génération aléatoire */}
              </div>

              {/* CONTROLES DE PERSONNALISATION */}
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-black uppercase text-emerald-500 mb-3 block tracking-widest">Nom de l'initié</label>
                  <input 
                    type="text" 
                    value={currentConfig.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Ton nom ou pseudo..."
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-emerald-500 transition-colors text-white font-bold"
                  />
                </div>

                {/* Couleur de peau */}
                <div>
                  <label className="text-[10px] font-black uppercase text-white/30 mb-3 block tracking-widest">Teint de peau</label>
                  <div className="flex flex-wrap gap-2">
                    {SKIN_TONES.map(tone => (
                      <button 
                        key={tone.color} 
                        onClick={() => handleChange('skinColor', tone.color)} 
                        className={`w-8 h-8 rounded-full border-2 ${currentConfig.skinColor === tone.color ? 'border-white ring-2 ring-emerald-400' : 'border-transparent opacity-70 hover:opacity-100'}`} 
                        style={{ backgroundColor: tone.color }}
                        title={tone.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Style de Cheveux */}
                <div>
                  <label className="text-[10px] font-black uppercase text-white/30 mb-3 block tracking-widest">Coiffure</label>
                  <div className="flex flex-wrap gap-2">
                    {HAIR_STYLES.map(style => (
                      <button 
                        key={style.id} 
                        onClick={() => handleChange('hairStyle', style.id)} 
                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${currentConfig.hairStyle === style.id ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white opacity-70 hover:opacity-100'}`}
                      >
                        {style.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Couleur de Cheveux */}
                <div>
                  <label className="text-[10px] font-black uppercase text-white/30 mb-3 block tracking-widest">Couleur de cheveux</label>
                  <div className="flex flex-wrap gap-2">
                    {HAIR_COLORS.map(color => (
                      <button 
                        key={color.color} 
                        onClick={() => handleChange('hairColor', color.color)} 
                        className={`w-6 h-6 rounded-full border-2 ${currentConfig.hairColor === color.color ? 'border-white ring-1 ring-emerald-400' : 'border-transparent opacity-70 hover:opacity-100'}`} 
                        style={{ backgroundColor: color.color }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Tenue */}
                <div>
                  <label className="text-[10px] font-black uppercase text-white/30 mb-3 block tracking-widest">Tenue</label>
                  <div className="flex flex-wrap gap-2">
                    {OUTFITS.map(outfit => (
                      <button 
                        key={outfit.color} 
                        onClick={() => handleChange('outfit', outfit.color)} 
                        className={`w-8 h-8 rounded-lg border-2 ${currentConfig.outfit === outfit.color ? 'border-white ring-2 ring-emerald-400' : 'border-transparent opacity-70 hover:opacity-100'}`} 
                        style={{ backgroundColor: outfit.color }}
                        title={outfit.name}
                      />
                    ))}
                  </div>
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

        {step === 3 && savedAvatar && (
          <div className="text-center animate-in fade-in zoom-in-95 duration-700">
             <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-emerald-500/30 to-blue-500/30 rounded-full p-4 border border-emerald-500/40 relative flex items-center justify-center overflow-hidden">
                <AvatarDisplay config={savedAvatar} />
                {/* Effet visuel pour le tableau de bord */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse rounded-full z-0" />
             </div>
             <h2 className="text-4xl font-black uppercase italic mb-4">Bienvenue, <span className="text-emerald-400">{savedAvatar.name}</span></h2>
             <p className="text-emerald-500 font-bold text-xs uppercase tracking-widest mb-10">Niveau {savedAvatar.level} — Initié</p>
             <button 
              onClick={onBack} // Retourne à l'accueil pour l'instant, plus tard vers un dashboard d'avatar
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
