import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MascotGuide = () => {
  const [step, setStep] = useState("entering"); // "entering", "chatting", "leaving"
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setStep("leaving");
    // On retire le composant après l'animation de sortie
    setTimeout(() => setIsVisible(false), 800);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[10000] pointer-events-none flex items-end">
      
      {/* 1. LA BULLE DE TEXTE */}
      <AnimatePresence>
        {step === "chatting" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.5, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-32 ml-10 p-4 bg-white rounded-2xl shadow-2xl border-2 border-[#1a4d4a] text-[#1a4d4a] w-52 pointer-events-auto relative"
          >
            <p className="text-xs font-black leading-tight mb-3">
              Salut ! La réussite de tous est notre priorité. Content de te voir ici !
            </p>
            
            <button 
              onClick={handleDismiss}
              className="w-full text-[10px] bg-[#f1c40f] px-3 py-2 rounded-full font-black text-primary shadow-sm hover:bg-yellow-400 transition-colors active:scale-95"
            >
              C'EST PARTI !
            </button>

            {/* Flèche de la bulle */}
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-b-2 border-r-2 border-[#1a4d4a] rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. LA MASCOTTE */}
      <motion.div
        className="pointer-events-auto"
        // État initial (caché à gauche)
        initial={{ x: -400, opacity: 0 }}
        // Animation selon l'étape
        animate={{ 
          x: step === "leaving" ? -400 : 0, 
          opacity: step === "leaving" ? 0 : 1 
        }}
        // SYNCHRONISATION : On lance la bulle dès que l'entrée est finie
        onAnimationComplete={() => {
          if (step === "entering") setStep("chatting");
        }}
        transition={{ 
          type: "spring", 
          stiffness: 40, 
          damping: 12
        }}
      >
        <motion.div
          // Animation de vie (salut/respiration) uniquement quand elle discute
          animate={step === "chatting" ? { 
            rotate: [0, -6, 6, -6, 6, 0],
            y: [0, -8, 0] 
          } : {}}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            repeatDelay: 2,
            ease: "easeInOut" 
          }}
          style={{ originX: 0.5, originY: 1 }}
          className="relative w-32 md:w-44"
        >
          <img 
            src="/masc.png" 
            alt="Mascotte Future Foundation" 
            className="w-full h-auto drop-shadow-2xl" 
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MascotGuide;
