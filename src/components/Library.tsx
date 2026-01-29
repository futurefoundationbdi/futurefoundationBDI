import React, { useState, useEffect, useRef } from 'react';

// Types pour la gestion des avis et modes
type ReadingMode = 'normal' | 'sepia' | 'night';

const contents = {
  reads: [
    { id: 1, title: "Le jeu de la Vie et comment le jouer", author: "Florence Scovel Shinn", cover: "/covers/J de la vie.webp", fileUrl: "/books/Le jeu de la Vie et comment le jouer.pdf", type: "pdf", review: "Commencez dès aujourd’hui à croire en vous et laissez-vous guider avec bonheur dans tous les domaines de votre vie!" },
    { id: 2, title: "La Science de la Grandeur", author: "Wallace D. Wattles", cover: "/covers/S de la G.webp", fileUrl: "/books/La science de la Grandeur.pdf", type: "pdf", review: "Apprenez comment croire en la grandeur de votre propre esprit et comment agir avec grandeur." },
    { id: 5, title: "L'Homme le plus riche de Babylone", author: "George S. Clason", cover: "/covers/riche.webp", fileUrl: "/books/homme-riche.pdf", type: "pdf", review: "Des principes millénaires toujours d'actualité." },
    { id: 6, title: "Réfléchissez et devenez riche", author: "Napoleon Hill", cover: "/covers/R et DR.webp", fileUrl: "/books/Réfléchissez et devenez riche.pdf", type: "pdf", review: "Le classique absolu sur la force de la pensée." },
    { id: 7, title: "La Science de l'Enrechissement", author: "Wallace D. Wattles", cover: "/covers/la S de l'E.webp", fileUrl: "/books/La science de l'Enrichissement.pdf", type: "pdf", review:"Le fondement de la mentalité d'abondance. Il explique que s'enrichir est une science exacte basée sur la pensée créative et non la compétition."},
    { id: 8, title: "L'Art d'avoir toujours raison", author: "Arthur Schopenhauer", cover: "/covers/à lire.webp", fileUrl: "/books/Lart davoir toujours raison.pdf", type: "pdf", review: "Ce livre est un outil puissant pour apprendre à détecter les manipulations de langage et s'imposer dans les négociations." }
  ],
  audios: [
    { id: 3, title: "L'Investissement Intelligent", source: "NoteBookLM", duration: "12 min", audioSrc: "/audio/invest.mp3", type: "audio", cover: "/covers/invest.webp" },
    { id: 4, title: "Discipline & Succès", source: "NoteBookLM", duration: "08 min", audioSrc: "/audio/discipline.mp3", type: "audio", cover: "/covers/discipline.webp" }
  ]
};

const ambiances = [
  { id: 'none', name: '🔇 Silence', url: '' },
  { id: 'nature', name: '🍃 Nature', url: '/audio/nature.mp3' },
  { id: 'rain', name: '🌧️ Pluie', url: '/audio/rain.mp3' },
  { id: 'ocean', name: '🌊 Océan', url: '/audio/waves.mp3' },
];

