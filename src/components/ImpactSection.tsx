import { GraduationCap, Users, MapPin, Award } from "lucide-react";

const ImpactSection = () => {
  const stats = [
    {
      icon: GraduationCap,
      number: "500+",
      label: "Jeunes formés",
      description: "Adolescents et jeunes diplômés accompagnés",
    },
    {
      icon: Users,
      number: "50+",
      label: "Bénévoles actifs",
      description: "Mentors dévoués à notre cause",
    },
    {
      icon: MapPin,
      number: "10+",
      label: "Communautés",
      description: "Régions du Burundi touchées",
    },
    {
      icon: Award,
      number: "95%",
      label: "Satisfaction",
      description: "Taux de satisfaction des participants",
    },
  ];

  return (
    <section id="impact" className="py-16 md:py-32 bg-hero-gradient text-primary-foreground">
      <div className="container mx-auto px-4">
        {/* Header - Ajusté pour la lisibilité mobile */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <span className="inline-block px-4 py-2 bg-secondary/20 rounded-full text-secondary font-semibold text-xs md:text-sm mb-4">
            Notre Impact
          </span>
          <h2 className="text-2xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
            Des résultats qui{" "}
            <span className="text-secondary">parlent d'eux-mêmes</span>
          </h2>
          <p className="text-base md:text-lg text-primary-foreground/80 leading-relaxed">
            Chaque jour, nous travaillons à créer un changement durable dans la 
            vie des jeunes burundais et de leurs communautés.
          </p>
        </div>

        {/* Stats Grid - 1 col mobile, 2 col tablette, 4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-6 md:p-8 rounded-2xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-all duration-300"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
              </div>
              <p className="text-3xl md:text-5xl font-black text-secondary mb-1 md:mb-2">
                {stat.number}
              </p>
              <p className="text-lg md:text-xl font-bold mb-2 leading-tight">{stat.label}</p>
              <p className="text-xs md:text-sm text-primary-foreground/70 leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Objectives - Section simplifiée pour mobile */}
        <div className="mt-16 md:mt-24 max-w-5xl mx-auto">
          <h3 className="text-xl md:text-3xl font-bold text-center mb-8 md:mb-12 uppercase tracking-wide">
            Nos Objectifs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { id: 1, title: "Compétences Pratiques", text: "Fournir des compétences de vie pour aider les jeunes à naviguer dans la société." },
              { id: 2, title: "Développement Personnel", text: "Encourager l'amélioration de la confiance en soi et l'estime de soi." },
              { id: 3, title: "Jeunes Visionnaires", text: "Bâtir une génération capable de contribuer au développement de leur communauté." }
            ].map((obj) => (
              <div key={obj.id} className="p-5 md:p-6 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary font-black mb-4 shrink-0 text-sm">
                  {obj.id}
                </div>
                <h4 className="font-bold text-base md:text-lg mb-2">{obj.title}</h4>
                <p className="text-primary-foreground/80 text-[13px] md:text-sm leading-relaxed">
                  {obj.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
