import React, { useState, useEffect, useRef } from 'react';

// Types pour la gestion des avis et modes
type ReadingMode = 'normal' | 'sepia' | 'night';

const contents = {
  reads: [
    { id: 1, title: "Le jeu de la Vie et comment le jouer", author: "Florence Scovel Shinn", cover: "/covers/J de la vie.webp", fileUrl: "/books/Le jeu de la Vie et comment le jouer.pdf", type: "pdf", review: "Commencez dès aujourd’hui à croire en vous et laissez-vous guider avec bonheur dans tous les domaines de votre vie!" },
    { id: 2, title: "La Science de la Grandeur", author: "Wallace D. Wattles", cover: "/covers/S de la G.webp", fileUrl: "/books/La science de la Grandeur.pdf", type: "pdf", review: "Apprenez comment croire en la grandeur de votre propre esprit et comment agir avec grandeur." },
    { id: 5, title: "L'Homme le plus riche de Babylone", author: "George S. Clason", cover: "/covers/riche.webp", fileUrl: "/books/homme-riche.pdf", type: "pdf", review: "Des principes millénaires toujours d'actualité." },
    { id: 6, title: "Réfléchissez et devenez riche", author: "Napoleon Hill", cover: "/covers/R et DR.webp", fileUrl: "/books/Réfléchissez et devenez riche.pdf", type: "pdf", review: "Le classique absolu sur la force de la pensée." }
  ],
  audios: [
    { id: 3, title: "L'Investissement Intelligent", source: "NoteBookLM", duration: "12 min", audioSrc: "/audio/invest.mp3", type: "audio" },
    { id: 4, title: "Discipline & Succès", source: "NoteBookLM", duration: "08 min", audioSrc: "/audio/discipline.mp3", type: "audio" }
  ]
};

