import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { CheckCircle2, XCircle, Trophy, RefreshCcw, Brain, Star } from "lucide-react";
import { QUIZ_DATABASE, Question } from "../data/quizQuestions";

const FinanceQuiz = () => {
  const [level, setLevel] = useState<"debutant" | "intermediaire">("debutant");
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

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

  useEffect(() => { loadNewSession("debutant"); }, []);

  const handleAnswer = (idx: number) => {
    setSelected(idx);
    if (idx === currentQuestions[step].c) setScore(score + 1);
    
    setTimeout(() => {
      if (step + 1 < currentQuestions.length) {
        setStep(step + 1);
        setSelected(null);
      } else {
        setIsFinished(true);
      }
    }, 1800);
  };

  return (
    <section id="finance-quiz" className="py-20 bg-primary text-white scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-[10px] font-black mb-4 uppercase tracking-widest">
            <Brain className="w-4 h-4" /> Challenge Intelligence Financière
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4">Prêt pour le <span className="text-secondary italic">Test ?</span></h2>
          
          <div className="flex justify-center gap-2 mt-6">
            <button onClick={() => loadNewSession("debutant")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${level === "debutant" ? "bg-secondary text-primary shadow-lg scale-105" : "bg-white/10 hover:bg-white/20"}`}>Niveau 1 : Fondations</button>
            <button onClick={() => loadNewSession("intermediaire")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${level === "intermediaire" ? "bg-secondary text-primary shadow-lg scale-105" : "bg-white/10 hover:bg-white/20"}`}>Niveau 2 : Expert</button>
          </div>
        </div>

        <div className="max-w-xl mx-auto bg-white text-primary rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative border-b-8 border-secondary">
          {!isFinished ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase">
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-secondary fill-secondary" /> {level}</span>
                <span className="bg-slate-100 px-2 py-1 rounded">Question {step + 1}/5</span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold leading-tight min-h-[80px]">
                {currentQuestions[step]?.q}
              </h3>

              <div className="grid gap-3">
                {currentQuestions[step]?.o.map((opt, i) => (
                  <button
                    key={i}
                    disabled={selected !== null}
                    onClick={() => handleAnswer(i)}
                    className={`w-full p-4 rounded-2xl text-left text-sm md:text-base font-bold border-2 transition-all flex justify-between items-center ${
                      selected === i 
                        ? (i === currentQuestions[step].c ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-red-500 bg-red-50 text-red-700")
                        : "border-slate-100 hover:border-secondary hover:translate-x-1"
                    }`}
                  >
                    {opt}
                    {selected === i && (i === currentQuestions[step].c ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />)}
                  </button>
                ))}
              </div>

              {selected !== null && (
                <div className="p-4 bg-secondary/10 rounded-2xl border-l-4 border-secondary animate-in fade-in slide-in-from-bottom-2">
                  <p className="text-xs md:text-sm text-primary/80 italic font-medium">
                    💡 {currentQuestions[step].e}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-8 py-4">
              <Trophy className="w-20 h-20 text-secondary mx-auto animate-bounce" />
              <div>
                <h3 className="text-4xl font-black italic">SCORE : {score}/5</h3>
                <p className="text-slate-500 font-bold mt-2">
                  {score >= 4 ? "Génie ! Ton avenir financier est tracé." : "Continue d'apprendre pour maîtriser ton destin."}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button onClick={() => loadNewSession(level)} className="bg-primary text-white rounded-2xl h-14 font-black text-lg shadow-xl">
                   <RefreshCcw className="w-5 h-5 mr-2" /> REJOUER (Questions différentes)
                </Button>
                <Button onClick={() => window.location.href='#livre'} variant="outline" className="rounded-2xl h-12 border-2">
                   Lire la préface du livre
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FinanceQuiz;
