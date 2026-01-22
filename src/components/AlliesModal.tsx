import { X, Trophy, Target, Star, Briefcase, Users, Zap } from "lucide-react";
import { Button } from "./ui/button";

interface AlliesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AlliesModal = ({ isOpen, onClose }: AlliesModalProps) => {
  if (!isOpen) return null;

  const handleWhatsAppJoin = () => {
    const WHATSAPP_NUMBER = "25779186635";
    const message = encodeURIComponent(
      "Bonjour The Future Foundation BDI, je souhaite postuler pour rejoindre le Département des Alliés. J'aimerais contribuer à l'impact de la fondation et bénéficier du réseau d'élite."
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  const advantages = [
    { icon: <Zap className="w-5 h-5" />, title: "Masterclasses", desc: "Ateliers exclusifs animés par des experts." },
    { icon: <Star className="w-5 h-5" />, title: "Contenu Élite", desc: "Un livre numérique mensuel choisi pour votre croissance." },
    { icon: <Briefcase className="w-5 h-5" />, title: "Opportunités", desc: "Accès privilégié à des postes via nos partenaires." },
    { icon: <Users className="w-5 h-5" />, title: "Networking", desc: "Échanges au sein d'un cercle restreint de leaders." }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-primary/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header avec Image/Couleur */}
        <div className="bg-primary p-8 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white">
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="text-secondary w-8 h-8" />
            <span className="uppercase font-black tracking-widest text-xs text-secondary">Communauté Exclusive</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black italic">Le Département des Alliés</h3>
          <p className="text-white/80 text-sm mt-2 font-medium">Co-créons l'Impact : Un partenariat gagnant-gagnant.</p>
        </div>

        <div className="p-6 md:p-10 overflow-y-auto space-y-8">
          {/* Section Concept */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-black text-primary uppercase text-xs flex items-center gap-2">
                <Target className="w-4 h-4 text-secondary" /> Votre Mission 
              </h4>
              <ul className="text-sm space-y-2 text-muted-foreground font-medium">
                <li>• Soutien stratégique & mentorat </li>
                <li>• Animation d'ateliers clés </li>
                <li>• Amplification de nos initiatives </li>
              </ul>
            </div>
            <div className="bg-secondary/10 p-4 rounded-2xl border border-secondary/20">
              <p className="text-xs font-bold text-primary italic leading-relaxed">
                "Ce n'est pas qu'un soutien, c'est une synergie où votre impact rime avec votre croissance personnelle."
              </p>
            </div>
          </div>

          {/* Section Avantages */}
          <div className="space-y-4">
            <h4 className="font-black text-primary uppercase text-xs">Vos Avantages Exclusifs </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {advantages.map((adv, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="text-secondary">{adv.icon}</div>
                  <div>
                    <h5 className="font-bold text-sm text-primary">{adv.title}</h5>
                    <p className="text-xs text-muted-foreground mt-1">{adv.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Modal */}
          <div className="pt-6 border-t border-slate-100 text-center space-y-4">
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">
              L'entrée se fait par cooptation ou sélection rigoureuse 
            </p>
            <Button onClick={handleWhatsAppJoin} className="w-full bg-secondary hover:bg-secondary/90 text-primary h-14 rounded-2xl font-black text-lg shadow-lg">
              POSTULER VIA WHATSAPP
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlliesModal;
