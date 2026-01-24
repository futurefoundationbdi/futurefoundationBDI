import { motion } from "framer-motion";
import { Brain } from "lucide-react";

interface QuizFloatingButtonProps {
  onClick: () => void;
}

const QuizFloatingButton = ({ onClick }: QuizFloatingButtonProps) => {
  return (
    <motion.div
      // Mobile: right-[85px] | Tablette/PC: md:right-[110px] pour compenser la taille plus large du chat sur PC
      className="fixed bottom-6 right-[85px] z-[999] md:bottom-10 md:right-[110px]"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <button
        onClick={onClick}
        // Mobile: w-[50px] | PC: md:w-[65px] (plus grand pour égaler le chatbot)
        className="relative w-[50px] h-[50px] md:w-[65px] md:h-[65px] flex items-center justify-center bg-secondary text-primary rounded-full shadow-lg border-2 md:border-4 border-white group transition-all"
      >
        <span className="absolute inset-0 rounded-full bg-secondary animate-ping opacity-25"></span>
        
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* L'icône grandit aussi sur PC avec md:w-9 md:h-9 */}
          <Brain className="w-6 h-6 md:w-9 md:h-9 relative z-10" />
        </motion.div>

        {/* Label IQ plus lisible sur PC */}
        <span className="absolute -top-1 -right-1 bg-primary text-white text-[7px] md:text-[10px] font-black px-1.5 py-0.5 md:px-2 md:py-1 rounded-full border border-white shadow-sm">
          IQ
        </span>
      </button>
    </motion.div>
  );
};

export default QuizFloatingButton;
