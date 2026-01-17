import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { 
  CheckCircle2, XCircle, Trophy, RefreshCcw, 
  Brain, Star, Share2, Zap, MessageCircle, X, ArrowRight 
} from "lucide-react";
import { QUIZ_DATABASE, Question } from "../data/quizQuestions";

const FinanceQuiz = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [level, setLevel] = useState<"debutant" | "intermediaire">("debutant");
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false); // Nouvel état pour le bouton Suivant
  const [totalXP, setTotalXP] = useState<number>(0);

  useEffect(() => {
    const savedXP = localStorage.getItem("future_foundation_xp");
    if (savedXP) setTotalXP(parseInt(savedXP));
  }, []);

  const loadNewSession = (lvl: "debutant" | "intermediaire") => {
    const all = QUIZ_DATABASE[lvl];
    const shuffled = [...all].sort(() => 0.5 - Math.random());
    setCurrentQuestions(shuffled.slice(0, 5));
    setStep(0);
    setScore(0);
    setIsFinished(false);
    setSelected(null);
    setHasAnswered(false);
    setLevel(lvl);
  };

  const startQuiz = (lvl: "debutant" | "intermediaire") => {
    loadNewSession(lvl);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeQuiz = () => {
    setIsOpen(false);
    document.body.style.overflow = "unset";
  };

  // 1. L'utilisateur valide sa réponse
  const handleAnswer = (idx: number) => {
    if (hasAnswered) return; // Empêche de changer de réponse
    setSelected(idx);
    setHasAnswered(true);
    if (idx === currentQuestions[step].c) setScore((prev) => prev + 1);
  };

  // 2. L'utilisateur décide de passer à la suite
  const nextStep = () => {
    if (step + 1 < currentQuestions.length) {
      setStep((prev) => prev + 1);
      setSelected(null);
      setHasAnswered(false);
    } else {
      const newTotalXP = totalXP + (score * 10);
      setTotalXP(newTotalXP);
      localStorage.setItem("future_foundation_xp", newTotalXP.toString());
      setIsFinished(true);
    }
  };

  const shareScore = () => {
    const text = `🔥 J'ai accumulé ${totalXP} points d'intelligence financière ! Peux-tu me battre ?\n\nFais le test ici : ${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  if (!isOpen) {
    return (
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto bg-primary rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-[10px] font-black mb-4 uppercase">
                        <Zap className="w-4 h-4 fill-secondary" /> {totalXP} XP CUMULÉS
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black mb-6 italic">Prêt pour le défi ?</h2>
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
    <div className="fixed inset-0 z-[999] bg-primary/98 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4">
      <button onClick={closeQuiz} className="absolute top-4 right-4 text-white/50 hover:text-white bg-white/10 p-3 rounded-full">
        <X className="w-6 h-6" />
      </button>

      <div className="w-full max-w-xl">
        <div className="bg-white text-primary rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative border-b-[10px] border-secondary animate-in zoom-in duration-300">
          {!isFinished ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase">
                <span className="flex items-center gap-1 text-secondary"><Star className="w-3 h-3 fill-secondary" /> {level}</span>
                <span className="bg-slate-100 px-3 py-1 rounded-full text-primary font-bold">Question {step + 1}/5</span>
              </div>
              
              <h3 className="text-xl md:text-2xl font-black leading-tight min-h-[80px] text-primary">
                {currentQuestions[step]?.q}
              </h3>

              <div className="grid gap-3">
                {currentQuestions[step]?.o.map((opt, i) => (
                  <button 
                    key={i} 
                    disabled={hasAnswered} 
                    onClick={() => handleAnswer(i)}
                    className={`w-full p-4 sm:p-5 rounded-2xl text-left text-sm font-bold border-2 transition-all flex justify-between items-center ${
                      selected === i 
                        ? (i === currentQuestions[step].c ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-red-500 bg-red-50 text-red-700") 
                        : (hasAnswered && i === currentQuestions[step].c ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-100")
                    }`}
                  >
                    <span className="pr-2">{opt}</span>
                    {hasAnswered && i === currentQuestions[step].c && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                    {hasAnswered && selected === i && i !== currentQuestions[step].c && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                  </button>
                ))}
              </div>

              {hasAnswered && (
                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="p-4 bg-secondary/10 rounded-2xl border-l-4 border-secondary">
                    <p className="text-xs text-primary/80 font-bold italic leading-relaxed">
                      💡 {currentQuestions[step].e}
                    </p>
                  </div>
                  
                  {/* BOUTON SUIVANT MANUEL */}
                  <Button 
                    onClick={nextStep}
                    className="w-full bg-primary text-white h-14 rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 hover:bg-primary/90 group"
                  >
                    {step + 1 < 5 ? "QUESTION SUIVANTE" : "VOIR MON SCORE"} 
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-8 py-4 animate-in zoom-in">
              <Trophy className="w-20 h-20 text-secondary mx-auto animate-bounce" />
              <div>
                <h3 className="text-2xl font-black text-primary uppercase">SCORE : {score}/5</h3>
                <p className="text-6xl font-black text-secondary my-4">+{score * 10} XP</p>
              </div>
              <div className="flex flex-col gap-3">
                <Button onClick={shareScore} className="bg-[#25D366] text-white rounded-2xl h-16 font-black text-lg shadow-xl flex items-center justify-center gap-3">
                  <MessageCircle className="w-6 h-6 fill-current" /> DÉFIE TES AMIS
                </Button>
                <Button onClick={() => loadNewSession(level)} variant="ghost" className="rounded-2xl h-12 text-slate-400 font-black uppercase text-[10px]">
                   <RefreshCcw className="w-4 h-4 mr-2" /> Rejouer
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinanceQuiz;
