import { Button } from "@/components/ui/button";
import { Heart, Users, Mail } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Main CTA */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-secondary/10 rounded-full text-secondary font-semibold text-sm mb-4">
              Rejoignez le mouvement
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Ensemble, construisons{" "}
              <span className="text-secondary">l'avenir du Burundi</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Votre soutien peut transformer la vie d'un jeune burundais. 
              Rejoignez notre mission aujourd'hui.
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group p-8 bg-card rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:scale-110 transition-all duration-300">
                <Heart className="w-8 h-8 text-secondary group-hover:text-secondary-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Faire un Don
              </h3>
              <p className="text-muted-foreground mb-6">
                Chaque contribution compte. Aidez-nous à atteindre plus de jeunes.
              </p>
              <Button variant="hero" className="w-full">
                Donner maintenant
              </Button>
            </div>

            <div className="group p-8 bg-card rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <Users className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Devenir Bénévole
              </h3>
              <p className="text-muted-foreground mb-6">
                Partagez vos compétences et votre temps pour inspirer la prochaine génération.
              </p>
              <Button variant="forest" className="w-full">
                S'inscrire
              </Button>
            </div>

            <div className="group p-8 bg-card rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                <Mail className="w-8 h-8 text-accent group-hover:text-accent-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Nous Contacter
              </h3>
              <p className="text-muted-foreground mb-6">
                Questions ou partenariat? Nous sommes là pour vous.
              </p>
              <Button variant="outline" className="w-full">
                Envoyer un message
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
