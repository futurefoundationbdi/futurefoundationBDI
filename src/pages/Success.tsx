import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Heart, ArrowLeft, Share2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#004d40", "#ffc107"]
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

  const handleWhatsAppReceipt = () => {
    const WHATSAPP_NUMBER = "25779186635";
    const message = encodeURIComponent(
      "Bonjour The Future Foundation ! Je viens d'effectuer un don via Stripe. Voici mon reçu de confirmation (capture d'écran jointe). Merci pour votre impact !"
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[32px] shadow-xl p-6 md:p-8 text-center space-y-6 border border-slate-100 animate-scale-in">
        
        {/* Icône de succès animée */}
        <div className="relative mx-auto w-20 h-20 md:w-24 md:h-24 bg-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-emerald-600 animate-bounce" />
          <Heart className="absolute -top-1 -right-1 w-6 h-6 md:w-8 md:h-8 text-secondary fill-secondary animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-black text-primary italic">Merci infiniment !</h1>
          <p className="text-sm md:text-base text-muted-foreground font-medium">
            Votre don a été traité avec succès. Vous contribuez directement à bâtir l'avenir de la jeunesse burundaise.
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 text-xs md:text-sm text-slate-600 italic border border-dashed border-slate-200">
          "Chaque petit geste est une pierre ajoutée à l'édifice du Burundi de demain."
        </div>

        {/* SECTION BOUTONS ACTIONS */}
        <div className="flex flex-col gap-3 pt-2">
          {/* BOUTON WHATSAPP - ACTION PRINCIPALE */}
          <Button 
            onClick={handleWhatsAppReceipt}
            className="w-full h-14 rounded-2xl bg-[#25D366] hover:bg-[#128C7E] text-white font-bold flex gap-3 shadow-lg shadow-green-100 transition-all active:scale-95"
          >
            <MessageCircle className="w-6 h-6" /> Envoyer mon reçu (WhatsApp)
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleShare}
              variant="outline" 
              className="h-12 rounded-xl flex gap-2 font-bold border-2 text-xs md:text-sm"
            >
              <Share2 className="w-4 h-4" /> Partager
            </Button>
            
            <Button 
              onClick={() => navigate("/")}
              variant="ghost"
              className="h-12 rounded-xl font-bold flex gap-2 text-slate-500 text-xs md:text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Accueil
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <p className="text-[9px] md:text-[10px] uppercase font-black text-slate-400 tracking-widest leading-tight">
            Une confirmation officielle a été envoyée par mail <br /> via notre partenaire <span className="text-primary/70">NDAGARA Kercie Ketina</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;
