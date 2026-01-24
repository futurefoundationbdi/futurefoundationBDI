import { motion } from "framer-motion";
import { Brain } from "lucide-react";

interface QuizFloatingButtonProps {
  onClick: () => void;
}

const QuizFloatingButton = ({ onClick }: QuizFloatingButtonProps) => {
  return (
    <motion.div
      // CHANGEMENT : Remplacement de right par left pour le placer à gauche
      // Mobile : bottom-[12px] left-[15px] | PC : md:bottom-[20px] md:left-[30px]
      className="fixed bottom-[12px] left-[15px] z-[999] md:bottom-[20px] md:left-[30px]"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <button
        onClick={onClick}
        // Tailles conservées pour garder le bon équilibre visuel
        className="relative w-[48px] h-[48px] md:w-[65px] md:h-[65px] flex items-center justify-center bg-secondary text-primary rounded-full shadow-lg border-2 md:border-4 border-white group transition-all"
      >
        {/* L'onde de choc */}
        <span className="absolute inset-0 rounded-full bg-secondary animate-ping opacity-25"></span>
        
        {/* L'icône du cerveau */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Brain className="w-5 h-5 md:w-9 md:h-9 relative z-10" />
        </motion.div>

        {/* Label IQ - on le garde en haut à droite du bouton pour la visibilité */}
        <span className="absolute -top-1 -right-1 bg-primary text-white text-[7px] md:text-[10px] font-black px-1.5 py-0.5 md:px-2 md:py-1 rounded-full border border-white shadow-sm">
          IQ
        </span>
      </button>
    </motion.div>
  );
};

export default QuizFloatingButton;
