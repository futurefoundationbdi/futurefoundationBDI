import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MissionSection from "@/components/MissionSection";
import ProgramsSection from "@/components/ProgramsSection";
import ImpactSection from "@/components/ImpactSection";
import TeamSection from "@/components/TeamSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <MissionSection />

        {/* --- SECTION TÉMOIGNAGES & LECTURE --- */}
        <section id="livre" className="py-16 md:py-24 bg-card/30 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
              
              {/* Côté Image avec Effet Flip-Book - Ajusté pour mobile */}
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
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground text-[10px] md:text-xs font-bold py-2 px-4 rounded-full shadow-lg whitespace-nowrap animate-bounce">
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
                  <p className="font-bold text-primary text-sm md:text-base">
                    Envoyez-nous votre avis en un clic sur WhatsApp !
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
                  <Button 
                    onClick={() => {
                      const WHATSAPP_NUMBER = "25779186635";
                      const message = encodeURIComponent("Bonjour The Future Foundation, je souhaite laisser un témoignage après avoir lu votre livre 'L'Argent Révélé' :\n\n[Mon témoignage] :");
                      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
                    }}
                    className="bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-6 h-auto text-base md:text-lg font-bold shadow-xl transition-all active:scale-95 border-none"
                  >
                    <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Témoigner sur WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* FENÊTRE MODALE PRÉFACE - Optimisée pour le scroll mobile */}
          <div 
            id="modal-preface" 
            className="fixed inset-0 z-[100] hidden bg-primary/40 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
            onClick={(e) => { if(e.target === e.currentTarget) e.currentTarget.classList.add('hidden') }}
          >
            <div className="bg-[#fdfbf7] w-full max-w-2xl max-h-[90vh] rounded-lg shadow-2xl overflow-hidden flex flex-col border-l-[8px] md:border-l-[15px] border-primary animate-fade-up">
              
              <div className="p-4 md:p-6 border-b flex justify-between items-center bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-[10px]">FF</div>
                  <h3 className="font-bold text-primary uppercase tracking-tighter text-sm md:text-base">Préface Officielle</h3>
                </div>
                <button 
                  onClick={() => document.getElementById('modal-preface')?.classList.add('hidden')}
                  className="text-gray-400 hover:text-primary text-xl font-bold p-2"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6 md:p-12 overflow-y-auto leading-relaxed md:leading-[1.8] text-gray-800 space-y-4 md:space-y-6 text-left md:text-justify font-serif text-base md:text-lg custom-scrollbar">
                <p>Depuis sa forme primitive à celle plus élaborée et moderne, l’argent fait rêver, interroge, inquiète parfois… et pourtant, peu de jeunes osent réellement le sonder. C’est ce qui rend ce livre si particulier:il est né de la curiosité, de l’audace et 
de la volonté d’un jeune passionné qui a décidé de 
comprendre – puis d’expliquer – ce que beaucoup 
préfèrent ignorer.</p>
                <p>On y sent la spontanéité 
de quelqu’un qui cherche à apprendre autant qu’à 
transmettre, et c’est précisément ce qui rend cet 
ouvrage inspirant. Il ne prétend pas offrir toutes 
les réponses ni rivaliser avec les grands manuels 
Préface 
d’économie ; il ouvre plutôt une porte, celle de la 
découverte et de la réflexion personnelle. 
Bien sûr, certaines explications pourraient gagner 
à être enrichies par des recherches plus 
approfondies, par des lectures, des expériences et 
des conseils d’experts. Mais faut-il déjà tout 
maîtriser pour commencer à écrire, à partager et à 
susciter des questions ? Certainement pas.</p>
                <p>Dans ces pages, l’auteur partage sa vision de l’argent avec des mots simples, un regard frais et une énergie authentique.</p>
                <p>Ce livre est la preuve qu’on peut avancer, dès lors qu’on a la passion et la volonté d’apprendre.</p>
                <p>Je souhaite que cette œuvre encourage d’autres jeunes à s’intéresser à l’argent, non comme une fin en soi, mais comme un outil pour mieux construire sa vie.</p>
                
                <div className="pt-6 mt-6 border-t border-gray-200 text-right">
                  <p className="font-bold text-primary text-lg md:text-xl">M. Edouard Normand BIGENDAKO</p>
                  <p className="text-[10px] md:text-sm font-semibold text-gray-600 uppercase tracking-widest">Gouverneur de la BRB</p>
                </div>

                <div className="flex justify-center pt-6">
                  <Button 
                    onClick={() => document.getElementById('modal-preface')?.classList.add('hidden')}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Fermer la lecture
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-primary text-white text-center text-[8px] md:text-[10px] tracking-[0.2em] uppercase shrink-0">
                The Future Foundation BDI
              </div>
            </div>
          </div>
        </section>

        <ProgramsSection />
        <ImpactSection />
        <TeamSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
