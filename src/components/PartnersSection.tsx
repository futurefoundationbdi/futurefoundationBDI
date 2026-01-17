import { motion } from "framer-motion";

const partners = [
  { name: "Partenaire 1", logo: "/partners/logo1.png" },
  { name: "Partenaire 2", logo: "/partners/logo2.png" },
  { name: "Partenaire 3", logo: "/partners/logo3.png" },
  { name: "Partenaire 4", logo: "/partners/logo4.png" },
  { name: "Partenaire 5", logo: "/partners/logo5.png" },
  { name: "Partenaire 6", logo: "/partners/logo6.png" },
];

// On double la liste pour créer l'effet de boucle infinie
const duplicatedPartners = [...partners, ...partners];

const PartnersSection = () => {
  return (
    <section className="py-12 bg-white overflow-hidden border-t border-slate-50">
      <div className="container mx-auto px-4 mb-8">
        <div className="text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
            Ils soutiennent nos actions
          </p>
          <div className="h-1 w-12 bg-secondary mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Conteneur du défilement */}
      <div className="relative flex w-full">
        <motion.div 
          className="flex gap-12 md:gap-20 items-center whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }} // Déplace de 0 à la moitié (la liste doublée)
          transition={{ 
            duration: 20, // Vitesse du défilé (plus c'est haut, plus c'est lent)
            ease: "linear", 
            repeat: Infinity 
          }}
        >
          {duplicatedPartners.map((partner, index) => (
            <div 
              key={index}
              className="w-24 md:w-40 h-20 flex-shrink-0 flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <img 
                src={partner.logo} 
                alt={partner.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </motion.div>

        {/* Optionnel : Dégradé sur les bords pour un effet de fondu */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
      </div>
    </section>
  );
};

export default PartnersSection;
