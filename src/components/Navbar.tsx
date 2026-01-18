import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap, Award } from "lucide-react"; 
import DonationModal from "./DonationModal"; 

// Même logique de grades que dans le Dashboard
const getRankInfo = (points: number) => {
  if (points < 100) return { name: "Novice", icon: "🌱" };
  if (points < 300) return { name: "Apprenti", icon: "💰" };
  if (points < 600) return { name: "Stratège", icon: "🏛️" };
  return { name: "Maître", icon: "👑" };
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [xp, setXp] = useState(0);

  // Synchronisation de l'XP
  useEffect(() => {
    const updateXP = () => {
      const savedXP = localStorage.getItem("future_foundation_xp");
      if (savedXP) setXp(parseInt(savedXP));
    };

    updateXP();
    window.addEventListener("storage", updateXP);
    return () => window.removeEventListener("storage", updateXP);
  }, []);

  const rank = getRankInfo(xp);

  const navLinks = [
    { label: "Accueil", href: "#" },
    { label: "Mission", href: "#mission" },
    { label: "Livre", href: "#livre" },
    { label: "Quiz XP", href: "#quiz-cta", highlight: true },
    { label: "Impact", href: "#impact" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo et Nom */}
            <a href="#" className="flex items-center gap-2 md:gap-3 max-w-[60%] md:max-w-[40%]">
              <img 
                src="/futurelogo.jpg" 
                alt="Logo" 
                className="h-8 w-8 md:h-11 md:w-11 rounded-full object-cover border border-border shrink-0" 
              />
              <span className="font-black text-[10px] sm:text-xs md:text-sm text-foreground uppercase tracking-tighter leading-tight">
                The Future Foundation BDI
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`text-[13px] font-bold transition-colors flex items-center gap-1 ${
                    link.highlight 
                    ? "text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20" 
                    : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {link.highlight && <Zap className="w-3 h-3 fill-secondary" />}
                  {link.label}
                </a>
              ))}
            </div>

            {/* XP & Grade Badge (Visible sur Desktop et Tablette) */}
            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2 bg-slate-100 px-2 py-1 md:px-3 md:py-1.5 rounded-2xl border border-slate-200">
                <span className="text-lg md:text-xl">{rank.icon}</span>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-400 uppercase leading-none">Grade</span>
                  <span className="text-[10px] md:text-xs font-black text-primary leading-none mt-1">{rank.name}</span>
                </div>
              </div>

              {/* CTA Button Desktop */}
              <div className="hidden md:block">
                <Button 
                  variant="hero" 
                  size="sm" 
                  className="rounded-xl font-black text-xs px-4"
                  onClick={() => setIsDonationOpen(true)}
                >
                  DON
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 -mr-2"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="lg:hidden py-4 border-t border-border animate-in slide-in-from-top duration-300">
              <div className="flex flex-col gap-2">
                {/* Petit rappel de score dans le menu mobile */}
                <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-2xl mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{rank.icon}</span>
                    <span className="font-black text-primary uppercase text-sm">{rank.name}</span>
                  </div>
                  <span className="font-black text-secondary text-lg">{xp} XP</span>
                </div>

                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className={`text-sm font-black py-4 px-4 rounded-xl transition-colors flex items-center justify-between ${
                      link.highlight 
                      ? "bg-primary text-white shadow-lg" 
                      : "text-muted-foreground hover:bg-slate-50"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                    {link.highlight ? <Zap className="w-4 h-4 fill-secondary text-secondary" /> : <Award className="w-4 h-4 opacity-20" />}
                  </a>
                ))}
                
                <Button 
                  variant="hero" 
                  className="w-full h-14 mt-2 font-black rounded-2xl"
                  onClick={() => {
                    setIsOpen(false);
                    setIsDonationOpen(true);
                  }}
                >
                  FAIRE UN DON
                </Button>
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
