import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { 
  CheckCircle2, XCircle, Trophy, RefreshCcw, 
  Brain, Star, Share2, Zap, MessageCircle, X 
} from "lucide-react";
import { QUIZ_DATABASE, Question } from "../data/quizQuestions";

const FinanceQuiz = () => {
  // --- ÉTATS DU JEU ---
  const [isOpen, setIsOpen] = useState(false);
  const [level, setLevel] = useState<"debutant" | "intermediaire">("debutant");
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [totalXP, setTotalXP] = useState<number>(0);

  // Charger l'XP sauvegardé au montage du composant
  useEffect(() => {
    const savedXP = localStorage.getItem("future_foundation_xp");
    if (savedXP) setTotalXP(parseInt(savedXP));
  }, []);

  // --- LOGIQUE DU JEU ---
  const loadNewSession = (lvl: "debutant" | "intermediaire") => {
    const all = QUIZ_DATABASE[lvl];
    const shuffled = [...all].sort(() => 0.5 - Math.random());
    setCurrentQuestions(shuffled.slice(0, 5));
    setStep(0);
    setScore(0);
    setIsFinished(false);
    setSelected(null);
    setLevel(lvl);
  };

  const startQuiz = (lvl: "debutant" | "intermediaire") => {
    loadNewSession(lvl);
    setIsOpen(true);
    document.body.style.overflow = "hidden"; // Bloque le scroll derrière
  };

  const closeQuiz = () => {
    setIsOpen(false);
    document.body.style.overflow = "unset"; // Libère le scroll
  };

  const handleAnswer = (idx: number) => {
    setSelected(idx);
    const isCorrect = idx === currentQuestions[step].c;
    
    if (isCorrect) setScore((prev) => prev + 1);
    
    setTimeout(() => {
      if (step + 1 < currentQuestions.length) {
        setStep((prev) => prev + 1);
        setSelected(null);
      } else {
        // Calcul du score final pour l'XP
        const finalSessionScore = score + (isCorrect ? 1 : 0);
        const newTotalXP = totalXP + (finalSessionScore * 10);
        setTotalXP(newTotalXP);
        localStorage.setItem("future_foundation_xp", newTotalXP.toString());
        setIsFinished(true);
      }
    }, 1500);
  };

  const shareScore = () => {
    const text = `🔥 J'ai accumulé ${totalXP} points d'intelligence financière sur le site de The Future Foundation ! Peux-tu me battre ?\n\nFais le test ici : ${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  // --- RENDU 1 : SECTION D'APPEL SUR L'ACCUEIL ---
  if (!isOpen) {
    return (
      <section id="quiz-cta" className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-primary rounded-[2rem] p-6 md:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            {/* Décoration en arrière-plan */}
            <Brain className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 pointer-events-none" />
            
            <div className="flex-1 text-center md:text-left relative z-10">
              <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-[10px] font-black mb-4 uppercase tracking-widest border border-secondary/10">
                <Zap className="w-4 h-4 fill-secondary" /> {totalXP} XP CUMULÉS
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
                Prêt pour le <span className="text-secondary italic">Test ?</span>
              </h2>
              <p className="text-white/70 font-medium mb-8 max-w-lg">
                Défiez-vous avec nos questions sur l'intelligence financière. Gagnez de l'XP et partagez votre score !
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <Button 
                  onClick={() => startQuiz("debutant")} 
                  className="bg-secondary text-primary font-black px-8 h-14 rounded-2xl hover:scale-105 transition-transform shadow-lg active:scale-95"
                >
                  NIVEAU DÉBUTANT
                </Button>
                <Button 
                  onClick={() => startQuiz("intermediaire")} 
                  variant="outline" 
                  className="border-2 border-white/20 text-white hover:bg-white/10 px-8 h-14 rounded-2xl font-black active:scale-95"
                >
                  NIVEAU EXPERT
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // --- RENDU 2 : MODAL DU QUIZ (PLEIN ÉCRAN MOBILE-FRIENDLY) ---
  return (
    <div className="fixed inset-0 z-[999] bg-primary/98 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-300">
      {/* Bouton Fermer */}
      <button 
        onClick={closeQuiz} 
        className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors bg-white/10 p-3 rounded-full z-[1000] active:scale-90"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="w-full max-w-xl max-h-[98vh] overflow-y-auto pt-12 pb-6 px-2">
        <div className="bg-white text-primary rounded-[2.5rem] p-5 sm:p-10 shadow-2xl relative border-b-[10px] border-secondary animate-in zoom-in duration-300">
          {!isFinished ? (
            <div className="space-y-6">
              {/* Entête du Quiz */}
              <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                <span className="flex items-center gap-1 text-secondary">
                  <Star className="w-3 h-3 fill-secondary" /> {level}
                </span>
                <span className="bg-slate-100 px-3 py-1 rounded-full text-primary">
                  Question {step + 1}/5
                </span>
              </div>
              
              {/* Question */}
              <h3 className="text-xl md:text-2xl font-black leading-tight min-h-[80px] text-primary">
                {currentQuestions[step]?.q}
              </h3>

              {/* Options */}
              <div className="grid gap-3">
                {currentQuestions[step]?.o.map((opt, i) => (
                  <button 
                    key={i} 
                    disabled={selected !== null} 
                    onClick={() => handleAnswer(i)}
                    className={`w-full p-4 sm:p-5 rounded-2xl text-left text-sm font-bold border-2 transition-all flex justify-between items-center ${
                      selected === i 
                        ? (i === currentQuestions[step].c ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-red-500 bg-red-50 text-red-700") 
                        : "border-slate-100 active:bg-slate-50 md:hover:border-secondary md:hover:translate-x-1"
                    }`}
                  >
                    <span className="pr-2">{opt}</span>
                    {selected === i && (
                      i === currentQuestions[step].c 
                        ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> 
                        : <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {/* Explication (Feedback) */}
              {selected !== null && (
                <div className="p-4 bg-secondary/10 rounded-2xl border-l-4 border-secondary animate-in slide-in-from-left-2">
                  <p className="text-xs text-primary/80 font-bold italic leading-relaxed">
                    💡 {currentQuestions[step].e}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Écran de Fin */
            <div className="text-center space-y-8 py-4 animate-in zoom-in">
              <div className="relative inline-block">
                <Trophy className="w-20 h-20 text-secondary mx-auto animate-bounce" />
                <div className="absolute inset-0 bg-secondary blur-3xl opacity-20 -z-10"></div>
              </div>
              
              <div>
                <h3 className="text-2xl font-black text-primary uppercase leading-none">
                  {score === 5 ? "GÉNIE FINANCIER !" : score >= 3 ? "BIEN JOUÉ !" : "CONTINUE !"}
                </h3>
                <p className="text-6xl font-black text-secondary my-4">+{score * 10} XP</p>
                <p className="text-slate-500 font-bold px-4 leading-relaxed text-sm">
                   {score === 5 
                     ? "Tu maîtrises ton sujet ! Ton avenir financier est radieux." 
                     : "C'est un excellent début. Continue de te former avec nous."}
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button 
                  onClick={shareScore} 
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl h-16 font-black text-lg shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
                >
                  <MessageCircle className="w-6 h-6 fill-current" /> DÉFIE TES AMIS
                </Button>
                
                <Button 
                  onClick={() => loadNewSession(level)} 
                  variant="ghost" 
                  className="rounded-2xl h-12 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-primary"
                >
                  <RefreshCcw className="w-4 h-4 mr-2" /> Rejouer pour plus d'XP
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
