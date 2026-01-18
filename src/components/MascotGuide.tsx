import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MascotGuide = () => {
  const [showBubble, setShowBubble] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    // Changement de "left-4" à "right-4" pour l'ancrage à droite
    <div className="fixed bottom-4 right-4 z-[10000] pointer-events-none flex flex-row-reverse items-end">
      
      {/* 1. LA BULLE DE TEXTE (ajustée pour être à gauche de la mascotte) */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="mb-32 mr-4 p-4 bg-white rounded-2xl shadow-2xl border-2 border-[#1a4d4a] text-[#1a4d4a] w-56 pointer-events-auto relative"
          >
            <p className="text-xs font-black leading-tight">
              Salut ! La réussite de tous est notre priorité. On explore le site ensemble ?
            </p>
            <div className="flex gap-2 mt-3">
              <button 
                onClick={() => setShowBubble(false)}
                className="text-[10px] bg-[#f1c40f] px-3 py-1.5 rounded-full font-black text-primary shadow-sm"
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
            {/* Flèche de la bulle inversée vers la droite */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b-2 border-r-2 border-[#1a4d4a] rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. LA MASCOTTE */}
      <motion.div
        className="pointer-events-auto"
        // Arrivée depuis la DROITE (400)
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        onAnimationComplete={() => {
            setTimeout(() => setShowBubble(true), 500);
        }}
        transition={{ 
          type: "spring", 
          stiffness: 50, 
          damping: 15,
          duration: 1.2 
        }}
      >
        <motion.div
          // ANIMATION DE SALUT (Wave)
          // On fait pivoter la mascotte de -5 à 5 degrés
          animate={{ 
            rotate: [0, -5, 5, -5, 5, 0],
            y: [0, -5, 0] 
          }}
          transition={{ 
            duration: 2, // Le salut dure 2 secondes
            repeat: Infinity, 
            repeatDelay: 3, // Elle salue, attend 3s, puis recommence
            ease: "easeInOut" 
          }}
          // Important : on définit le pivot en bas au centre pour le salut
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
