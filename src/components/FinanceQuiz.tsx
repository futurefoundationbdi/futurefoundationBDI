import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { CheckCircle2, XCircle, Trophy, RefreshCcw, Brain, Star, Share2, Zap } from "lucide-react";
import { QUIZ_DATABASE, Question } from "../data/quizQuestions";

const FinanceQuiz = () => {
  const [level, setLevel] = useState<"debutant" | "intermediaire">("debutant");
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  
  // --- NOUVEAU : État pour le Score Global (XP) ---
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
        // --- NOUVEAU : Sauvegarder l'XP à la fin du quiz ---
        const newScore = score + (idx === currentQuestions[step].c ? 1 : 0);
        const newTotalXP = totalXP + (newScore * 10); // 10 points par bonne réponse
        setTotalXP(newTotalXP);
        localStorage.setItem("future_foundation_xp", newTotalXP.toString());
        setIsFinished(true);
      }
    }, 1500);
  };

  const shareScore = () => {
    const text = `🔥 J'ai ${totalXP} points d'intelligence financière ! Peux-tu me battre ?\n\nFais le test ici : ${window.location.href}\n\n#LArgentRevele #Burundi`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const getResultMessage = () => {
    if (score === 5) return { title: "GÉNIE FINANCIER !", desc: "Ton intelligence financière est impressionnante." };
    if (score >= 3) return { title: "BIEN JOUÉ !", desc: "Tu es sur la bonne voie pour ta liberté financière." };
    return { title: "CONTINUE !", desc: "Chaque erreur est une leçon. Rejoue pour apprendre !" };
  };

  return (
    <section id="finance-quiz" className="py-20 bg-primary text-white scroll-mt-20">
      <div className="container mx-auto px-4">
        
        {/* EN-TÊTE AVEC COMPTEUR XP GLOBAL */}
        <div className="max-w-2xl mx-auto text-center mb-10">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="bg-secondary/20 border border-secondary/30 rounded-2xl px-6 py-3 flex items-center gap-3 animate-pulse">
              <Zap className="w-6 h-6 text-secondary fill-secondary" />
              <div className="text-left">
                <p className="text-[10px] font-black uppercase text-secondary/70 leading-none">Ton Score Global</p>
                <p className="text-2xl font-black text-secondary leading-none">{totalXP} <span className="text-xs uppercase">XP</span></p>
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-white/5 text-white/60 px-4 py-2 rounded-full text-[10px] font-black mb-4 uppercase tracking-widest border border-white/10">
            <Brain className="w-4 h-4" /> Challenge Education Financière
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4">Prêt pour le <span className="text-secondary italic">Test ?</span></h2>
          
          <div className="flex justify-center gap-2 mt-6">
            <button onClick={() => loadNewSession("debutant")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${level === "debutant" ? "bg-secondary text-primary shadow-lg scale-105" : "bg-white/10"}`}>FONDATIONS</button>
            <button onClick={() => loadNewSession("intermediaire")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${level === "intermediaire" ? "bg-secondary text-primary shadow-lg scale-105" : "bg-white/10"}`}>EXPERT</button>
          </div>
        </div>

        <div className="max-w-xl mx-auto bg-white text-primary rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative border-b-8 border-secondary">
          {!isFinished ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase">
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-secondary fill-secondary" /> {level}</span>
                <span className="bg-slate-100 px-2 py-1 rounded">Question {step + 1}/5</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold leading-tight min-h-[80px]">{currentQuestions[step]?.q}</h3>
              <div className="grid gap-3">
                {currentQuestions[step]?.o.map((opt, i) => (
                  <button key={i} disabled={selected !== null} onClick={() => handleAnswer(i)}
                    className={`w-full p-4 rounded-2xl text-left text-sm font-bold border-2 transition-all flex justify-between items-center ${selected === i ? (i === currentQuestions[step].c ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-red-500 bg-red-50 text-red-700") : "border-slate-100 hover:border-secondary hover:translate-x-1"}`}>
                    {opt}
                    {selected === i && (i === currentQuestions[step].c ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />)}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-8 py-4 animate-in zoom-in duration-300">
              <Trophy className="w-20 h-20 text-secondary mx-auto" />
              <div>
                <h3 className="text-2xl font-black text-primary uppercase">{getResultMessage().title}</h3>
                <p className="text-5xl font-black text-secondary my-2">+{score * 10} XP</p>
                <p className="text-slate-500 font-bold px-4">{getResultMessage().desc}</p>
              </div>
              <div className="flex flex-col gap-3">
                <Button onClick={shareScore} className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl h-14 font-black text-lg shadow-xl flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" /> DÉFIE TES AMIS
                </Button>
                <Button onClick={() => loadNewSession(level)} variant="outline" className="rounded-2xl h-12 border-2 text-slate-600 font-bold">
                  <RefreshCcw className="w-4 h-4 mr-2" /> REJOUER
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