export default function Library() {
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [activeTab, setActiveTab] = useState<'reads' | 'audios'>('reads');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBookId, setCurrentBookId] = useState<number | null>(null);
  const [confirmItem, setConfirmItem] = useState<any>(null); 
  const [selectedAmbiance, setSelectedAmbiance] = useState(ambiances[0]);
  const [volume, setVolume] = useState(0.5);
  const [showAdvice, setShowAdvice] = useState(false);
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  const [readMode, setReadMode] = useState<ReadingMode>('normal');
  
  // États Audio Avancés
  const [isAudioPaused, setIsAudioPaused] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [audioProgress, setAudioProgress] = useState({ current: 0, total: 0, percent: 0 });

  const ambianceRef = useRef<HTMLAudioElement | null>(null);
  const bookAudioRef = useRef<HTMLAudioElement | null>(null);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // --- PROTECTION ANTI-COPIE ---
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && e.keyCode === 73) || (e.ctrlKey && e.keyCode === 85) || (e.ctrlKey && e.keyCode === 80) || (e.ctrlKey && e.keyCode === 83)) {
        e.preventDefault();
      }
    };
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // --- LOGIQUE AUDIO & AMBIANCE ---
  useEffect(() => {
    if (ambianceRef.current) {
      ambianceRef.current.volume = volume;
      if (viewingFile && selectedAmbiance.url) {
        ambianceRef.current.play().catch(() => {});
      } else {
        ambianceRef.current.pause();
      }
    }
  }, [viewingFile, selectedAmbiance, volume]);

  const updateProgress = () => {
    if (bookAudioRef.current) {
      const current = bookAudioRef.current.currentTime;
      const total = bookAudioRef.current.duration || 0;
      setAudioProgress({
        current,
        total,
        percent: (current / total) * 100
      });
    }
  };

  const skipTime = (seconds: number) => {
    if (bookAudioRef.current) bookAudioRef.current.currentTime += seconds;
  };

  const formatAudioTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- GESTION DU TIMER GLOBAL ---
  useEffect(() => {
    if (viewingFile && timeLeft > 0 && !isAudioPaused) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          localStorage.setItem('future_library_time', newTime.toString());
          return newTime;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [viewingFile, timeLeft, isAudioPaused]);

  const handleActionStart = (item: any) => {
    if (timeLeft <= 0) return;
    if (currentBookId === null) {
      setConfirmItem(item);
      return;
    }
    if (currentBookId === item.id) {
      setIsPlaying(true);
      pressTimerRef.current = setTimeout(() => {
        setViewingFile(item.type === 'pdf' ? item.fileUrl : item.audioSrc);
        setIsPlaying(false);
        setIsAudioPaused(false);
      }, 1500);
    } else {
      setShowAdvice(true);
      setTimeout(() => setShowAdvice(false), 4000);
    }
  };

  const confirmChoice = () => {
    if (confirmItem) {
      setCurrentBookId(confirmItem.id);
      localStorage.setItem('future_library_book_id', confirmItem.id.toString());
      setViewingFile(confirmItem.type === 'pdf' ? confirmItem.fileUrl : confirmItem.audioSrc);
      setConfirmItem(null);
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
    <div id="bibliotheque" className="relative min-h-screen text-slate-100 p-6 md:p-12 font-sans overflow-hidden bg-[#050b14] select-none">
      
      <style>{`
        .cd-rotate { animation: spin 10s linear infinite; }
        .cd-paused { animation-play-state: paused; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* Lecteurs Audio Cachés */}
      <audio ref={ambianceRef} src={selectedAmbiance.url} loop />
      <audio 
        ref={bookAudioRef} 
        src={viewingFile && viewingFile.endsWith('.mp3') ? viewingFile : ''} 
        loop={isLooping}
        onTimeUpdate={updateProgress}
        autoPlay
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Barre d'outils Ambiance & Temps */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 bg-black/30 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-white to-emerald-400 uppercase italic mb-2">Future Library</h1>
            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
              <div className="flex gap-4 border-r border-white/10 pr-4">
                <button onClick={() => setActiveTab('reads')} className={`text-[10px] font-bold uppercase transition-all ${activeTab === 'reads' ? 'text-emerald-400' : 'text-white/20'}`}>Livres</button>
                <button onClick={() => setActiveTab('audios')} className={`text-[10px] font-bold uppercase transition-all ${activeTab === 'audios' ? 'text-emerald-400' : 'text-white/20'}`}>Audio</button>
              </div>
              {/* SÉLECTEUR D'AMBIANCE CORRIGÉ */}
              <div className="flex gap-2">
                {ambiances.map(amb => (
                  <button 
                    key={amb.id} 
                    onClick={() => setSelectedAmbiance(amb)}
                    className={`text-[9px] px-3 py-1 rounded-full border transition-all ${selectedAmbiance.id === amb.id ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-white/5 text-white/40 border-white/10'}`}
                  >
                    {amb.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-[1.8rem] text-center min-w-[160px]">
            <span className="text-4xl font-mono font-black text-white">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Grille de contenu */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-x-auto pb-12 custom-scrollbar">
          {[...contents.reads, ...contents.audios]
            .filter(item => item.type === (activeTab === 'reads' ? 'pdf' : 'audio'))
            .map(item => (
              <div key={item.id} className={`min-w-[85vw] md:min-w-0 bg-black/40 backdrop-blur-md p-6 rounded-[2.2rem] border transition-all duration-500 flex flex-col h-full group ${currentBookId === item.id ? 'border-emerald-500/40 shadow-2xl' : 'border-white/5'}`}>
                
                <div className="relative overflow-hidden rounded-[1.8rem] mb-6 aspect-square flex items-center justify-center bg-slate-900/50">
                  {activeTab === 'reads' ? (
                    <img src={item.cover} className="relative w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" alt={item.title} />
                  ) : (
                    <div className={`relative w-4/5 aspect-square rounded-full border-4 border-white/10 shadow-2xl overflow-hidden transition-all duration-1000 ${currentBookId === item.id && viewingFile && !isAudioPaused ? 'cd-rotate' : 'cd-paused'}`}>
                      <img src={item.cover} className="absolute inset-0 w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-[#050b14] rounded-full border-4 border-white/10 flex items-center justify-center">
                          <div className={`w-2 h-2 rounded-full ${currentBookId === item.id && viewingFile ? 'bg-emerald-500 animate-pulse' : 'bg-white/20'}`} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <h3 className="font-bold text-xl text-white italic line-clamp-1">{item.title}</h3>
                <p className="text-emerald-500/60 font-black text-[9px] uppercase tracking-widest mb-4">{(item as any).author || (item as any).source}</p>
                
                {/* LECTEUR AUDIO INTÉGRÉ À LA CARTE */}
                {activeTab === 'audios' && currentBookId === item.id && viewingFile && (
                  <div className="mb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between text-[10px] font-mono text-emerald-400/80">
                      <span>{formatAudioTime(audioProgress.current)}</span>
                      <span>{formatAudioTime(audioProgress.total)}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${audioProgress.percent}%` }} />
                    </div>
                    <div className="flex justify-center items-center gap-6 pt-2">
                      <button onClick={() => skipTime(-10)} className="text-white/40 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>
                      </button>
                      <button 
                        onClick={() => {
                          if(bookAudioRef.current?.paused) {
                            bookAudioRef.current.play();
                            setIsAudioPaused(false);
                          } else {
                            bookAudioRef.current?.pause();
                            setIsAudioPaused(true);
                          }
                        }}
                        className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-all"
                      >
                        {isAudioPaused ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        ) : (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                        )}
                      </button>
                      <button onClick={() => skipTime(10)} className="text-white/40 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>
                      </button>
                      <button 
                        onClick={() => setIsLooping(!isLooping)} 
                        className={`transition-colors ${isLooping ? 'text-emerald-400' : 'text-white/20'}`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex-grow bg-white/2 p-4 rounded-xl mb-6 border border-white/5">
                  <p className="text-[11px] text-slate-400 leading-relaxed italic line-clamp-2">"{ (item as any).review || "Format audio immersif pour un apprentissage efficace." }"</p>
                </div>

                <button 
                  onMouseDown={() => handleActionStart(item)}
                  onMouseUp={handleActionEnd}
                  onTouchStart={() => handleActionStart(item)}
                  onTouchEnd={handleActionEnd}
                  className={`w-full py-4 rounded-2xl font-black uppercase text-[9px] transition-all ${currentBookId !== null && currentBookId !== item.id ? 'bg-white/5 text-white/20' : 'bg-emerald-500 text-black hover:bg-white'}`}
                >
                  {currentBookId === item.id ? (viewingFile ? 'En cours' : 'Maintenir pour ouvrir') : (currentBookId === null ? 'Choisir' : 'Focus en cours...')}
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* MODAL LECTEUR PDF (Conditionnel au type PDF) */}
      {viewingFile && viewingFile.endsWith('.pdf') && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 md:p-8 animate-in fade-in zoom-in duration-300">
          <div className="absolute inset-0 bg-[#050b14]/98 backdrop-blur-3xl" onClick={() => setViewingFile(null)} />
          <div className="relative w-full max-w-6xl h-full bg-black border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/2">
              <div className="flex gap-2">
                {(['normal', 'sepia', 'night'] as const).map(mode => (
                  <button key={mode} onClick={() => setReadMode(mode)} className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase transition-all ${readMode === mode ? 'bg-white text-black' : 'text-white/40'}`}>{mode}</button>
                ))}
              </div>
              <button onClick={() => setViewingFile(null)} className="bg-red-500/10 text-red-500 border border-red-500/30 px-6 py-2 rounded-full text-[9px] font-black uppercase">Fermer</button>
            </div>
            <div className="flex-grow bg-white relative">
              <iframe 
                src={`https://docs.google.com/viewer?url=${window.location.origin}${viewingFile}&embedded=true`} 
                className="w-full h-full" 
                style={{ filter: getFilterStyle() }}
              />
              <div className="absolute inset-0 bg-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMATION */}
      {confirmItem && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="absolute inset-0 bg-[#050b14]/90" onClick={() => setConfirmItem(null)} />
          <div className="relative bg-[#0a121e] border border-emerald-500/30 p-8 rounded-[2.5rem] max-w-sm w-full text-center">
            <h3 className="text-xl font-black text-white mb-2 uppercase italic">Confirmer le focus ?</h3>
            <p className="text-slate-400 text-[11px] mb-8 italic italic">Ce choix verrouille votre session actuelle.</p>
            <button onClick={confirmChoice} className="w-full py-4 bg-emerald-500 text-black font-black uppercase text-[10px] rounded-xl mb-2 hover:bg-white transition-all">Commencer</button>
            <button onClick={() => setConfirmItem(null)} className="w-full py-4 text-white/20 text-[9px] uppercase font-bold">Annuler</button>
          </div>
        </div>
      )}

      {showAdvice && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-black px-8 py-4 rounded-full font-black text-[10px] uppercase shadow-2xl animate-bounce">
          💡 La discipline exige de finir ce qu'on commence.
        </div>
      )}
    </div>
  );
}
