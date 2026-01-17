import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MascotGuide = () => {
  const [step, setStep] = useState(0); 
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setStep(1), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[10000] pointer-events-none flex items-end">
      {/* Bulle de texte avec un style assorti à la mascotte */}
      <AnimatePresence>
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-32 ml-10 p-4 bg-white rounded-2xl shadow-2xl border-2 border-[#1a4d4a] text-[#1a4d4a] w-56 pointer-events-auto relative"
          >
            <p className="text-xs font-black leading-tight">
              Salut ! Je suis ton guide. La réussite de tous est notre priorité ! On explore ensemble ?
            </p>
            <div className="flex gap-2 mt-3">
              <button 
                onClick={() => setStep(3)}
                className="text-[10px] bg-[#f1c40f] px-3 py-1.5 rounded-full font-black text-primary shadow-sm hover:scale-105 transition-transform"
              >
                C'est parti !
              </button>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-[10px] text-gray-400 font-bold"
              >
                Plus tard
              </button>
            </div>
            {/* Flèche de la bulle */}
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-b-2 border-r-2 border-[#1a4d4a] rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* La Mascotte Officielle */}
      <motion.div
        className="pointer-events-auto cursor-pointer"
        initial={{ x: -300, opacity: 0 }}
        animate={step >= 1 ? { x: 0, opacity: 1 } : {}}
        onAnimationComplete={() => step === 1 && setStep(2)}
        transition={{ type: "spring", stiffness: 40, damping: 12 }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-32 md:w-44" // Taille ajustée pour être visible mais pas envahissante
        >
          <img 
            src="/mascot.png" // Utilise le chemin de ton image ici
            alt="Mascotte Future Foundation"
            className="w-full h-auto drop-shadow-2xl"
          />
          
          {/* Petit effet d'étincelles autour (optionnel) */}
          <div className="absolute inset-0 bg-secondary/10 blur-2xl -z-10 rounded-full animate-pulse"></div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MascotGuide;
