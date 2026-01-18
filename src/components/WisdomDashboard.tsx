import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Lock, CheckCircle, Zap } from "lucide-react";

// Définition des badges
const BADGES = [
  { id: 1, name: "Novice", xp: 0, desc: "Bienvenue à bord", icon: "🌱" },
  { id: 2, name: "Épargnant", xp: 100, desc: "Premier pas vers l'épargne", icon: "💰" },
  { id: 3, name: "Stratège", xp: 300, desc: "Expert de la BRB", icon: "🏛️" },
  { id: 4, name: "Maître", xp: 600, desc: "Liberté Financière", icon: "👑" },
];

const WisdomDashboard = () => {
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const savedXP = localStorage.getItem("future_foundation_xp");
    if (savedXP) setXp(parseInt(savedXP));
  }, []);

  const currentBadge = [...BADGES].reverse().find(b => xp >= b.xp) || BADGES[0];
  const nextBadge = BADGES.find(b => xp < b.xp);

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-slate-50 rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-sm">
          
          {/* Header Dashboard */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
            <div className="text-center md:text-left">
              <span className="text-secondary font-black text-xs uppercase tracking-widest bg-secondary/10 px-4 py-1 rounded-full">Dashboard de Sagesse</span>
              <h2 className="text-3xl font-black text-primary mt-2 uppercase italic">Niveau : {currentBadge.name}</h2>
            </div>
            <div className="bg-primary text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl">
              <Zap className="text-secondary fill-secondary w-6 h-6" />
              <span className="text-2xl font-black">{xp} <small className="text-[10px] opacity-50">XP</small></span>
            </div>
          </div>

          {/* Grille de Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {BADGES.map((badge) => {
              const isLocked = xp < badge.xp;
              return (
                <div key={badge.id} className={`relative p-4 rounded-3xl border-2 transition-all ${isLocked ? 'bg-slate-100/50 border-slate-100 grayscale' : 'bg-white border-secondary shadow-md'}`}>
                  <div className="text-4xl mb-2 text-center">{badge.icon}</div>
                  <h5 className={`text-[10px] font-black text-center uppercase ${isLocked ? 'text-slate-400' : 'text-primary'}`}>{badge.name}</h5>
                  {isLocked && <Lock className="absolute top-2 right-2 w-3 h-3 text-slate-300" />}
                  {!isLocked && <CheckCircle className="absolute top-2 right-2 w-3 h-3 text-secondary" />}
                </div>
              );
            })}
          </div>

          {/* Barre de Progression Responsive */}
          {nextBadge && (
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                <span>Progression vers {nextBadge.name}</span>
                <span>{Math.round((xp / nextBadge.xp) * 100)}%</span>
              </div>
              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(xp / nextBadge.xp) * 100}%` }}
                  className="h-full bg-secondary shadow-[0_0_15px_rgba(241,196,15,0.5)]"
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