const ambiances = [
  { id: 'none', name: '🔇 Silence', url: '' },
  { id: 'nature', name: '🍃 Forêt & Oiseaux', url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3' },
  { id: 'rain', name: '🌧️ Pluie Fine', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
];

export default function Library() {
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [activeTab, setActiveTab] = useState<'reads' | 'audios'>('reads');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBookId, setCurrentBookId] = useState<number | null>(null);
  const [selectedAmbiance, setSelectedAmbiance] = useState(ambiances[0]);
  const [showAdvice, setShowAdvice] = useState(false);
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  const [readMode, setReadMode] = useState<ReadingMode>('normal');
  
  const [ratings, setRatings] = useState<Record<number, number>>({});
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedTime = localStorage.getItem('future_library_time');
    const savedRatings = localStorage.getItem('future_library_ratings');
    const today = new Date().toDateString();
    
    if (localStorage.getItem('future_library_date') !== today) {
      localStorage.setItem('future_library_time', (45 * 60).toString());
      localStorage.setItem('future_library_date', today);
      setTimeLeft(45 * 60);
    } else if (savedTime) {
      setTimeLeft(parseInt(savedTime));
    }

    if (savedRatings) {
      setRatings(JSON.parse(savedRatings));
    }
  }, []);

  const handleRate = (id: number, score: number) => {
    const newRatings = { ...ratings, [id]: score };
    setRatings(newRatings);
    localStorage.setItem('future_library_ratings', JSON.stringify(newRatings));
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          localStorage.setItem('future_library_time', newTime.toString());
          return newTime;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, timeLeft]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && activeTab === 'reads' && selectedAmbiance.url) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, selectedAmbiance, activeTab]);

  const handleActionStart = (item: any) => {
    if (timeLeft <= 0) return;
    
    if (currentBookId === null || currentBookId === item.id) {
      setCurrentBookId(item.id);
      setIsPlaying(true);

      if (item.type === 'pdf') {
        pressTimerRef.current = setTimeout(() => {
          setViewingFile(item.fileUrl);
          setIsPlaying(false);
        }, 2000);
      }
    } else {
      setShowAdvice(true);
      setTimeout(() => setShowAdvice(false), 4000);
    }
  };

  const handleActionEnd = () => {
    setIsPlaying(false);
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
  };

  const getFilterStyle = () => {
    switch(readMode) {
      case 'sepia': return 'sepia(0.8) contrast(0.9) brightness(0.9)';
      case 'night': return 'invert(0.9) hue-rotate(180deg) brightness(0.8)';
      default: return 'none';
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    /* AJOUT DE scroll-mt-24 ICI POUR RÉGLER LE PROBLÈME DE LA NAVBAR */
    <div id="bibliotheque" className="relative min-h-screen text-slate-100 p-6 md:p-12 font-sans overflow-hidden bg-[#050b14] scroll-mt-24">
      
      {/* --- FOND AURORA --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[70%] bg-emerald-500/15 blur-[120px] rounded-full animate-pulse opacity-50 shadow-[inset_0_0_100px_rgba(16,185,129,0.2)]"></div>
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      </div>

      <audio ref={audioRef} src={selectedAmbiance.url} loop />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 bg-black/30 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-white to-emerald-400 uppercase italic tracking-tighter mb-2">
              Future Library
            </h1>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <p className="text-emerald-400/70 font-black tracking-[0.4em] uppercase text-[10px]">Espace de Focus</p>
              <div className="flex gap-2">
                <button onClick={() => setActiveTab('reads')} className={`text-[10px] font-bold uppercase transition-all ${activeTab === 'reads' ? 'text-white' : 'text-white/20'}`}>Livres</button>
                <button onClick={() => setActiveTab('audios')} className={`text-[10px] font-bold uppercase transition-all ${activeTab === 'audios' ? 'text-white' : 'text-white/20'}`}>Audio</button>
              </div>
            </div>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-[1.8rem] text-center min-w-[160px]">
            <span className="text-4xl font-mono font-black text-white">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Grille de livres */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-x-auto pb-12 custom-scrollbar">
          {[...contents.reads, ...contents.audios]
            .filter(item => item.type === (activeTab === 'reads' ? 'pdf' : 'audio'))
            .map(item => (
              <div key={item.id} className="min-w-[85vw] md:min-w-0 bg-black/40 backdrop-blur-md p-6 rounded-[2.2rem] border border-white/5 flex flex-col h-full group">
                <div className="relative overflow-hidden rounded-[1.8rem] mb-6 aspect-[4/5] shadow-2xl">
                  <img src={item.cover} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                  
                  {/* SYSTEME DE RATING FLOTTANT */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex gap-1 border border-white/10 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        onClick={(e) => { e.stopPropagation(); handleRate(item.id, star); }}
                        className={`text-xs transition-colors ${ (ratings[item.id] || 0) >= star ? 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]' : 'text-white/20'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  {currentBookId === item.id && isPlaying && (
                    <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[4px] flex items-center justify-center animate-pulse">
                       <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-xl text-white italic line-clamp-1">{item.title}</h3>
                  {ratings[item.id] && (
                    <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                      {ratings[item.id]} ★
                    </span>
                  )}
                </div>
                
                <p className="text-emerald-500/60 font-black text-[9px] uppercase tracking-widest mb-4">{(item as any).author || item.source}</p>
                
                <div className="flex-grow bg-white/2 p-4 rounded-xl mb-6 border border-white/5">
                  <span className="text-[8px] font-black uppercase text-white/30 block mb-2 tracking-widest">Avis de la Fondation</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    "{ (item as any).review || "Un catalyseur essentiel pour votre développement stratégique." }"
                  </p>
                </div>

                <button 
                  onMouseDown={() => handleActionStart(item)}
                  onMouseUp={handleActionEnd}
                  onMouseLeave={handleActionEnd}
                  onTouchStart={() => handleActionStart(item)}
                  onTouchEnd={handleActionEnd}
                  className="w-full py-4 rounded-2xl font-black uppercase text-[9px] bg-emerald-500 text-black hover:bg-white transition-all shadow-lg active:scale-95"
                >
                  {activeTab === 'reads' ? 'Maintenir pour Lire' : 'Maintenir pour Écouter'}
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* --- LECTEUR IMMERSIF --- */}
      {viewingFile && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 md:p-8 animate-in fade-in zoom-in duration-500">
          <div className="absolute inset-0 bg-[#050b14]/98 backdrop-blur-3xl" />
          <div className="relative w-full max-w-6xl h-full md:h-[92vh] bg-black border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/5 flex flex-wrap justify-between items-center bg-white/2 gap-4">
              <div className="flex gap-2 bg-black/40 p-1 rounded-full border border-white/10">
                {(['normal', 'sepia', 'night'] as const).map(mode => (
                  <button 
                    key={mode}
                    onClick={() => setReadMode(mode)} 
                    className={`px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${readMode === mode ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                  >
                    {mode === 'normal' ? 'Lumière' : mode === 'sepia' ? 'Confort' : 'Nuit'}
                  </button>
                ))}
              </div>
              <button onClick={() => setViewingFile(null)} className="bg-white/5 text-white/60 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest">Fermer la dimension</button>
            </div>
            <div className="w-full h-full relative bg-[#f2f2f2]">
               <iframe 
                src={`https://docs.google.com/viewer?url=${window.location.origin}${viewingFile}&embedded=true`}
                className="w-full h-full border-none transition-all duration-700" 
                style={{ filter: getFilterStyle() }}
                title="Liseuse"
              />
            </div>
          </div>
        </div>
      )}

      {/* --- CONSEIL BIENVEILLANT --- */}
      {showAdvice && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-black px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-in slide-in-from-bottom-10 duration-500 flex items-center gap-3">
          <span className="text-lg">💡</span>
          <span>Le savoir s'ancre mieux dans la patience. Un livre à la fois.</span>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .group:hover .line-clamp-1 { -webkit-line-clamp: unset; }
      `}</style>
    </div>
  );
}
