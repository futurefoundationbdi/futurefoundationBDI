import { motion } from "framer-motion";
import { Brain } from "lucide-react";

interface QuizFloatingButtonProps {
  onClick: () => void;
}

const QuizFloatingButton = ({ onClick }: QuizFloatingButtonProps) => {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-[9999] md:bottom-10 md:right-10"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <button
        onClick={onClick}
        className="relative p-4 md:p-5 bg-secondary text-primary rounded-full shadow-[0_10px_40px_rgba(241,196,15,0.5)] border-4 border-white group transition-all"
      >
        {/* L'onde de choc qui attire l'attention */}
        <span className="absolute inset-0 rounded-full bg-secondary animate-ping opacity-25"></span>
        
        {/* L'icône qui rebondit */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Brain className="w-8 h-8 md:w-10 md:h-10 relative z-10" />
        </motion.div>

        {/* Petit label flottant */}
        <span className="absolute -top-1 -left-1 bg-primary text-white text-[8px] font-black px-2 py-1 rounded-full border border-white">
          IQ
        </span>
      </button>
    </motion.div>
  );
};

export default QuizFloatingButton;
