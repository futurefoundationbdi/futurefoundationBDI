import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, BookOpen, Sun, Calendar } from "lucide-react";
import ProgramModal from "./ProgramModal";
import { 
  VACATION_PROGRAM_DATA, 
  FINANCE_PROGRAM_DATA, 
  LIFE_SKILLS_DATA 
} from "../data/programsData";

import educationImage from "@/assets/education-program.jpg";
import financialImage from "@/assets/financial-literacy.jpg";
import communityImage from "@/assets/community-program.jpg";

const ProgramsSection = () => {
  const [selectedProgram, setSelectedProgram] = useState<any>(null);

  const programs = [
    {
      id: "finance",
      icon: TrendingUp,
      title: "Éducation Financière",
      subtitle: "Indépendance",
      description: "Ateliers pratiques sur la gestion budgétaire et l'épargne pour préparer les jeunes à l'autonomie.",
      image: financialImage,
      buttonLabel: "Explorer",
      data: FINANCE_PROGRAM_DATA
    },
    {
      id: "life",
      icon: BookOpen,
      title: "Compétences de Vie",
      subtitle: "Leadership",
      description: "Coaching sur la discipline et les soft skills pour naviguer sereinement dans la société actuelle.",
      image: educationImage,
      buttonLabel: "Découvrir",
      data: LIFE_SKILLS_DATA
    },
    {
      id: "vacation",
      icon: Sun,
      title: "Programme Vacances",
      subtitle: "Impact Social",
      description: "Apprentissage accéléré et soutien pour les enfants démunis lors de périodes clés.",
      image: communityImage,
      buttonLabel: "Voir Histoires",
      data: VACATION_PROGRAM_DATA
    },
  ];

  return (
    <section id="programmes" className="py-16 md:py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4">
        
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
          <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Nos Initiatives</span>
          <h2 className="text-3xl md:text-6xl font-black text-primary mt-4 uppercase tracking-tighter leading-tight">Nos <span className="text-secondary italic">Programmes</span></h2>
          <p className="text-slate-400 text-[10px] mt-4 md:hidden font-black uppercase tracking-[0.2em] animate-pulse">
            ← Glissez pour explorer →
          </p>
        </div>

        {/* CONTENEUR AJUSTÉ : Gap réduit et Snap-padding ajouté */}
        <div className="flex overflow-x-auto pb-8 gap-4 snap-x snap-mandatory hide-scrollbar md:grid md:grid-cols-3 md:overflow-visible">
          {programs.map((program) => (
            <div 
              key={program.id} 
              className="min-w-[75vw] sm:min-w-[45vw] md:min-w-0 snap-center group bg-white rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 flex flex-col transition-all duration-300"
            >
              {/* Image moins haute sur mobile */}
              <div className="relative h-48 md:h-64 overflow-hidden">
                <img src={program.image} alt={program.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-lg">
                  <program.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
              </div>

              {/* Padding réduit sur mobile (p-6 au lieu de p-8) */}
              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <span className="text-[9px] font-black text-secondary uppercase tracking-widest mb-2">{program.subtitle}</span>
                <h3 className="text-xl md:text-2xl font-black text-primary mb-3 uppercase leading-tight">{program.title}</h3>
                <p className="text-slate-500 text-xs md:text-sm mb-6 flex-grow leading-relaxed italic md:not-italic">
                  {program.description}
                </p>
                
                <Button 
                  onClick={() => setSelectedProgram(program.data)}
                  variant="outline"
                  className="h-12 md:h-14 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest flex gap-3 border-2 border-primary/5 hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  <Calendar className="w-4 h-4" />
                  {program.buttonLabel}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProgramModal 
        isOpen={selectedProgram !== null} 
        onClose={() => setSelectedProgram(null)} 
        data={selectedProgram} 
      />

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default ProgramsSection;
