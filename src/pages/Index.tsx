import { useState } from "react"; 
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WisdomDashboard from "@components/WisdomDashboard";
import MissionSection from "@/components/MissionSection";
import PartnersSection from "@/components/PartnersSection";
import ProgramsSection from "@/components/ProgramsSection";
import ImpactSection from "@/components/ImpactSection";
import TeamSection from "@/components/TeamSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import FinanceQuiz from "@/components/FinanceQuiz"; 
import QuizFloatingButton from "@/components/QuizFloatingButton"; 
import MascotGuide from "@/components/MascotGuide"; // NOUVEL IMPORT
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      
      <main>
        <HeroSection />
        
        {/* Section Partenaires juste après le Hero pour la crédibilité */}
        <PartnersSection />

        <MissionSection />

        {/* --- SECTION TÉMOIGNAGES & LECTURE --- */}
        <section id="livre" className="py-16 md:py-24 bg-card/30 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
              
              {/* Côté Image avec Effet Flip-Book */}
              <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
                <div 
                  className="relative cursor-pointer group"
                  style={{ perspective: '1200px' }}
                  onClick={() => document.getElementById('modal-preface')?.classList.remove('hidden')}
                >
                  <div className="relative w-56 sm:w-72 md:w-80 transition-transform duration-700 ease-out transform-gpu group-hover:rotate-y-[-25deg] shadow-[15px_15px_40px_rgba(0,0,0,0.2)]">
                    <img 
                      src="/coverbook.jpg" 
                      alt="Livre L'Argent Révélé" 
                      className="rounded-r-lg w-full h-auto border-l-[6px] md:border-l-[10px] border-primary/30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-r-lg"></div>
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-secondary text-primary text-[10px] md:text-xs font-black py-2 px-4 rounded-full shadow-lg whitespace-nowrap animate-bounce">
                    Cliquez pour lire la préface
                  </div>
                </div>
              </div>

              {/* Côté Texte */}
              <div className="w-full md:w-1/2 space-y-6 md:space-y-8 text-center md:text-left">
                <div>
                  <span className="inline-block px-4 py-2 bg-secondary/20 rounded-full text-secondary font-bold text-[10px] md:text-xs mb-4 uppercase tracking-[0.2em]">
                    Partagez votre expérience
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black text-primary mb-4 leading-tight">
                    Déjà lu <span className="text-secondary italic">notre livre ?</span>
                  </h2>
                  <p className="text-lg md:text-xl text-primary font-medium border-l-4 border-secondary pl-4 italic mx-auto md:mx-0 max-w-sm md:max-w-none">
                    "Votre commentaire ou témoignage compte pour nous."
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    Avez-vous apprécié <strong>L'Argent Révélé</strong> ? Dites-nous comment cet ouvrage a changé votre vision des finances.
                  </p>
                  <Button 
                    onClick={() => {
                      const WHATSAPP_NUMBER = "25779186635";
                      const message = encodeURIComponent("Bonjour The Future Foundation, je souhaite laisser un témoignage après avoir lu votre livre 'L'Argent Révélé' :\n\n[Mon témoignage] :");
                      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
                    }}
                    className="bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-6 h-auto text-base md:text-lg font-bold shadow-xl transition-all active:scale-95 border-none"
                  >
                    Témoigner sur WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* FENÊTRE MODALE PRÉFACE */}
          <div 
            id="modal-preface" 
            className="fixed inset-0 z-[100] hidden bg-primary/40 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
            onClick={(e) => { if(e.target === e.currentTarget) e.currentTarget.classList.add('hidden') }}
          >
            <div className="bg-[#fdfbf7] w-full max-w-2xl max-h-[90vh] rounded-lg shadow-2xl overflow-hidden flex flex-col border-l-[8px] md:border-l-[15px] border-primary animate-fade-up">
              <div className="p-4 md:p-6 border-b flex justify-between items-center bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-[10px]">FF</div>
                  <h3 className="font-bold text-primary uppercase tracking-tighter text-sm md:text-base">Préface Officielle</h3>
                </div>
                <button onClick={() => document.getElementById('modal-preface')?.classList.add('hidden')} className="text-gray-400 hover:text-primary text-xl font-bold p-2">✕</button>
              </div>
              <div className="p-6 md:p-12 overflow-y-auto leading-relaxed md:leading-[1.8] text-gray-800 space-y-4 md:space-y-6 text-left md:text-justify font-serif text-base md:text-lg custom-scrollbar">
                <p>Depuis sa forme primitive à celle plus élaborée et moderne, l’argent fait rêver, interroge, inquiète parfois… et pourtant, peu de jeunes osent réellement le sonder.</p>
                <p>Ce livre est la preuve qu’on peut avancer, dès lors qu’on a la passion et la volonté d’apprendre.</p>
                <div className="pt-6 mt-6 border-t border-gray-200 text-right">
                  <p className="font-bold text-primary text-lg md:text-xl">M. Edouard Normand BIGENDAKO</p>
                  <p className="text-[10px] md:text-sm font-semibold text-gray-600 uppercase tracking-widest">Gouverneur de la BRB</p>
                </div>
                <div className="flex justify-center pt-6">
                  <Button onClick={() => document.getElementById('modal-preface')?.classList.add('hidden')} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">Fermer la lecture</Button>
                </div>
              </div>
              <div className="p-3 bg-primary text-white text-center text-[8px] md:text-[10px] tracking-[0.2em] uppercase shrink-0">The Future Foundation BDI</div>
            </div>
          </div>
        </section>

        {/* --- SECTION QUIZ STATIQUE --- */}
        <FinanceQuiz />

        <ProgramsSection />
        <ImpactSection />
        <TeamSection />
        <CTASection />
      </main>

      <Footer />

      {/* --- ÉLÉMENTS INTERACTIFS FLOTTANTS --- */}
      
      {/* 1. La Mascotte Guide (elle arrive de la gauche) */}
      <MascotGuide />

      {/* 2. Le Bouton de Quiz (Cerveau IQ) */}
      <QuizFloatingButton onClick={() => setIsQuizOpen(true)} />

      {/* 3. Le Modal du Quiz */}
      {isQuizOpen && (
        <FinanceQuiz isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
      )}

    </div>
  );
};

export default Index;
