import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  BookOpen, 
  TrendingUp, 
  Sun, 
  Calendar, 
  Lock,
  Rocket,
  ChevronRight
} from "lucide-react";
import ProgramModal from "./ProgramModal";

import educationImage from "@/assets/education-program.jpg";
import financialImage from "@/assets/financial-literacy.jpg";
import communityImage from "@/assets/community-program.jpg";

const ProgramsSection = () => {
  const [isVacationModalOpen, setIsVacationModalOpen] = useState(false);

  const programs = [
    {
      id: "finance",
      icon: TrendingUp,
      title: "Éducation Financière",
      subtitle: "Indépendance",
      description: "Ateliers pratiques sur la gestion budgétaire et l'épargne pour préparer les jeunes à l'autonomie.",
      image: financialImage,
      buttonLabel: "Prochaines Sessions",
    },
    {
      id: "life",
      icon: BookOpen,
      title: "Compétences de Vie",
      subtitle: "Leadership",
      description: "Coaching sur la discipline et les soft skills pour naviguer sereinement dans la société actuelle.",
      image: educationImage,
      buttonLabel: "Calendrier",
    },
    {
      id: "vacation",
      icon: Sun,
      title: "Programme Vacances",
      subtitle: "Impact Social",
      description: "Apprentissage accéléré et soutien pour les enfants démunis lors de périodes clés.",
      image: communityImage,
      buttonLabel: "Voir les histoires", // Nom mis à jour !
    },
  ];

  const handleProgramClick = (programId: string) => {
    if (programId === "vacation") {
      setIsVacationModalOpen(true);
    }
  };

  return (
    <section id="programmes" className="py-16 md:py-32 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4">
        
        {/* Header - Centré et lisible sur mobile */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-20">
          <span className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-primary font-black text-[10px] md:text-xs uppercase tracking-[0.2em] mb-4">
            Nos Initiatives
          </span>
          <h2 className="text-3xl md:text-6xl font-black text-foreground mb-4 md:mb-6 leading-[1.1] uppercase tracking-tighter">
            Transformer <span className="text-primary italic">l'Avenir</span>
          </h2>
        </div>

        {/* --- SECTION IMPACT 360 (Version Optimisée Mobile) --- */}
        <div className="mb-10 md:mb-20 bg-primary rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl border-4 border-white transform hover:scale-[1.01] transition-transform duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-16 text-white flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6 text-secondary animate-pulse">
                <Rocket className="w-8 h-8" />
                <span className="font-black uppercase tracking-widest text-lg italic">Elite Impact</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-black mb-6 leading-tight uppercase">L'Accompagnement de <span className="text-secondary italic">Haut Niveau</span></h3>
              <p className="text-white/70 mb-8 text-sm md:text-lg leading-relaxed max-w-md">
                Un coaching personnalisé sur 3 mois pour ceux qui veulent accélérer leur réussite financière.
              </p>
              <Button className="w-full md:w-max h-16 bg-secondary hover:bg-white text-primary font-black px-10 rounded-2xl group transition-all text-lg shadow-xl">
                REJOINDRE LE PROGRAMME <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-6 md:p-12 flex flex-col gap-4 justify-center border-t lg:border-t-0 lg:border-l border-white/10">
              {[
                { n: "Pack Mineur", a: "15-18 ans", p: "15.000 Fbu", active: true },
                { n: "Pack Majeur", a: "18-25 ans", p: "50.000 Fbu", active: true },
                { n: "Pack Adulte", a: "25-30 ans", p: "100.000 Fbu", active: false },
              ].map((pack) => (
                <div key={pack.n} className={`p-5 rounded-2xl border-2 transition-all ${pack.active ? "bg-white/10 border-white/20 hover:border-secondary" : "bg-black/20 opacity-40 grayscale cursor-not-allowed"}`}>
                  <div className="flex justify-between items-center text-white">
                    <div>
                      <h4 className="font-bold text-lg">{pack.n}</h4>
                      <p className="text-[10px] text-white/50 uppercase font-black tracking-widest">Cible : {pack.a}</p>
                    </div>
                    <p className="font-black text-secondary text-xl">{pack.p}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- GRILLE DES PROGRAMMES (Adaptabilité 1, 2 ou 3 colonnes) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {programs.map((program) => (
            <div key={program.title} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col border border-slate-100">
              <div className="relative h-56 md:h-64 overflow-hidden">
                <img src={program.image} alt={program.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-5 left-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg flex items-center justify-center text-primary">
                    <program.icon className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <div className="mb-4">
                  <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] bg-secondary/10 px-3 py-1.5 rounded-full">
                    {program.subtitle}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-primary mb-3 uppercase tracking-tighter">
                  {program.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-8 flex-grow">
                  {program.description}
                </p>
                
                <Button
                  onClick={() => handleProgramClick(program.id)}
                  variant={program.id === "vacation" ? "default" : "outline"}
                  className={`w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest flex gap-3 transition-all ${
                    program.id === "vacation" 
                    ? "bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20" 
                    : "border-primary/20 text-primary hover:bg-slate-50"
                  }`}
                >
                  {program.id === "vacation" ? <ChevronRight className="w-5 h-5" /> : <Calendar className="w-4 h-4" />}
                  {program.buttonLabel}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProgramModal isOpen={isVacationModalOpen} onClose={() => setIsVacationModalOpen(false)} />
    </section>
  );
};

export default ProgramsSection;
