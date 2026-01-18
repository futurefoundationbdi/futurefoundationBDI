import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MascotGuide = () => {
  const [showBubble, setShowBubble] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    // Retour à "left-4" pour laisser la place au Quiz à droite
    <div className="fixed bottom-4 left-4 z-[10000] pointer-events-none flex items-end">
      
      {/* 1. LA BULLE DE TEXTE */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="mb-32 ml-10 p-4 bg-white rounded-2xl shadow-2xl border-2 border-[#1a4d4a] text-[#1a4d4a] w-56 pointer-events-auto relative"
          >
            <p className="text-xs font-black leading-tight">
              Salut ! La réussite de tous est notre priorité. On explore le site ensemble ?
            </p>
            <div className="flex gap-2 mt-3">
              <button 
                onClick={() => setShowBubble(false)}
                className="text-[10px] bg-[#f1c40f] px-3 py-1.5 rounded-full font-black text-primary shadow-sm hover:scale-105 transition-transform"
              >
                C'est parti !
              </button>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-[10px] text-gray-400 font-bold hover:underline"
              >
                Plus tard
              </button>
            </div>
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-b-2 border-r-2 border-[#1a4d4a] rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. LA MASCOTTE AVEC ANIMATION DE SALUT */}
      <motion.div
        className="pointer-events-auto"
        initial={{ x: -400, opacity: 0 }}
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
          // ANIMATION DE SALUT : Rotation légère pour simuler un "coucou"
          animate={{ 
            rotate: [0, -6, 6, -6, 6, 0],
            y: [0, -5, 0] 
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatDelay: 4, // Elle salue toutes les 4 secondes
            ease: "easeInOut" 
          }}
          // Point d'ancrage en bas au milieu pour que le corps pivote sur ses pieds
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
