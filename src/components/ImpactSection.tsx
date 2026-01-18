import { useState, useEffect, useRef } from "react";
import { GraduationCap, Users, MapPin, BookOpen, ArrowRight } from "lucide-react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

// Composant pour l'animation des chiffres
const Counter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { stiffness: 40, damping: 20 });
  const display = useTransform(spring, (current) => Math.floor(current).toLocaleString() + suffix);

  useEffect(() => {
    if (isInView) spring.set(value);
  }, [isInView, spring, value]);

  return <motion.span ref={ref}>{display}</motion.span>;
};

const ImpactSection = () => {
  const stats = [
    {
      icon: GraduationCap,
      number: 200,
      suffix: "+",
      label: "Jeunes sensibilisés",
      description: "À travers nos sessions et réseaux sociaux",
    },
    {
      icon: Users,
      number: 20,
      suffix: "",
      label: "Bénévoles actifs",
      description: "Une équipe dévouée à Bujumbura",
    },
    {
      icon: MapPin,
      number: 1,
      suffix: "",
      label: "Province",
      description: "Focus actuel : Bujumbura Mairie",
    },
    {
      icon: BookOpen,
      number: 0,
      suffix: "...",
      label: "L'Argent Révélé",
      description: "Sortie prévue : Octobre 2026",
      isSpecial: true
    },
  ];

  return (
    <section id="impact" className="py-16 md:py-32 bg-[#1a4d4a] text-white overflow-hidden">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-2 bg-secondary/20 rounded-full text-secondary font-black text-[10px] md:text-xs mb-4 uppercase tracking-[0.2em]"
          >
            Notre Impact Actuel
          </motion.span>
          <h2 className="text-3xl md:text-6xl font-black mb-6 leading-tight italic">
            Petit à petit, nous <span className="text-secondary">initions le changement.</span>
          </h2>
          <p className="text-sm md:text-lg text-white/70 leading-relaxed">
            Basés à Bujumbura, nous préparons la nouvelle génération à une gestion 
            financière saine et visionnaire.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-[2rem] border transition-all duration-500 ${
                stat.isSpecial 
                ? "bg-secondary text-primary border-secondary shadow-[0_20px_50px_rgba(241,196,15,0.3)]" 
                : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                stat.isSpecial ? "bg-primary/10" : "bg-secondary/20"
              }`}>
                <stat.icon className={`w-6 h-6 ${stat.isSpecial ? "text-primary" : "text-secondary"}`} />
              </div>
              
              <p className="text-4xl md:text-5xl font-black mb-2">
                <Counter value={stat.number} suffix={stat.suffix} />
              </p>
              <p className="text-sm md:text-base font-black mb-3 uppercase tracking-wider">{stat.label}</p>
              <p className={`text-xs leading-relaxed ${stat.isSpecial ? "text-primary/70" : "text-white/50"}`}>
                {stat.description}
              </p>
              
              {stat.isSpecial && (
                <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase italic">
                  Tenez-vous prêt <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Objectifs / Vision */}
        <div className="mt-20 md:mt-40 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl md:text-4xl font-black italic">Pourquoi nous nous concentrons sur les <span className="text-secondary">Jeunes ?</span></h3>
            <div className="space-y-4">
              {[
                { t: "L'Indépendance", d: "Réduire la dépendance financière dès la sortie des études." },
                { t: "L'Épargne Locale", d: "Soutenir l'économie nationale par une meilleure gestion individuelle." },
                { t: "Le Leadership", d: "Former des visionnaires capables de bâtir des projets solides." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-secondary text-primary flex items-center justify-center text-[10px] font-black shrink-0 mt-1">
                    {i+1}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm md:text-base">{item.t}</h4>
                    <p className="text-white/60 text-xs md:text-sm">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-secondary blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-white/5 border border-white/10 p-8 rounded-[3rem] backdrop-blur-xl">
              <h4 className="text-secondary font-black text-xl mb-4 italic">Notre Vision 2026</h4>
              <p className="text-white/80 text-sm md:text-lg leading-relaxed italic">
                "D'ici fin 2026, nous visons à distribuer 2000 exemplaires de "L'Argent Révélé" dans 28 écoles du Burundi, créant ainsi la première génération de 'Génies Financiers' du pays."
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-secondary overflow-hidden">
                  <img src="/futurelogo.jpg" alt="Futurelogo" className="w-full h-auto scale-150 mt-2" />
                </div>
                <div>
                  <p className="font-bold text-sm">Le Guide Future Foundation</p>
                  <p className="text-[10px] text-secondary font-black uppercase">Mission Burundi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
