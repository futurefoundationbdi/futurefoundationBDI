import { useState, useEffect } from "react";
import { X, Calendar, Star, ArrowRight, Heart, Users } from "lucide-react";
import { Button } from "./ui/button";
import { VACATION_PROGRAM_DATA } from "../data/programsData"; 

interface ProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProgramModal = ({ isOpen, onClose }: ProgramModalProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const data = VACATION_PROGRAM_DATA;

  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % data.gallery.length);
      }, 3500);
      return () => clearInterval(timer);
    }
  }, [isOpen, data.gallery.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-primary/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-[2rem] md:rounded-[3.5rem] relative shadow-2xl border-b-[12px] border-secondary">
        
        <button onClick={onClose} className="absolute top-4 right-4 z-50 bg-primary text-white p-3 rounded-full shadow-lg">
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* GAUCHE : HISTOIRES & PHOTOS */}
          <div className="p-6 md:p-10 bg-slate-50 flex flex-col gap-6">
            <h3 className="text-2xl font-black text-primary uppercase italic">Nos <span className="text-secondary">Impacts</span></h3>
            
            <div className="relative h-56 sm:h-64 md:h-80 w-full rounded-[2rem] overflow-hidden shadow-xl">
              {data.gallery.map((img, i) => (
                <img key={i} src={img.url} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === currentSlide ? "opacity-100" : "opacity-0"}`} />
              ))}
            </div>

            <div className="space-y-4">
              {data.stories.map((s, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                  <p className="text-[13px] italic text-slate-600 mb-3">"{s.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center font-black text-primary text-[10px] uppercase">{s.name[0]}</div>
                    <p className="text-[11px] font-black text-primary uppercase">{s.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DROITE : PROCHAIN ÉVÉNEMENT */}
          <div className="p-8 md:p-14 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-secondary text-primary px-4 py-2 rounded-full text-[10px] font-black mb-6 uppercase self-start">
              <Star className="w-4 h-4 fill-primary" /> {data.nextEvent.status}
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-primary mb-6 leading-none uppercase">{data.nextEvent.title}</h2>
            <p className="text-slate-500 mb-10 text-sm md:text-lg">{data.nextEvent.description}</p>
            <Button className="w-full h-16 md:h-20 bg-primary text-white rounded-[1.5rem] font-black text-lg group shadow-2xl">
              JE M'INSCRIS MAINTENANT <ArrowRight className="ml-3 group-hover:translate-x-3 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramModal;
