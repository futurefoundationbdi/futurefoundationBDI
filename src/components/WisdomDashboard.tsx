import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Lock, CheckCircle, Zap, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Définition des badges (synchronisée avec le reste du site)
const BADGES = [
  { id: 1, name: "Novice", xp: 0, desc: "Bienvenue à bord", icon: "🌱" },
  { id: 2, name: "Épargnant", xp: 100, desc: "Premier pas vers l'épargne", icon: "💰" },
  { id: 3, name: "Stratège", xp: 300, desc: "Expert de la BRB", icon: "🏛️" },
  { id: 4, name: "Maître", xp: 600, desc: "Liberté Financière", icon: "👑" },
];

interface WisdomDashboardProps {
  onOpenQuiz: () => void; // Fonction passée par App.tsx
}

const WisdomDashboard = ({ onOpenQuiz }: WisdomDashboardProps) => {
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const updateXP = () => {
      const savedXP = localStorage.getItem("future_foundation_xp");
      if (savedXP) setXp(parseInt(savedXP));
    };

    updateXP();
    // Écoute les changements si le quiz est terminé
    window.addEventListener("storage", updateXP);
    return () => window.removeEventListener("storage", updateXP);
  }, []);

  const currentBadge = [...BADGES].reverse().find(b => xp >= b.xp) || BADGES[0];
  const nextBadge = BADGES.find(b => xp < b.xp);

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-slate-50 rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-sm">
          
          {/* Header Dashboard */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="text-center md:text-left">
              <span className="text-secondary font-black text-xs uppercase tracking-widest bg-secondary/10 px-4 py-1 rounded-full">
                Dashboard de Sagesse
              </span>
              <h2 className="text-3xl font-black text-primary mt-2 uppercase italic">
                Niveau : {currentBadge.name}
              </h2>
            </div>
            <div className="bg-primary text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl">
              <Zap className="text-secondary fill-secondary w-6 h-6" />
              <span className="text-2xl font-black">{xp} <small className="text-[10px] opacity-50">XP</small></span>
            </div>
          </div>

          {/* --- NOUVEAU : BOUTON D'ACTION DIRECTE --- */}
          <div className="bg-white p-4 rounded-3xl border-2 border-primary/5 mb-10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                <PlayCircle className="text-secondary w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-black text-primary uppercase leading-none">Prêt pour le défi ?</p>
                <p className="text-[10px] text-slate-400 font-bold">Gagnez 10 XP par bonne réponse</p>
              </div>
            </div>
            <Button 
              onClick={onOpenQuiz}
              className="w-full md:w-auto bg-secondary text-primary font-black px-8 h-12 rounded-2xl shadow-lg hover:scale-105 transition-transform uppercase italic text-xs"
            >
              Jouer maintenant
            </Button>
          </div>

          {/* Grille de Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {BADGES.map((badge) => {
              const isLocked = xp < badge.xp;
              const isCurrent = currentBadge.id === badge.id;
              
              return (
                <div 
                  key={badge.id} 
                  className={`relative p-4 rounded-3xl border-2 transition-all duration-500 ${
                    isLocked 
                      ? 'bg-slate-100/50 border-slate-100 grayscale' 
                      : isCurrent 
                        ? 'bg-white border-secondary shadow-xl scale-105 z-10' 
                        : 'bg-white border-slate-100 opacity-80'
                  }`}
                >
                  <div className="text-4xl mb-2 text-center">{badge.icon}</div>
                  <h5 className={`text-[10px] font-black text-center uppercase ${isLocked ? 'text-slate-400' : 'text-primary'}`}>
                    {badge.name}
                  </h5>
                  {isLocked ? (
                    <Lock className="absolute top-3 right-3 w-3 h-3 text-slate-300" />
                  ) : (
                    <CheckCircle className="absolute top-3 right-3 w-3 h-3 text-secondary" />
                  )}
                  {isCurrent && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-secondary text-[8px] font-black px-2 py-0.5 rounded-full uppercase text-primary">
                      Actuel
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Barre de Progression */}
          {nextBadge && (
            <div className="space-y-3 bg-white p-6 rounded-3xl border border-slate-100">
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                <span>Objectif : {nextBadge.name}</span>
                <span>Encore {nextBadge.xp - xp} XP</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((xp / nextBadge.xp) * 100, 100)}%` }}
                  className="h-full bg-secondary shadow-[0_0_15px_rgba(241,196,15,0.3)]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WisdomDashboard;
