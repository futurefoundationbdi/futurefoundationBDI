import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { CheckCircle2, XCircle, Trophy, RefreshCcw, Brain, Star, Share2, Zap, MessageCircle } from "lucide-react";
import { QUIZ_DATABASE, Question } from "../data/quizQuestions";

const FinanceQuiz = () => {
  const [level, setLevel] = useState<"debutant" | "intermediaire">("debutant");
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [totalXP, setTotalXP] = useState<number>(0);

  // Charger l'XP sauvegardé au démarrage
  useEffect(() => {
    const savedXP = localStorage.getItem("future_foundation_xp");
    if (savedXP) setTotalXP(parseInt(savedXP));
    loadNewSession("debutant");
  }, []);

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

  const handleAnswer = (idx: number) => {
    setSelected(idx);
    if (idx === currentQuestions[step].c) {
      setScore((prev) => prev + 1);
    }
    
    setTimeout(() => {
      if (step + 1 < currentQuestions.length) {
        setStep((prev) => prev + 1);
        setSelected(null);
      } else {
        const finalScoreInStep = score + (idx === currentQuestions[step].c ? 1 : 0);
        const newTotalXP = totalXP + (finalScoreInStep * 10);
        setTotalXP(newTotalXP);
        localStorage.setItem("future_foundation_xp", newTotalXP.toString());
        setIsFinished(true);
      }
    }, 1500);
  };

  const shareScore = () => {
    const text = `🔥 J'ai ${totalXP} points d'intelligence financière sur le site de The Future Foundation ! Peux-tu me battre ?\n\nFais le test ici : ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const getResultMessage = () => {
    if (score === 5) return { title: "GÉNIE FINANCIER !", desc: "Ton intelligence financière est impressionnante." };
    if (score >= 3) return { title: "BIEN JOUÉ !", desc: "Tu es sur la bonne voie pour ta liberté financière." };
    return { title: "CONTINUE !", desc: "Chaque erreur est une leçon. Rejoue pour apprendre !" };
  };

  return (
    <>
      {/* --- BOUTON FLOTTANT D'INVITATION --- */}
      <a 
        href="#finance-quiz"
        className="fixed bottom-6 right-6 z-50 bg-secondary text-primary p-4 rounded-full shadow-[0_10px_30px_rgba(244,196,48,0.5)] hover:scale-110 transition-transform flex items-center gap-2 group animate-bounce"
      >
        <div className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-black text-xs uppercase whitespace-nowrap">
          Défie-moi au Quiz !
        </div>
        <Brain className="w-6 h-6" />
      </a>

      <section id="finance-quiz" className="py-24 bg-primary text-white scroll-mt-20">
        <div className="container mx-auto px-4">
          
          {/* EN-TÊTE AVEC XP GLOBAL */}
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="bg-secondary/10 border border-secondary/20 rounded-2xl px-6 py-3 flex items-center gap-3 shadow-inner">
                <Zap className="w-6 h-6 text-secondary fill-secondary" />
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase text-secondary/70">Ton Rang</p>
                  <p className="text-2xl font-black text-secondary">{totalXP} XP</p>
                </div>
              </div>
            </div>

            <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter">
              Le Grand <span className="text-secondary italic">Quiz</span>
            </h2>
            
            <div className="flex justify-center gap-3">
              <button onClick={() => loadNewSession("debutant")} className={`px-5 py-2 rounded-xl text-xs font-black transition-all border-2 ${level === "debutant" ? "bg-secondary border-secondary text-primary shadow-xl scale-105" : "bg-transparent border-white/10 text-white/40"}`}>NIVEAU 1</button>
              <button onClick={() => loadNewSession("intermediaire")} className={`px-5 py-2 rounded-xl text-xs font-black transition-all border-2 ${level === "intermediaire" ? "bg-secondary border-secondary text-primary shadow-xl scale-105" : "bg-transparent border-white/10 text-white/40"}`}>NIVEAU 2</button>
            </div>
          </div>

          <div className="max-w-xl mx-auto bg-white text-primary rounded-[2.5rem] p-6 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative border-b-[12px] border-secondary">
            {!isFinished ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase">
                  <span className="flex items-center gap-1 text-secondary"><Star className="w-3 h-3 fill-secondary" /> {level}</span>
                  <span className="bg-slate-100 px-3 py-1 rounded-full">Question {step + 1}/5</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black leading-tight min-h-[90px]">{currentQuestions[step]?.q}</h3>
                <div className="grid gap-3">
                  {currentQuestions[step]?.o.map((opt, i) => (
                    <button key={i} disabled={selected !== null} onClick={() => handleAnswer(i)}
                      className={`w-full p-5 rounded-2xl text-left text-sm font-bold border-2 transition-all flex justify-between items-center ${selected === i ? (i === currentQuestions[step].c ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-inner" : "border-red-500 bg-red-50 text-red-700 shadow-inner") : "border-slate-100 hover:border-secondary hover:translate-x-1"}`}>
                      {opt}
                      {selected === i && (i === currentQuestions[step].c ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />)}
                    </button>
                  ))}
                </div>
                {selected !== null && (
                  <div className="p-4 bg-secondary/5 rounded-2xl border-l-4 border-secondary animate-in slide-in-from-left-2">
                    <p className="text-xs text-primary/70 font-bold italic leading-relaxed">💡 {currentQuestions[step].e}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-8 py-4 animate-in zoom-in duration-500">
                <div className="relative inline-block">
                   <Trophy className="w-24 h-24 text-secondary mx-auto animate-bounce" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-primary uppercase leading-none">{getResultMessage().title}</h3>
                  <p className="text-6xl font-black text-secondary mt-4">+{score * 10} XP</p>
                  <p className="text-slate-500 font-bold px-4 mt-4 leading-relaxed">{getResultMessage().desc}</p>
                </div>
                <div className="flex flex-col gap-3 pt-4">
                  <Button onClick={shareScore} className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl h-16 font-black text-lg shadow-xl flex items-center justify-center gap-3 scale-105 hover:scale-110 transition-transform">
                    <MessageCircle className="w-6 h-6 fill-current" /> DÉFIE TES AMIS
                  </Button>
                  <Button onClick={() => loadNewSession(level)} variant="ghost" className="rounded-2xl h-12 text-slate-400 font-black uppercase text-xs tracking-widest hover:text-primary">
                    <RefreshCcw className="w-4 h-4 mr-2" /> Rejouer (Questions Aléatoires)
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default FinanceQuiz;
