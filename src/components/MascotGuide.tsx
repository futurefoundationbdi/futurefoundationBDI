import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react"; // Importation d'icônes pour le mode réduit

const MascotGuide = () => {
  const [status, setStatus] = useState<"arriving" | "talking" | "minimized">("arriving");
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[10000] flex items-end pointer-events-none">
      
      {/* 1. BULLE DE TEXTE (Uniquement en mode talking) */}
      <AnimatePresence>
        {status === "talking" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="mb-32 ml-10 p-4 bg-white rounded-2xl shadow-2xl border-2 border-[#1a4d4a] text-[#1a4d4a] w-56 pointer-events-auto relative"
          >
            <p className="text-[11px] font-black leading-tight">
              Génial ! Je reste dans le coin pour t'aider. Prêt à découvrir nos secrets financiers ?
            </p>
            <div className="flex gap-2 mt-3">
              <button 
                onClick={() => setStatus("minimized")}
                className="text-[10px] bg-[#f1c40f] px-3 py-1.5 rounded-full font-black text-primary shadow-sm hover:scale-105 transition-transform"
              >
                C'est parti !
              </button>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-[10px] text-gray-400 font-bold"
              >
                Fermer
              </button>
            </div>
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-b-2 border-r-2 border-[#1a4d4a] rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. LA MASCOTTE (S'adapte selon le status) */}
      <motion.div
        className="pointer-events-auto cursor-pointer relative"
        layout // Permet une transition fluide de taille et position
        initial={{ x: -400, opacity: 0 }}
        animate={{ 
          x: 0, 
          opacity: 1,
          scale: status === "minimized" ? 0.4 : 1, // Réduction de taille
        }}
        onAnimationComplete={() => {
          if (status === "arriving") setStatus("talking");
        }}
        onClick={() => status === "minimized" && setStatus("talking")} // Redevient grande au clic
        transition={{ type: "spring", stiffness: 60, damping: 15 }}
      >
        <motion.div
          animate={status === "talking" ? { 
            rotate: [0, -6, 6, -6, 6, 0],
            y: [0, -5, 0] 
          } : { y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ originX: 0.5, originY: 1 }}
          className="relative group"
        >
          {/* L'IMAGE DE LA MASCOTTE */}
          <img 
            src="/masc.png" 
            alt="Guide" 
            className={`w-32 md:w-44 h-auto drop-shadow-2xl transition-all ${status === "minimized" ? "filter saturate-150" : ""}`} 
          />
          
          {/* Badge de notification quand elle est réduite */}
          {status === "minimized" && (
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-secondary text-primary w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-lg"
            >
              <MessageCircle className="w-6 h-6 fill-current" />
            </motion.div>
          )}
        </motion.div>

        {/* Tooltip au survol en mode réduit */}
        {status === "minimized" && (
          <div className="absolute left-full ml-4 bottom-10 bg-primary text-white text-[10px] font-bold py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Besoin d'aide ?
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MascotGuide;
