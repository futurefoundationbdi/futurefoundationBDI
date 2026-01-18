import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MascotGuide = () => {
  const [step, setStep] = useState(1); // 1: Arrivée, 2: Bulle, 3: Départ
  const [isVisible, setIsVisible] = useState(true);

  const handleStart = () => {
    setStep(3); // On lance l'animation de départ
    // On scroll doucement vers la section "Livre" pour guider l'utilisateur
    const section = document.getElementById('livre');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
    
    // On retire le composant du DOM après l'animation de sortie
    setTimeout(() => setIsVisible(false), 1000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[10000] pointer-events-none flex items-end">
      
      {/* BULLE DE TEXTE */}
      <AnimatePresence>
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, x: -50 }}
            className="mb-32 ml-10 p-4 bg-white rounded-2xl shadow-2xl border-2 border-[#1a4d4a] text-[#1a4d4a] w-56 pointer-events-auto relative"
          >
            <p className="text-xs font-black leading-tight">
              Génial ! Je te montre nos outils pour ta réussite financière ?
            </p>
            <div className="flex gap-2 mt-3">
              <button 
                onClick={handleStart}
                className="text-[10px] bg-[#f1c40f] px-3 py-1.5 rounded-full font-black text-primary shadow-sm hover:bg-yellow-400 transition-colors"
              >
                C'est parti !
              </button>
              <button 
                onClick={() => setStep(3)}
                className="text-[10px] text-gray-400 font-bold"
              >
                Plus tard
              </button>
            </div>
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-b-2 border-r-2 border-[#1a4d4a] rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LA MASCOTTE */}
      <motion.div
        className="pointer-events-auto"
        initial={{ x: -400, opacity: 0 }}
        // Si step < 3 on reste à 0, si step === 3 on s'enfuit à 1000px (hors écran)
        animate={{ 
          x: step === 3 ? 1500 : 0, 
          opacity: step === 3 ? 0 : 1,
          rotate: step === 3 ? 20 : 0 // Elle se penche en avant pour courir
        }}
        onAnimationComplete={() => {
            if (step === 1) setStep(2);
        }}
        transition={{ 
          type: "spring", 
          stiffness: step === 3 ? 30 : 50, // Course de départ plus fluide
          damping: 20,
          duration: step === 3 ? 0.8 : 1.2 
        }}
      >
        <motion.div
          animate={step === 2 ? { 
            rotate: [0, -6, 6, -6, 6, 0],
            y: [0, -5, 0] 
          } : {}}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          style={{ originX: 0.5, originY: 1 }}
          className="relative w-32 md:w-44"
        >
          <img src="/masc.png" alt="Guide" className="w-full h-auto drop-shadow-2xl" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MascotGuide;
