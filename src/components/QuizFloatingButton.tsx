import { motion } from "framer-motion";
import { Brain } from "lucide-react";

interface QuizFloatingButtonProps {
  onClick: () => void;
}

const QuizFloatingButton = ({ onClick }: QuizFloatingButtonProps) => {
  return (
   <motion.div
  // On passe à right-[30px] pour bien s'aligner sur l'axe central du chatbot
  className="fixed bottom-24 right-[30px] z-[999] md:bottom-32 md:right-[36px]"
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
>
      <button
        onClick={onClick}
        // On réduit la taille : p-3 au lieu de p-4 pour être proportionnel au chat
        className="relative p-3.5 md:p-4 bg-secondary text-primary rounded-full shadow-lg border-2 border-white group transition-all"
      >
        {/* L'onde de choc */}
        <span className="absolute inset-0 rounded-full bg-secondary animate-ping opacity-25"></span>
        
        {/* L'icône redimensionnée pour ne pas dominer le chat */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Brain className="w-6 h-6 md:w-8 md:h-8 relative z-10" />
        </motion.div>

        {/* Label IQ ajusté */}
        <span className="absolute -top-1 -right-1 bg-primary text-white text-[7px] font-black px-1.5 py-0.5 rounded-full border border-white">
          IQ
        </span>
      </button>
    </motion.div>
  );
};

export default QuizFloatingButton;
