import { motion } from "framer-motion";
import { Brain } from "lucide-react";

interface QuizFloatingButtonProps {
  onClick: () => void;
}

const QuizFloatingButton = ({ onClick }: QuizFloatingButtonProps) => {
  return (
    <motion.div
      // bottom-6 pour être à la même hauteur que le chat
      // right-[90px] pour être juste à côté (le chat occupe l'espace de 0 à ~70px)
      className="fixed bottom-6 right-[85px] z-[999] md:bottom-10 md:right-[100px]"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <button
        onClick={onClick}
        className="relative w-[50px] h-[50px] flex items-center justify-center bg-secondary text-primary rounded-full shadow-lg border-2 border-white group transition-all"
      >
        <span className="absolute inset-0 rounded-full bg-secondary animate-ping opacity-25"></span>
        
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Brain className="w-6 h-6 relative z-10" />
        </motion.div>

        <span className="absolute -top-1 -right-1 bg-primary text-white text-[7px] font-black px-1.5 py-0.5 rounded-full border border-white">
          IQ
        </span>
      </button>
    </motion.div>
  );
};

export default QuizFloatingButton;
