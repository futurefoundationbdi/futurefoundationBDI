import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react"; // Ajout de Zap pour l'icône
import DonationModal from "./DonationModal"; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);

  const navLinks = [
    { label: "Accueil", href: "#" },
    { label: "Mission", href: "#mission" },
    { label: "Livre", href: "#livre" },
    { label: "Quiz XP", href: "#quiz-cta", highlight: true }, // Ajout du Quiz
    { label: "Programmes", href: "#programmes" },
    { label: "Équipe", href: "#equipe" },
    { label: "Impact", href: "#impact" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo et Nom */}
            <a href="#" className="flex items-center gap-2 md:gap-3 max-w-[80%]">
              <img 
                src="/futurelogo.jpg" 
                alt="Logo" 
                className="h-9 w-9 md:h-12 md:w-12 rounded-full object-cover border border-border shadow-sm shrink-0" 
              />
              <span className="font-bold text-xs sm:text-sm md:text-xl text-foreground truncate uppercase tracking-tighter">
                The Future Foundation BDI
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors flex items-center gap-1 ${
                    link.highlight 
                    ? "text-secondary hover:text-secondary/80 bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20" 
                    : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {link.highlight && <Zap className="w-3 h-3 fill-secondary" />}
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA Button Desktop */}
            <div className="hidden md:block">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={() => setIsDonationOpen(true)}
              >
                Faire un Don
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 -mr-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="lg:hidden py-4 border-t border-border animate-fade-in overflow-y-auto max-h-[80vh]">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className={`text-base font-bold py-3 px-3 rounded-xl transition-colors flex items-center justify-between ${
                      link.highlight 
                      ? "bg-secondary/10 text-secondary border border-secondary/20" 
                      : "text-muted-foreground hover:bg-slate-50"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                    {link.highlight && <Zap className="w-4 h-4 fill-secondary" />}
                  </a>
                ))}
                <div className="pt-2">
                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="w-full h-14 text-base font-black shadow-lg"
                    onClick={() => {
                      setIsOpen(false);
                      setIsDonationOpen(true);
                    }}
                  >
                    Faire un Don
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <DonationModal 
        isOpen={isDonationOpen} 
        onClose={() => setIsDonationOpen(false)} 
      />
    </>
  );
};

export default Navbar;
