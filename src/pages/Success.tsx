import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Heart, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Petit effet de célébration à l'arrivée sur la page
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#004d40", "#ffc107"] // Couleurs de ta fondation (vert/jaune)
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#004d40", "#ffc107"]
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "The Future Foundation BDI",
        text: "Je viens de soutenir la jeunesse burundaise ! Rejoignez-moi.",
        url: window.location.origin,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[32px] shadow-xl p-8 text-center space-y-6 border border-slate-100 animate-scale-in">
        
        {/* Icône de succès animée */}
        <div className="relative mx-auto w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-emerald-600 animate-bounce" />
          <Heart className="absolute -top-1 -right-1 w-8 h-8 text-secondary fill-secondary animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-primary italic">Merci infiniment !</h1>
          <p className="text-muted-foreground font-medium">
            Votre don a été traité avec succès. Vous contribuez directement à bâtir l'avenir de la jeunesse burundaise.
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 text-sm text-slate-600 italic border border-dashed border-slate-200">
          "Chaque petit geste est une pierre ajoutée à l'édifice du Burundi de demain."
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button 
            onClick={handleShare}
            variant="outline" 
            className="w-full h-12 rounded-xl flex gap-2 font-bold border-2"
          >
            <Share2 className="w-4 h-4" /> Partager mon action
          </Button>
          
          <Button 
            onClick={() => navigate("/")}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold flex gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </Button>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
            Un reçu de confirmation sera envoyé par notre partenaire
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;
