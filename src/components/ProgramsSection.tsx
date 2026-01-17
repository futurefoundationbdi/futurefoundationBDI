import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, BookOpen, Sun, Calendar, ArrowRight } from "lucide-react";
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
    <section id="programmes" className="py-20 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4">
        
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">Nos Initiatives</span>
          <h2 className="text-4xl md:text-6xl font-black text-primary mt-6 uppercase tracking-tighter">Nos <span className="text-secondary italic">Programmes</span></h2>
          <p className="text-slate-400 text-sm mt-4 md:hidden font-bold uppercase tracking-widest">← Glissez pour explorer →</p>
        </div>

        {/* CONTENEUR DÉFILANT : snap-x force l'arrêt sur une carte précise */}
        <div className="flex overflow-x-auto pb-10 gap-6 snap-x snap-mandatory hide-scrollbar md:grid md:grid-cols-3 md:overflow-visible">
          {programs.map((program) => (
            <div 
              key={program.id} 
              className="min-w-[85vw] md:min-w-0 snap-center group bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <img src={program.image} alt={program.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-6 left-6 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-lg">
                  <program.icon className="w-6 h-6" />
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <span className="text-[10px] font-black text-secondary uppercase tracking-widest mb-2">{program.subtitle}</span>
                <h3 className="text-2xl font-black text-primary mb-4 uppercase">{program.title}</h3>
                <p className="text-slate-500 text-sm mb-8 flex-grow leading-relaxed">{program.description}</p>
                
                <Button 
                  onClick={() => setSelectedProgram(program.data)}
                  variant="outline"
                  className="h-14 rounded-2xl font-black text-xs uppercase tracking-widest flex gap-3 border-2 border-primary/10 hover:bg-primary hover:text-white transition-all"
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

      {/* STYLE CSS POUR CACHER LA BARRE DE SCROLL TOUT EN GARDANT LE DÉFILEMENT */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default ProgramsSection;
