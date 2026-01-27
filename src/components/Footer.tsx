import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Zap, Library } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          
          {/* Brand & Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img 
                src="/futurelogo.jpg" 
                alt="The Future Foundation BDI" 
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-secondary shrink-0" 
              />
              <span className="font-bold text-lg md:text-xl tracking-tight leading-tight uppercase">
                The Future Foundation BDI
              </span>
            </div>
            <p className="text-primary-foreground/80 mb-6 max-w-md text-sm md:text-base leading-relaxed">
              Organisation caritative dédiée à l'autonomisation des jeunes Burundais. 
              La réussite de tous est notre priorité à travers l'éducation et l'intelligence financière.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/thefuturefoundationbdi/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all active:scale-90"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="w-5 h-5" />
              </a>
              <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center opacity-40 cursor-not-allowed">
                <Facebook className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center opacity-40 cursor-not-allowed">
                <Twitter className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Quick Links & Library */}
          <div>
            <h4 className="font-bold text-lg mb-5 border-b border-secondary/20 pb-2 w-max italic">Navigation</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors inline-block py-1">Accueil</a></li>
              <li><a href="#mission" className="text-primary-foreground/80 hover:text-secondary transition-colors inline-block py-1">Notre Mission</a></li>
              
              {/* LIEN LIBRARY AJOUTÉ */}
              <li>
                <a href="#bibliotheque" className="text-primary-foreground/80 hover:text-secondary transition-colors inline-flex items-center gap-2 py-1">
                   <Library className="w-4 h-4" /> Library
                </a>
              </li>

              <li>
                <a href="#quiz-cta" className="text-secondary font-bold hover:brightness-125 transition-all inline-flex items-center gap-2 py-1">
                  <Zap className="w-4 h-4 fill-secondary" /> Test QI Financier
                </a>
              </li>
              
              <li><a href="#livre" className="text-primary-foreground/80 hover:text-secondary transition-colors inline-block py-1">Le Livre</a></li>
              <li><a href="#equipe" className="text-primary-foreground/80 hover:text-secondary transition-colors inline-block py-1">Notre Équipe</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-bold text-lg mb-5 border-b border-secondary/20 pb-2 w-max italic">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                <span className="text-primary-foreground/80 text-sm md:text-base">Bujumbura, Burundi</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="w-5 h-5 text-secondary shrink-0" />
                <a href="tel:+25779186635" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm md:text-base">
                  +257 79 186 635
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <Mail className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                <a href="mailto:thefuturefoundationbdi@gmail.com" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm md:text-base break-all">
                  thefuturefoundationbdi@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* --- SECTION DISCLAIMER LÉGAL --- */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <div className="bg-primary-foreground/5 p-6 rounded-2xl border border-primary-foreground/10 mb-8">
            <p className="text-[11px] md:text-xs text-primary-foreground/60 leading-relaxed text-center italic">
              Dans le cadre de sa mission d'intérêt général, <span className="text-secondary font-bold">The Future Foundation BDI</span> propose des ressources éducatives et des synthèses d'œuvres fondatrices du développement personnel. Nous nous efforçons de respecter les droits de propriété intellectuelle. Si vous êtes ayant-droit d'une œuvre présente sur ce site et que vous souhaitez en restreindre l'accès, merci de nous contacter à <span className="text-secondary font-bold italic">thefuturefoundationbdi@gmail.com</span>.
            </p>
          </div>

          {/* Bottom Bar */}
          <div className="text-center">
            <p className="text-primary-foreground/60 text-[10px] md:text-sm tracking-wide">
              © {new Date().getFullYear()} THE FUTURE FOUNDATION BDI. <br className="md:hidden" /> Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
