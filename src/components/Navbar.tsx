import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import DonationModal from "./DonationModal"; // Importation du nouveau modal

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false); // État pour gérer le modal de don

  const navLinks = [
    { label: "Accueil", href: "#" },
    { label: "Mission", href: "#mission" },
    { label: "Livre", href: "#livre" },
    { label: "Programmes", href: "#programmes" },
    { label: "Équipe", href: "#equipe" },
    { label: "Impact", href: "#impact" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo et Nom Officiel */}
            <a href="#" className="flex items-center gap-3">
              <img 
                src="/futurelogo.jpg" 
                alt="The Future Foundation BDI Logo" 
                className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border border-border shadow-sm" 
              />
              <span className="font-bold text-sm md:text-xl text-foreground whitespace-nowrap">
                The Future Foundation BDI
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                >
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
              className="lg:hidden p-2"
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
            <div className="lg:hidden py-4 border-t border-border animate-fade-in">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-base font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="mt-2 w-full"
                  onClick={() => {
                    setIsOpen(false);
                    setIsDonationOpen(true);
                  }}
                >
                  Faire un Don
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Insertion du Modal de Don */}
      <DonationModal 
        isOpen={isDonationOpen} 
        onClose={() => setIsDonationOpen(false)} 
      />
    </>
  );
};

export default Navbar;
