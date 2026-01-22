import { Button } from "@/components/ui/button";
import { Heart, Users } from "lucide-react";

interface CTASectionProps {
  onOpenDonation: () => void;
  onOpenAllies: () => void; // Nouvelle prop
}

const CTASection = ({ onOpenDonation, onOpenAllies }: CTASectionProps) => {
  return (
    <section id="participer" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Ensemble, construisons <span className="text-secondary">l'avenir</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* CARD DON */}
            <div className="group p-8 bg-card rounded-2xl shadow-card hover:shadow-elevated transition-all border border-border/50 text-center">
              <Heart className="w-12 h-12 text-secondary mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-3">Faire un Don</h3>
              <p className="text-muted-foreground mb-6 text-sm">Soutenez directement nos actions sur le terrain.</p>
              <Button onClick={onOpenDonation} variant="hero" className="w-full h-12 font-black">DONNER</Button>
            </div>

            {/* CARD ALLIÉS */}
            <div className="group p-8 bg-card rounded-2xl shadow-card hover:shadow-elevated transition-all border border-border/50 text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-3">Devenir un Allié</h3>
              <p className="text-muted-foreground mb-6 text-sm">Rejoignez notre cercle d'experts et de leaders.</p>
              <Button onClick={onOpenAllies} variant="forest" className="w-full h-12 font-black">POSTULER</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
