import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MascotGuide = () => {
  const [step, setStep] = useState(0); // 0: caché, 1: arrive, 2: salut/parle
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // La mascotte arrive après 1.5 seconde
    const timer = setTimeout(() => setStep(1), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[10000] pointer-events-none flex items-end">
      {/* Bulle de texte */}
      <AnimatePresence>
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-12 ml-4 p-4 bg-white rounded-2xl shadow-2xl border-2 border-primary text-primary w-48 pointer-events-auto relative"
          >
            <p className="text-xs font-bold leading-tight">
              Salut ! Je suis ton guide financier. Je t'accompagne pour découvrir la fondation ?
            </p>
            <div className="flex gap-2 mt-2">
              <button 
                onClick={() => setStep(3)} // On pourrait ajouter une action ici
                className="text-[10px] bg-secondary px-2 py-1 rounded-full font-black text-primary"
              >
                Oui, volontiers !
              </button>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-[10px] text-gray-400"
              >
                Non merci
              </button>
            </div>
            {/* Petite flèche de la bulle */}
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-b-2 border-r-2 border-primary rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* La Mascotte */}
      <motion.div
        className="pointer-events-auto cursor-pointer"
        initial={{ x: -200, opacity: 0 }}
        animate={step >= 1 ? { x: 0, opacity: 1 } : {}}
        onAnimationComplete={() => step === 1 && setStep(2)}
        transition={{ type: "spring", stiffness: 50, damping: 15 }}
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative"
        >
          {/* Remplace l'emoji par une image de mascotte si tu en as une : /mascot.png */}
          <div className="text-6xl filter drop-shadow-lg">🦁</div>
          
          {/* Animation du bras qui salue */}
          <motion.div
            animate={step === 2 ? { rotate: [0, 20, 0, 20, 0] } : {}}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            className="absolute top-4 right-0 text-2xl"
          >
            👋
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MascotGuide;
