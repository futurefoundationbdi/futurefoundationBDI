import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MascotGuide = () => {
  const [step, setStep] = useState("entering"); 
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setStep("leaving");
    setTimeout(() => setIsVisible(false), 800);
  };

  if (!isVisible) return null;

  return (
    // On réduit les marges sur mobile (bottom-2 left-2)
    <div className="fixed bottom-2 left-2 md:bottom-4 md:left-4 z-[10000] pointer-events-none flex items-end">
      
      {/* 1. LA BULLE DE TEXTE (Ajustée pour mobile) */}
      <AnimatePresence>
        {step === "chatting" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.5, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            // w-40 sur mobile, w-52 sur tablette/PC. mb-20 pour laisser la place à la mascotte plus petite
            className="mb-20 md:mb-32 ml-4 md:ml-10 p-3 md:p-4 bg-white rounded-2xl shadow-2xl border-2 border-[#1a4d4a] text-[#1a4d4a] w-40 md:w-52 pointer-events-auto relative"
          >
            <p className="text-[10px] md:text-xs font-black leading-tight mb-2 md:mb-3">
              Salut ! La réussite de tous est notre priorité. Content de te voir !
            </p>
            
            <button 
              onClick={handleDismiss}
              className="w-full text-[9px] md:text-[10px] bg-[#f1c40f] px-2 py-1.5 md:py-2 rounded-full font-black text-primary shadow-sm active:scale-95"
            >
              C'EST PARTI !
            </button>

            <div className="absolute -bottom-2 left-4 w-3 h-3 bg-white border-b-2 border-r-2 border-[#1a4d4a] rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. LA MASCOTTE RESPONSIVE */}
      <motion.div
        className="pointer-events-auto"
        initial={{ x: -200, opacity: 0 }}
        animate={{ 
          x: step === "leaving" ? -200 : 0, 
          opacity: step === "leaving" ? 0 : 1 
        }}
        onAnimationComplete={() => {
          if (step === "entering") setStep("chatting");
        }}
        transition={{ type: "spring", stiffness: 40, damping: 12 }}
      >
        <motion.div
          animate={step === "chatting" ? { 
            rotate: [0, -6, 6, -6, 6, 0],
            y: [0, -5, 0] 
          } : {}}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
          style={{ originX: 0.5, originY: 1 }}
          // TAILLE ADAPTÉE : w-24 (96px) sur mobile, w-44 (176px) sur PC
          className="relative w-24 md:w-44"
        >
          <img 
            src="/masc.png" 
            alt="Mascotte" 
            className="w-full h-auto drop-shadow-xl" 
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MascotGuide;
