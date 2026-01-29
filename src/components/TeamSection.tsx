import { useState } from "react";
import { 
  User, ShieldCheck, Landmark, Calendar, Megaphone, 
  Trophy, TrendingUp, FileText, X, ArrowRight, Users 
} from "lucide-react";
import { Button } from "./ui/button";

const team = [
  {
    name: "NIYOMFURA Guy Bertrand",
    role: "Directeur Général",
    icon: <Trophy className="w-6 h-6 md:w-8 md:h-8" />,
    color: "bg-primary"
  },
  {
    name: "KANYANA Perle Deborah",
    role: "Secrétaire",
    icon: <FileText className="w-6 h-6 md:w-8 md:h-8" />,
    color: "bg-emerald-600"
  },
  {
    name: "KOMEZA Adiella Princia",
    role: "Trésorerie",
    icon: <Landmark className="w-6 h-6 md:w-8 md:h-8" />,
    color: "bg-emerald-700"
  },
  {
    name: "ISHIMWE Lysa Fleur",
    role: "Responsable Opérations & Événementiel",
    desc: "Planification et exécution des actions terrain.",
    icon: <Calendar className="w-6 h-6 md:w-8 md:h-8" />,
    color: "bg-secondary"
  },
  {
    name: "IRAKOZE Reine Roxanne",
    role: "Vice Responsable Opérations",
    icon: <Calendar className="w-6 h-6 md:w-8 md:h-8" />,
    color: "bg-secondary"
  },
  {
    name: "NIMUBONA Don Fleury",
    role: "Responsable Communication",
    desc: "Gestion de l'image et partenariats stratégiques.",
    icon: <Megaphone className="w-6 h-6 md:w-8 md:h-8" />,
    color: "bg-emerald-800"
  },
  {
    name: "ITERITEKA Anniella",
    role: "Responsable Marketing",
    desc: "Promotion des programmes d'éducation.",
    icon: <TrendingUp className="w-6 h-6 md:w-8 md:h-8" />,
    color: "bg-emerald-900"
  }
];

const otherFounders = [
  { name: "GAHUNGU Bertin", role: "Membre Fondateur" },
  { name: "NDAGARA Kercie Ketina", role: "Membre Fondateur" },
  { name: "IGIRANEZA Garenne", role: "Membre Fondateur" },
  { name: "IGIRANEZA Billy Don de Dieu", role: "Membre Fondateur" },
];

const TeamSection = () => {
  const [showFounders, setShowFounders] = useState(false);

  return (
    <section id="equipe" className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        
        {/* Header - Plus compact sur mobile */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <span className="bg-secondary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Organigramme</span>
          <h2 className="text-3xl md:text-6xl font-black text-primary mt-4 uppercase tracking-tighter leading-tight">Direction de la <span className="text-secondary italic">Fondation</span></h2>
          <p className="text-slate-400 text-[10px] mt-4 md:hidden font-black uppercase tracking-[0.2em] animate-pulse">
            ← Glissez pour voir l'équipe →
          </p>
        </div>

        {/* LISTE DÉFILANTE AJUSTÉE : min-w-[68vw] pour voir les autres membres */}
        <div className="flex overflow-x-auto pb-10 gap-4 snap-x snap-mandatory hide-scrollbar md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-visible">
          {team.map((member, index) => (
            <div 
              key={index} 
              className="min-w-[68vw] sm:min-w-[40vw] md:min-w-0 snap-center group bg-slate-50 rounded-[2rem] p-6 md:p-8 border border-slate-100 hover:bg-primary transition-all duration-500 shadow-sm"
            >
              <div className="relative mb-5">
                <div className={`w-14 h-14 md:w-20 md:h-20 ${member.color} rounded-xl md:rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                  {member.icon}
                </div>
                <div className="absolute top-0 right-0 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full border-4 border-slate-50 flex items-center justify-center text-slate-300">
                  <User className="w-5 h-5 md:w-6 md:h-6" />
                </div>
              </div>
              
              <h3 className="text-lg md:text-xl font-black text-primary group-hover:text-white transition-colors mb-1 uppercase tracking-tighter leading-tight">
                {member.name}
              </h3>
              <p className="text-secondary font-bold text-[9px] md:text-[10px] uppercase mb-4 tracking-widest group-hover:text-white/90">
                {member.role}
              </p>
              
              {member.desc && (
                <p className="text-[11px] md:text-xs text-slate-500 group-hover:text-white/80 leading-relaxed italic border-l-2 border-slate-200 group-hover:border-white/30 pl-3">
                  {member.desc}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Bouton Fondateurs */}
        <div className="flex justify-center mt-4">
          <Button 
            onClick={() => setShowFounders(true)}
            variant="outline" 
            className="group border-primary text-primary hover:bg-primary hover:text-white rounded-xl md:rounded-2xl px-6 h-14 md:h-16 text-xs font-black uppercase tracking-widest transition-all shadow-lg w-full md:w-auto"
          >
            Tous les fondateurs
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Button>
        </div>

        {/* Modal Fondateurs */}
        {showFounders && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-primary/95 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden relative border-b-[8px] border-secondary">
              <div className="p-5 border-b flex justify-between items-center bg-slate-50">
                <h3 className="font-black text-primary uppercase text-sm tracking-tighter">Membres Fondateurs</h3>
                <button onClick={() => setShowFounders(false)} className="p-2 bg-white rounded-full text-primary shadow-sm hover:scale-110 transition-transform">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
                {otherFounders.map((founder, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500 font-black text-xs">
                      {founder.name[0]}
                    </div>
                    <div>
                      <h4 className="font-black text-xs text-primary uppercase">{founder.name}</h4>
                      <p className="text-[9px] text-secondary font-bold uppercase tracking-widest">{founder.role}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-3 bg-primary text-white text-center text-[9px] font-bold tracking-widest uppercase">
                The Future Generation BDI
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default TeamSection;
