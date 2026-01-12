import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  BookOpen, 
  TrendingUp, 
  Sun, 
  Rocket, 
  Calendar, 
  Lock 
} from "lucide-react";
import educationImage from "@/assets/education-program.jpg";
import financialImage from "@/assets/financial-literacy.jpg";
import communityImage from "@/assets/community-program.jpg";

const ProgramsSection = () => {
  const programs = [
    {
      icon: TrendingUp,
      title: "Éducation Financière",
      subtitle: "Indépendance financière",
      description:
        "Ateliers pratiques sur la gestion budgétaire, l'épargne et les bases de l'investissement pour préparer les jeunes.",
      image: financialImage,
      buttonLabel: "Prochaines Sessions / Lives",
    },
    {
      icon: BookOpen,
      title: "Compétences de Vie",
      subtitle: "Développement personnel",
      description:
        "Coaching sur la discipline, les soft skills et le leadership pour naviguer sereinement dans la société actuelle.",
      image: educationImage,
      buttonLabel: "Consulter le Calendrier",
    },
    {
      icon: Sun,
      title: "Programme Vacances",
      subtitle: "Pour les enfants marginalisés",
      description:
        "Apprentissage accéléré et activités de développement personnel offrant des opportunités uniques aux plus démunis.",
      image: communityImage,
      buttonLabel: "En savoir plus",
    },
  ];

  const impactPacks = [
    { name: "Pack Mineur", age: "15-18 ans", price: "15.000 Fbu", active: true },
    { name: "Pack Majeur", age: "18-25 ans", price: "50.000 Fbu", active: true },
    { name: "Pack Adulte", age: "25-30 ans", price: "100.000 Fbu", active: false },
  ];

  return (
    <section id="programmes" className="py-12 md:py-32 bg-slate-50">
      <div className="container mx-auto px-4">
        
        {/* Header - Taille de texte optimisée */}
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-bold text-[10px] md:text-xs uppercase tracking-widest mb-4">
            Nos Initiatives
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4 md:mb-6 leading-tight">
            Des programmes pour{" "}
            <span className="text-primary">transformer l'avenir</span>
          </h2>
        </div>

        {/* --- SECTION IMPACT 360 --- */}
        <div className="mb-12 md:mb-16 bg-primary rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border-2 md:border-4 border-white">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Contenu Texte - Alignement centré sur mobile */}
            <div className="p-6 sm:p-8 md:p-12 text-white flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4 md:mb-6 text-secondary">
                <Rocket className="w-6 h-6 md:w-8 md:h-8" />
                <span className="font-black uppercase tracking-tighter text-base md:text-xl italic">Impact 360</span>
              </div>
              <h3 className="text-2xl md:text-4xl font-black mb-4 md:mb-6 leading-tight">
                L'Accompagnement Élite <br className="hidden md:block"/> sur 3 mois
              </h3>
              <p className="text-white/80 mb-6 md:mb-8 text-sm md:text-base leading-relaxed">
                Un pack premium : coaching personnalisé, accès bibliothèque privée et stratégies d'investissement.
              </p>
              <Button className="w-full md:w-max bg-secondary hover:bg-secondary/90 text-primary font-black px-6 py-5 md:px-10 md:py-7 rounded-xl md:rounded-2xl group transition-all text-base md:text-lg">
                S'inscrire au programme
                <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
            </div>

            {/* Grille des Packs - Espacement réduit sur mobile */}
            <div className="bg-white/5 backdrop-blur-sm p-5 sm:p-6 md:p-8 flex flex-col gap-3 md:gap-4 justify-center border-t lg:border-t-0 lg:border-l border-white/10">
              {impactPacks.map((pack) => (
                <div 
                  key={pack.name} 
                  className={`p-4 md:p-5 rounded-xl md:rounded-2xl border-2 transition-all ${
                    pack.active 
                    ? "bg-white/10 border-white/20 hover:border-secondary/50" 
                    : "bg-black/20 border-white/5 opacity-50 grayscale"
                  }`}
                >
                  <div className="flex justify-between items-center text-white">
                    <div className="max-w-[65%]">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-sm md:text-lg leading-tight">{pack.name}</h4>
                        {!pack.active && <span className="text-[7px] md:text-[8px] bg-white/20 px-1.5 py-0.5 rounded-full flex items-center gap-1 uppercase font-bold"><Lock size={8}/> Indisponible</span>}
                      </div>
                      <p className="text-[9px] md:text-xs text-white/60 mt-0.5">Âge : {pack.age}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-secondary text-sm md:text-xl">{pack.price}</p>
                      {pack.active && <p className="text-[7px] md:text-[8px] uppercase font-bold text-white/40">Frais</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- GRILLE DES AUTRES PROGRAMMES --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {programs.map((program, index) => (
            <div
              key={program.title}
              className="group bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 flex flex-col"
            >
              <div className="relative h-40 sm:h-44 md:h-52 overflow-hidden shrink-0">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                <div className="absolute top-3 left-3 md:top-4 md:left-4">
                  <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center">
                    <program.icon className="w-4 h-4 md:w-6 md:h-6 text-primary" />
                  </div>
                </div>
              </div>

              <div className="p-5 md:p-8 flex flex-col flex-grow">
                <div className="mb-3">
                  <span className="text-[8px] md:text-[9px] font-black text-secondary uppercase tracking-widest bg-secondary/10 px-2 py-1 rounded-full">
                    {program.subtitle}
                  </span>
                </div>
                <h3 className="text-lg md:text-2xl font-bold text-primary mb-2 md:mb-3 italic leading-tight">
                  {program.title}
                </h3>
                <p className="text-[13px] md:text-sm text-muted-foreground leading-relaxed mb-6 flex-grow">
                  {program.description}
                </p>
                <Button
                  variant="outline"
                  className="w-full border-primary/20 text-primary hover:bg-primary hover:text-white rounded-xl h-10 md:h-12 font-bold text-[11px] md:text-sm flex gap-2 mt-auto"
                >
                  <Calendar className="w-3.5 h-3.5 md:w-4 h-4" />
                  {program.buttonLabel}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
