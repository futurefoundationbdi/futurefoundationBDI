import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, BookOpen, Sun, ChevronRight, Calendar } from "lucide-react";
import ProgramModal from "./ProgramModal";
// On importe nos 3 blocs de données
import { 
  VACATION_PROGRAM_DATA, 
  FINANCE_PROGRAM_DATA, 
  LIFE_SKILLS_DATA 
} from "../data/programsData";

// Importation de tes images de couverture (Vérifie bien que ces fichiers existent dans assets)
import educationImage from "@/assets/education-program.jpg";
import financialImage from "@/assets/financial-literacy.jpg";
import communityImage from "@/assets/community-program.jpg";

const ProgramsSection = () => {
  // Cet état servira à savoir quel programme est ouvert (null = fermé)
  const [selectedProgram, setSelectedProgram] = useState<any>(null);

  const programs = [
    {
      id: "finance",
      icon: TrendingUp,
      title: "Éducation Financière",
      subtitle: "Indépendance",
      description: "Ateliers pratiques sur la gestion budgétaire et l'épargne pour préparer les jeunes à l'autonomie.",
      image: financialImage,
      buttonLabel: "Explorer les sessions",
      data: FINANCE_PROGRAM_DATA // Liaison avec les données finance
    },
    {
      id: "life",
      icon: BookOpen,
      title: "Compétences de Vie",
      subtitle: "Leadership",
      description: "Coaching sur la discipline et les soft skills pour naviguer sereinement dans la société actuelle.",
      image: educationImage,
      buttonLabel: "Découvrir le parcours",
      data: LIFE_SKILLS_DATA // Liaison avec les données compétences
    },
    {
      id: "vacation",
      icon: Sun,
      title: "Programme Vacances",
      subtitle: "Impact Social",
      description: "Apprentissage accéléré et soutien pour les enfants démunis lors de périodes clés.",
      image: communityImage,
      buttonLabel: "Voir les histoires",
      data: VACATION_PROGRAM_DATA // Liaison avec les données vacances
    },
  ];

  return (
    <section id="programmes" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">Nos Initiatives</span>
          <h2 className="text-4xl md:text-6xl font-black text-primary mt-6 uppercase tracking-tighter">Transformer <span className="text-secondary italic">l'Avenir</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <div key={program.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img src={program.image} alt={program.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-6 left-6 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-lg">
                  <program.icon className="w-6 h-6" />
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <span className="text-[10px] font-black text-secondary uppercase tracking-widest mb-2">{program.subtitle}</span>
                <h3 className="text-2xl font-black text-primary mb-4 uppercase">{program.title}</h3>
                <p className="text-slate-500 text-sm mb-8 flex-grow">{program.description}</p>
                
                <Button 
                  onClick={() => setSelectedProgram(program.data)} // On envoie les données au clic
                  variant={program.id === "vacation" ? "default" : "outline"}
                  className="h-14 rounded-2xl font-black text-xs uppercase tracking-widest flex gap-3 hover:scale-[1.02] transition-transform"
                >
                  <Calendar className="w-4 h-4" />
                  {program.buttonLabel}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL UNIQUE ET INTELLIGENT */}
      <ProgramModal 
        isOpen={selectedProgram !== null} 
        onClose={() => setSelectedProgram(null)} 
        data={selectedProgram} 
      />
    </section>
  );
};

export default ProgramsSection;
