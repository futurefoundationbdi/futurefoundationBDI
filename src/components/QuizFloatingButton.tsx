import { motion } from "framer-motion";
import { Brain } from "lucide-react";

interface QuizFloatingButtonProps {
  onClick: () => void;
}

const QuizFloatingButton = ({ onClick }: QuizFloatingButtonProps) => {
  return (
    <motion.div
      // MOBILE : bottom-[10px] et right-[75px] pour être serré contre le chat
      // DESKTOP (md) : on remonte un peu et on écarte plus
      className="fixed bottom-[12px] right-[72px] z-[999] md:bottom-[20px] md:right-[115px]"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <button
        onClick={onClick}
        // Mobile : 48px (taille standard bouton mobile) | PC : 65px
        className="relative w-[48px] h-[48px] md:w-[65px] md:h-[65px] flex items-center justify-center bg-secondary text-primary rounded-full shadow-lg border-2 md:border-4 border-white group transition-all"
      >
        <span className="absolute inset-0 rounded-full bg-secondary animate-ping opacity-25"></span>
        
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Brain className="w-5 h-5 md:w-9 md:h-9 relative z-10" />
        </motion.div>

        <span className="absolute -top-1 -right-1 bg-primary text-white text-[7px] md:text-[10px] font-black px-1.5 py-0.5 md:px-2 md:py-1 rounded-full border border-white shadow-sm">
          IQ
        </span>
      </button>
    </motion.div>
  );
};

export default QuizFloatingButton;
