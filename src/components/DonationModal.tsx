import { useState } from "react";
import { X, CreditCard, Smartphone, Globe, Home, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DonationModal = ({ isOpen, onClose }: DonationModalProps) => {
  const [currency, setCurrency] = useState<"USD" | "BIF">("USD");
  const [amount, setAmount] = useState<string>("");

  if (!isOpen) return null;

  const amountsUSD = ["5", "10", "20", "50"];
  const amountsBIF = ["2000", "5000", "10000", "50000"];

  const minAmount = currency === "USD" ? 5 : 2000;
  const isInvalid = amount !== "" && parseFloat(amount) < minAmount;

  const handleWhatsAppConfirm = () => {
    const WHATSAPP_NUMBER = "25779186635";
    const message = encodeURIComponent(
      `Bonjour The Future Foundation, je viens d'effectuer un don de ${amount} ${currency === "BIF" ? "Fbu" : "$"} pour soutenir la fondation. [Je joins ma capture d'écran ci-dessous]`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-primary/60 backdrop-blur-sm animate-fade-in">
      {/* Container avec Max-Height pour éviter de déborder de l'écran */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[95vh]">
        
        {/* Header - Fixe en haut */}
        <div className="p-5 md:p-6 border-b flex justify-between items-center bg-slate-50 shrink-0">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-primary">Faire un Don</h3>
            <p className="text-xs md:text-sm text-muted-foreground">Soutenez la jeunesse burundaise</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps de la fenêtre - SCROLLABLE si le contenu dépasse */}
        <div className="p-5 md:p-6 overflow-y-auto custom-scrollbar space-y-5">
          
          {/* Choix de la Localisation */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg shrink-0">
            <button 
              onClick={() => { setCurrency("USD"); setAmount(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-[13px] md:text-sm font-bold transition-all ${currency === "USD" ? "bg-white shadow text-primary" : "text-slate-500"}`}
            >
              <Globe className="w-4 h-4" /> International
            </button>
            <button 
              onClick={() => { setCurrency("BIF"); setAmount(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-[13px] md:text-sm font-bold transition-all ${currency === "BIF" ? "bg-white shadow text-primary" : "text-slate-500"}`}
            >
              <Home className="w-4 h-4" /> Burundi
            </button>
          </div>

          {/* Sélection Montant Rapide */}
          <div className="grid grid-cols-4 gap-2">
            {(currency === "USD" ? amountsUSD : amountsBIF).map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val)}
                className={`py-2 border-2 rounded-xl text-xs md:text-sm font-bold transition-all ${amount === val ? "border-secondary bg-secondary/10 text-primary" : "border-slate-100 hover:border-slate-200"}`}
              >
                {val}
              </button>
            ))}
          </div>

          {/* Input Montant Personnalisé */}
          <div className="relative">
            <input 
              type="number"
              placeholder={`Montant (min ${minAmount})`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full p-3 md:p-4 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-sm md:text-base ${isInvalid ? "border-red-500 focus:ring-red-200" : "border-slate-100 focus:ring-primary/20"}`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
              {currency === "USD" ? "$" : "Fbu"}
            </span>
          </div>

          {/* SECTION PAIEMENT */}
          <div className="space-y-4">
            {currency === "USD" ? (
              <Button 
                disabled={isInvalid || !amount}
                className="w-full h-12 md:h-14 bg-[#0070ba] hover:bg-[#003087] flex gap-3 text-base md:text-lg"
                onClick={() => window.open("https://paypal.me/votrecompte", "_blank")}
              >
                <CreditCard className="w-5 h-5" /> Payer par PayPal
              </Button>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <h4 className="font-bold text-emerald-800 flex items-center gap-2 mb-3 text-[13px]">
                    <Smartphone className="w-4 h-4" /> Instructions de transfert
                  </h4>
                  
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {["/lumicash_logo.png", "/beenoti_logo.png", "/ihela_logo.png"].map((img, i) => (
                      <div key={i} className="h-8 md:h-10 bg-white rounded border border-emerald-100 flex items-center justify-center p-1">
                         <img src={img} alt="logo" className="h-full object-contain" onError={(e) => e.currentTarget.style.display='none'} />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 text-[11px] md:text-[12px] text-emerald-700 leading-tight">
                    <p>• <strong>LUMICASH / ECOCASH :</strong> *150# ou *444#</p>
                    <p>• <strong>BE-ENOTI / IHELA :</strong> Compte : [NUMERO]</p>
                    <p className="mt-2 pt-2 border-t border-emerald-200 font-bold text-emerald-900">
                      Total : {amount || "0"} Fbu
                    </p>
                  </div>
                </div>

                <Button 
                  disabled={isInvalid || !amount}
                  onClick={handleWhatsAppConfirm}
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white flex gap-2 h-12 text-sm md:text-base"
                >
                  <CheckCircle2 className="w-5 h-5" /> Confirmer mon don
                </Button>
              </div>
            )}
            
            <p className="text-[9px] text-center text-muted-foreground uppercase tracking-widest">
              The Future Foundation BDI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
