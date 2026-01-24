import { motion } from "framer-motion";
import { Brain } from "lucide-react";

interface QuizFloatingButtonProps {
  onClick: () => void;
}

const QuizFloatingButton = ({ onClick }: QuizFloatingButtonProps) => {
  return (
    <motion.div
      // On utilise une largeur fixe (w-[60px]) pour correspondre au widget Chatbase
      // On centre le contenu avec flex et on s'aligne à 20px du bord (standard Chatbase)
      className="fixed bottom-24 right-[20px] w-[60px] flex justify-center z-[999] md:bottom-32"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <button
        onClick={onClick}
        // Taille ajustée à 50px pour être élégante au-dessus du chat
        className="relative w-[50px] h-[50px] flex items-center justify-center bg-secondary text-primary rounded-full shadow-lg border-2 border-white group transition-all"
      >
        {/* L'onde de choc */}
        <span className="absolute inset-0 rounded-full bg-secondary animate-ping opacity-25"></span>
        
        {/* L'icône centrée */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Brain className="w-6 h-6 relative z-10" />
        </motion.div>

        {/* Label IQ */}
        <span className="absolute -top-1 -right-1 bg-primary text-white text-[7px] font-black px-1.5 py-0.5 rounded-full border border-white">
          IQ
        </span>
      </button>
    </motion.div>
  );
};

export default QuizFloatingButton;
