import { motion } from "framer-motion";

const partners = [
  { name: "Partenaire 1", logo: "/partners/logo1.png" },
  { name: "Partenaire 2", logo: "/partners/logo2.png" },
  { name: "Partenaire 3", logo: "/partners/logo3.png" },
  { name: "Partenaire 4", logo: "/partners/logo4.png" },
  // Ajoute tes partenaires ici
];

const PartnersSection = () => {
  return (
    <section className="py-16 bg-white border-t border-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Ils nous font confiance</p>
          <div className="h-1 w-12 bg-secondary mx-auto rounded-full"></div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {partners.map((partner, index) => (
            <div 
              key={index}
              className="w-32 md:w-40 h-20 flex items-center justify-center p-2 hover:scale-110 transition-transform cursor-pointer"
            >
              <img 
                src={partner.logo} 
                alt={partner.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
