import { Target, Heart, Users, Lightbulb } from "lucide-react";

const MissionSection = () => {
  const values = [
    {
      icon: Target,
      title: "Notre Vision",
      description:
        "Former des Jeunes sages qui deviendront des leaders capables; de contribuer au développement de leur communauté et de prendre en main leur avenir.",
    },
    {
      icon: Heart,
      title: "Notre Engagement",
      description:
        "Accompagner chaque jeune dans son parcours vers l'autonomie, avec bienveillance et détermination.",
    },
    {
      icon: Users,
      title: "Notre Approche",
      description:
        "Programmes inclusifs et adaptés aux besoins spécifiques des jeunes burundais, du secondaire à l'entrée dans la vie active.",
    },
    {
      icon: Lightbulb,
      title: "Notre Impact",
      description:
        "Transformer des vies en développant les compétences pratiques et l'estime de soi de chaque participant.",
    },
  ];

  return (
    <section id="mission" className="py-16 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Header - Ajustement des tailles pour mobile */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <span className="inline-block px-4 py-2 bg-secondary/10 rounded-full text-secondary font-semibold text-xs md:text-sm mb-4">
            Notre Mission
          </span>
          <h2 className="text-2xl md:text-5xl font-bold text-foreground mb-4 md:mb-6 leading-tight">
            Autonomiser les jeunes pour un{" "}
            <span className="text-secondary">avenir meilleur</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Notre mission est de doter les jeunes adolescents et ceux qui viennent 
            de terminer leurs études secondaires des outils essentiels pour leur avenir. 
            Nous nous concentrons sur la lutte contre l'illettrisme financier et le 
            développement de compétences de vie pratiques.
          </p>
        </div>

        {/* Values Grid - Passage intelligent de 1 à 2 puis 4 colonnes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div
              key={value.title}
              className="group p-6 bg-card rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 md:hover:-translate-y-2 border border-border/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icône plus petite sur mobile */}
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary group-hover:scale-110 transition-all duration-300">
                <value.icon className="w-6 h-6 md:w-7 md:h-7 text-secondary group-hover:text-secondary-foreground transition-colors" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-3">
                {value.title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
