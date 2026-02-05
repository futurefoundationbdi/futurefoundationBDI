import React, { useState, useEffect } from 'react';
import SoloMode from './SoloMode'; // On créera ce fichier juste après
import SquadMode from './SquadMode'; // On le créera pour l'étape suivante

export default function AvatarSystem({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<'hall' | 'solo' | 'squad'>('hall');
  const [avatarData, setAvatarData] = useState<any>(null);

  // Charger les données de l'avatar au démarrage pour savoir s'il existe
  useEffect(() => {
    const saved = localStorage.getItem('future_library_avatar');
    if (saved) setAvatarData(JSON.parse(saved));
  }, []);

  return (
    /* Force le fond noir et le texte blanc même si le téléphone force un mode clair/sombre */
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 overflow-x-hidden" style={{ colorScheme: 'dark' }}>
      
      {/* Configuration CSS pour bloquer les interférences mobiles */}
      <style>{`
        :root { color-scheme: dark !important; }
        body { background-color: #050505 !important; margin: 0; padding: 0; }
        .no-select { -webkit-tap-highlight-color: transparent; }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 py-8 md:p-12 min-h-screen flex flex-col">
        
        {view === 'hall' && (
          <div className="flex-1 flex flex-col justify-center items-center animate-in fade-in zoom-in-95 duration-700">
            {/* Header du Hub */}
            <div className="text-center mb-12 md:mb-20 space-y-4">
              <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                Système <span className="text-cyan-500">Avatar</span>
              </h2>
              <p className="text-white/30 text-[9px] md:text-xs font-bold tracking-[0.4em] uppercase">
                Protocole de Discipline de Fer
              </p>
            </div>

            {/* Grille de sélection des modes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
              
              {/* CARTE MODE SOLO */}
              <div 
                onClick={() => setView('solo')}
                className="no-select group relative bg-white/[0.03] border border-white/10 p-8 md:p-12 rounded-[32px] md:rounded-[48px] cursor-pointer hover:border-cyan-500/50 hover:bg-cyan-500/[0.02] transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 transition-opacity">
                  <div className="text-xs font-black uppercase tracking-widest text-cyan-500 italic">Phase 1</div>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400 font-bold mb-6">
                    01
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black uppercase italic group-hover:text-cyan-400 transition-colors">Le Monarque</h3>
                  <p className="text-white/40 text-xs md:text-sm leading-relaxed max-w-[240px]">
                    Éveil solitaire. Forge ton ADN à travers 31 niveaux de pure discipline.
                  </p>
                  <div className="pt-4 flex items-center gap-2 text-cyan-500 text-[10px] font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                    Initialiser le protocole <span>→</span>
                  </div>
                </div>
              </div>

              {/* CARTE MODE ESCOUADE */}
              <div 
                onClick={() => setView('squad')}
                className="no-select group relative bg-white/[0.03] border border-white/10 p-8 md:p-12 rounded-[32px] md:rounded-[48px] cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/[0.02] transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-20">
                  <div className="text-[10px] bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full font-black uppercase">Multiplayer</div>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400 font-bold mb-6">
                    02
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black uppercase italic group-hover:text-purple-400 transition-colors">L'Escouade</h3>
                  <p className="text-white/40 text-xs md:text-sm leading-relaxed max-w-[240px]">
                    Unité de chasse. Partage ta santé et tes quêtes avec tes alliés réels.
                  </p>
                  <div className="pt-4 flex items-center gap-2 text-purple-500 text-[10px] font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                    Rejoindre l'unité <span>→</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer actions */}
            <div className="mt-16 flex flex-col items-center gap-6">
              <button 
                onClick={onBack}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors"
              >
                Quitter le Hall
              </button>
            </div>
          </div>
        )}

        {/* AFFICHAGE DES COMPOSANTS EN FONCTION DE LA VUE */}
        {view === 'solo' && (
          <SoloMode onBack={() => setView('hall')} />
        )}

        {view === 'squad' && (
          <SquadMode onBack={() => setView('hall')} />
        )}

      </div>
    </div>
  );
}
