import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { CheckCircle2, XCircle, Trophy, RefreshCcw, Star, MessageCircle, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QUIZ_DATABASE, Question } from "../data/quizQuestions";

const BADGE_LEVELS = [
  { name: "Novice en Épargne", xp: 0, icon: "🌱" },
  { name: "Apprenti Investisseur", xp: 100, icon: "💰" },
  { name: "Stratège de la BRB", xp: 300, icon: "🏛️" },
  { name: "Maître de la Liberté", xp: 600, icon: "👑" },
];

interface FinanceQuizProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const FinanceQuiz = ({ isOpen: externalIsOpen, onClose: externalOnClose }: FinanceQuizProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [level, setLevel] = useState<"debutant" | "intermediaire" | "avance">("debutant");
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [totalXP, setTotalXP] = useState<number>(0);
  const [newBadge, setNewBadge] = useState<{name: string, icon: string} | null>(null);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  useEffect(() => {
    const savedXP = localStorage.getItem("future_foundation_xp");
    if (savedXP) setTotalXP(parseInt(savedXP));
  }, []);

  useEffect(() => {
    if (isOpen && currentQuestions.length === 0) {
      loadNewSession("debutant");
    }
  }, [isOpen]);

  const loadNewSession = (lvl: "debutant" | "intermediaire" | "avance") => {
    const all = QUIZ_DATABASE[lvl] || [];
    if (all.length === 0) return;
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, 5);

    setCurrentQuestions(selectedQuestions);
    setStep(0);
    setScore(0);
    setIsFinished(false);
    setSelected(null);
    setHasAnswered(false);
    setLevel(lvl);
    setNewBadge(null);
  };

  const startQuiz = (lvl: "debutant" | "intermediaire" | "avance") => {
    loadNewSession(lvl);
    if (externalIsOpen === undefined) setInternalIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleClose = () => {
    if (externalOnClose) externalOnClose();
    else setInternalIsOpen(false);
    document.body.style.overflow = "unset";
    setCurrentQuestions([]); 
  };

  const handleAnswer = (idx: number) => {
    if (hasAnswered || !currentQuestions[step]) return;
    setSelected(idx);
    setHasAnswered(true);
    if (idx === currentQuestions[step].c) setScore(s => s + 1);
  };

  const nextStep = () => {
    if (step + 1 < currentQuestions.length) {
      setStep(s => s + 1);
      setSelected(null);
      setHasAnswered(false);
    } else {
      const earnedXP = score * 10;
      const oldXP = totalXP;
      const updatedTotalXP = oldXP + earnedXP;
      
      const oldBadge = [...BADGE_LEVELS].reverse().find(b => oldXP >= b.xp);
      const currentBadge = [...BADGE_LEVELS].reverse().find(b => updatedTotalXP >= b.xp);
      
      if (currentBadge && currentBadge.name !== oldBadge?.name) {
        setNewBadge({ name: currentBadge.name, icon: currentBadge.icon });
      }

      setTotalXP(updatedTotalXP);
      localStorage.setItem("future_foundation_xp", updatedTotalXP.toString());
      window.dispatchEvent(new Event("storage"));
      setIsFinished(true);
    }
  };

  const shareScore = () => {
    const text = `🔥 Grade : "${[...BADGE_LEVELS].reverse().find(b => totalXP >= b.xp)?.name}" sur Future Foundation !`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  // --- MODIFICATION ICI : SUPPRESSION DU RENDU PAR DÉFAUT ---
  // Si le quiz n'est pas ouvert, on ne retourne rien (pas de section en bas du footer)
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[10000] bg-primary/98 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <button onClick={handleClose} className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 p-3 rounded-full z-50">
        <X className="w-6 h-6" />
      </button>

      <div className="w-full max-w-xl my-auto">
        <div className="bg-white text-primary rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative border-b-[10px] border-secondary animate-in zoom-in">
          
          {!isFinished ? (
            <div className="space-y-6" key={step}>
              <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase">
                <span className="flex items-center gap-1 text-secondary"><Star className="w-3 h-3 fill-secondary" /> {level}</span>
                <span className="bg-slate-100 px-3 py-1 rounded-full text-primary font-bold">Question {step + 1}/5</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-primary">{currentQuestions[step]?.q}</h3>
              <div className="grid gap-3">
                {currentQuestions[step]?.o.map((opt, i) => (
                  <button key={i} disabled={hasAnswered} onClick={() => handleAnswer(i)}
                    className={`w-full p-4 rounded-2xl text-left text-sm font-bold border-2 transition-all ${
                      selected === i 
                        ? (i === currentQuestions[step].c ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-red-500 bg-red-50 text-red-700") 
                        : (hasAnswered && i === currentQuestions[step].c ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-100")
                    }`}>
                    {opt}
                  </button>
                ))}
              </div>
              {hasAnswered && (
                <div className="space-y-4">
                  <div className="p-4 bg-secondary/10 rounded-2xl border-l-4 border-secondary text-xs italic font-bold">💡 {currentQuestions[step].e}</div>
                  <Button onClick={nextStep} className="w-full bg-primary text-white h-14 rounded-2xl font-black">
                    {step + 1 < currentQuestions.length ? "QUESTION SUIVANTE" : "VOIR MON SCORE"} 
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-6 py-4 animate-in zoom-in">
              <AnimatePresence mode="wait">
                {newBadge ? (
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    className="space-y-4"
                  >
                    <div className="text-8xl animate-bounce">{newBadge.icon}</div>
                    <h3 className="text-2xl font-black text-secondary uppercase tracking-tighter">Nouveau Grade !</h3>
                    <p className="text-lg font-bold text-primary italic">"{newBadge.name}"</p>
                  </motion.div>
                ) : (
                  <div className="py-4">
                    <Trophy className="w-16 h-16 text-secondary mx-auto animate-bounce" />
                    <h3 className="text-2xl font-black text-primary uppercase mt-4">SCORE : {score}/5</h3>
                  </div>
                )}
              </AnimatePresence>

              <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-5xl font-black text-primary">+{score * 10} XP</p>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button onClick={shareScore} className="bg-[#25D366] text-white rounded-2xl h-14 font-black flex items-center justify-center gap-3 shadow-xl">
                  <MessageCircle className="w-5 h-5 fill-current" /> PARTAGER LE SCORE
                </Button>
                <div className="flex gap-2">
                  <Button onClick={() => loadNewSession(level)} variant="outline" className="flex-1 rounded-2xl h-12 font-black">REJOUER</Button>
                  <Button onClick={handleClose} variant="ghost" className="flex-1 font-black">QUITTER</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinanceQuiz;
