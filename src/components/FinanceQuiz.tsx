import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { 
  CheckCircle2, XCircle, Trophy, RefreshCcw, 
  Star, MessageCircle, X, Zap 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- LES QUESTIONS SONT ICI POUR ÉVITER TOUT PROBLÈME DE CHARGEMENT ---
const QUIZ_DATA = {
  debutant: [
    { q: "Qui découvre les secrets de l'argent ?", o: ["Ismaël", "Alain", "Edouard"], c: 0, e: "L'histoire suit le jeune Ismaël et sa grand-mère." },
    { q: "Que signifie 'Ex-Nihilo' ?", o: ["Depuis le coffre", "À partir de rien", "Par le travail"], c: 1, e: "Création monétaire à partir de rien lors d'un prêt." },
    { q: "Quelle institution émet les billets au Burundi ?", o: ["La Bancobu", "La BRB", "Le Ministère"], c: 1, e: "Seule la Banque de la République du Burundi a ce pouvoir." },
    { q: "Comment Ismaël définit-il l'argent ?", o: ["Une chose physique", "Une histoire", "Un mal"], c: 1, e: "L'argent est une histoire de confiance." },
    { q: "Qu'est-ce qu'un Actif ?", o: ["Une voiture de luxe", "Ce qui met de l'argent en poche", "Un vêtement"], c: 1, e: "Un actif génère des revenus." }
  ],
  intermediaire: [
    { q: "Qu'est-ce qu'une action ?", o: ["Une dette", "Une part de propriété", "Un prêt"], c: 1, e: "Posséder une action, c'est posséder une part d'entreprise." },
    { q: "Que sont les intérêts composés ?", o: ["Des intérêts simples", "Des intérêts sur les intérêts", "Une taxe"], c: 1, e: "Les intérêts génèrent de nouveaux intérêts." },
    { q: "Un actif 'liquide' est...", o: ["Vendable vite en cash", "Très cher", "Imaginaire"], c: 0, e: "C'est la vitesse de conversion en argent." },
    { q: "Que signifie ROI ?", o: ["Roi de la banque", "Retour sur Investissement", "Risque"], c: 1, e: "Mesure de la rentabilité." },
    { q: "L'inflation grignote...", o: ["Les dettes", "Le pouvoir d'achat", "Les banques"], c: 1, e: "On achète moins avec la même somme." }
  ],
  avance: [
     { q: "L'effet de levier consiste à...", o: ["Réduire ses dettes", "Utiliser l'emprunt pour investir plus", "Travailler plus"], c: 1, e: "C'est augmenter sa capacité d'investissement grâce à l'endettement." },
     { q: "Qu'est-ce que l'inclusion financière ?", o: ["Payer ses impôts", "L'accès aux services financiers pour tous", "Avoir beaucoup d'argent"], c: 1, e: "C'est permettre à chacun d'accéder à l'économie." }
  ]
};

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
  const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [totalXP, setTotalXP] = useState<number>(0);
  const [newBadge, setNewBadge] = useState<{name: string, icon: string} | null>(null);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  // Charger l'XP au démarrage
  useEffect(() => {
    const savedXP = localStorage.getItem("future_foundation_xp");
    if (savedXP) setTotalXP(parseInt(savedXP));
  }, []);

  // --- LE FIX : Charger des questions si le quiz est ouvert via le bouton flottant ---
  useEffect(() => {
    if (isOpen && currentQuestions.length === 0) {
      loadNewSession("debutant");
    }
  }, [isOpen]);

  const loadNewSession = (lvl: "debutant" | "intermediaire" | "avance") => {
    const questions = [...(QUIZ_DATA[lvl] || QUIZ_DATA.debutant)].sort(() => 0.5 - Math.random()).slice(0, 5);
    setCurrentQuestions(questions);
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

  // --- RENDU SECTION ACCUEIL ---
  if (!isOpen) {
    return (
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto bg-primary rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-[10px] font-black mb-4 uppercase">
                  <Zap className="w-4 h-4 fill-secondary" /> {totalXP} XP CUMULÉS
                </div>
                <h2 className="text-3xl md:text-5xl font-black mb-6 italic leading-tight">Es-tu un génie de la <span className="text-secondary">Finance ?</span></h2>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button onClick={() => startQuiz("debutant")} className="bg-secondary text-primary font-black px-8 h-14 rounded-2xl shadow-lg">NIVEAU DÉBUTANT</Button>
                  <Button onClick={() => startQuiz("intermediaire")} variant="outline" className="border-2 border-white/20 text-white px-8 h-14 rounded-2xl font-black">NIVEAU EXPERT</Button>
                </div>
              </div>
          </div>
        </div>
      </section>
    );
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
              
              <h3 className="text-xl md:text-2xl font-black leading-tight text-primary">
                {currentQuestions[step]?.q}
              </h3>

              <div className="grid gap-3">
                {currentQuestions[step]?.o.map((opt: any, i: number) => (
                  <button 
                    key={`${step}-${i}`} 
                    disabled={hasAnswered} 
                    onClick={() => handleAnswer(i)}
                    className={`w-full p-4 rounded-2xl text-left text-sm font-bold border-2 transition-all flex justify-between items-center ${
                      selected === i 
                        ? (i === currentQuestions[step].c ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-red-500 bg-red-50 text-red-700") 
                        : (hasAnswered && i === currentQuestions[step].c ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-100")
                    }`}
                  >
                    <span>{opt}</span>
                    {hasAnswered && i === currentQuestions[step].c && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    {hasAnswered && selected === i && i !== currentQuestions[step].c && <XCircle className="w-5 h-5 text-red-500" />}
                  </button>
                ))}
              </div>

              {hasAnswered && (
                <div className="space-y-4 animate-in slide-in-from-bottom-2">
                  <div className="p-4 bg-secondary/10 rounded-2xl border-l-4 border-secondary">
                    <p className="text-xs text-primary/80 font-bold italic">💡 {currentQuestions[step].e}</p>
                  </div>
                  <Button onClick={nextStep} className="w-full bg-primary text-white h-14 rounded-2xl font-black shadow-xl">
                    {step + 1 < currentQuestions.length ? "QUESTION SUIVANTE" : "VOIR MON SCORE"} 
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-6 py-4 animate-in zoom-in">
              <AnimatePresence mode="wait">
                {newBadge ? (
                  <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
                    <div className="text-8xl">{newBadge.icon}</div>
                    <h3 className="text-2xl font-black text-secondary uppercase">Nouveau Badge !</h3>
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

              <div className="flex flex-col gap-3">
                <Button onClick={shareScore} className="bg-[#25D366] text-white rounded-2xl h-14 font-black shadow-xl flex items-center justify-center gap-3">
                  <MessageCircle className="w-5 h-5 fill-current" /> WHATSAPP
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
