import React, { useState, useEffect, useRef } from 'react';

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
  
  // Nouveaux états Audio
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState("00:00");
  const [totalTimeFormatted, setTotalTimeFormatted] = useState("00:00");
  const [isLooping, setIsLooping] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const ambianceRef = useRef<HTMLAudioElement | null>(null);
  const bookAudioRef = useRef<HTMLAudioElement | null>(null);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // --- LOGIQUE AUDIO ---
  const formatTimeAudio = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (bookAudioRef.current) {
      const current = bookAudioRef.current.currentTime;
      const duration = bookAudioRef.current.duration || 0;
      setAudioProgress((current / duration) * 100);
      setCurrentTimeFormatted(formatTimeAudio(current));
      setTotalTimeFormatted(formatTimeAudio(duration));
    }
  };

  const skipTime = (amount: number) => {
    if (bookAudioRef.current) bookAudioRef.current.currentTime += amount;
  };

  const toggleAudioPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookAudioRef.current) {
      if (isAudioPlaying) {
        bookAudioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        bookAudioRef.current.play();
        setIsAudioPlaying(true);
      }
    }
  };

  // Protection Anti-Copie
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && e.keyCode === 73) || (e.ctrlKey && e.keyCode === 85) || (e.ctrlKey && e.keyCode === 80) || (e.ctrlKey && e.keyCode === 83)) e.preventDefault();
    };
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Gestion du timer et ambiance
  useEffect(() => {
    if (ambianceRef.current) {
      ambianceRef.current.volume = volume;
      if (activeTab === 'reads' && viewingFile && selectedAmbiance.url) {
        ambianceRef.current.play().catch(() => {});
      } else {
        ambianceRef.current.pause();
      }
    }
  }, [viewingFile, selectedAmbiance, volume, activeTab]);

  const handleActionStart = (item: any) => {
    if (timeLeft <= 0) return;
    if (currentBookId === null) {
      setConfirmItem(item);
      return;
    }
    if (currentBookId === item.id) {
      setIsPlaying(true);
      pressTimerRef.current = setTimeout(() => {
        setViewingFile(item.fileUrl || item.audioSrc);
        setIsPlaying(false);
        if (item.type === 'audio') setIsAudioPlaying(true);
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
      setViewingFile(confirmItem.fileUrl || confirmItem.audioSrc);
      setConfirmItem(null);
      if (confirmItem.type === 'audio') setIsAudioPlaying(true);
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
        .cd-rotate { animation: spin 8s linear infinite; }
        .cd-rotate-paused { animation-play-state: paused; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
      `}</style>

      {/* Audio Refs */}
      <audio ref={ambianceRef} src={selectedAmbiance.url} loop />
      <audio 
        ref={bookAudioRef} 
        src={activeTab === 'audios' ? viewingFile || '' : ''} 
        autoPlay={isAudioPlaying}
        loop={isLooping}
        onTimeUpdate={handleTimeUpdate}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 bg-black/30 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-white to-emerald-400 uppercase italic tracking-tighter mb-2">Future Library</h1>
            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
              <p className="text-emerald-400/70 font-black tracking-[0.4em] uppercase text-[10px]">Espace de Focus</p>
              <div className="flex gap-4 border-l border-white/10 ml-2 pl-4">
                <button onClick={() => setActiveTab('reads')} className={`text-[10px] font-bold uppercase transition-all ${activeTab === 'reads' ? 'text-emerald-400 scale-110' : 'text-white/20'}`}>Livres</button>
                <button onClick={() => setActiveTab('audios')} className={`text-[10px] font-bold uppercase transition-all ${activeTab === 'audios' ? 'text-emerald-400 scale-110' : 'text-white/20'}`}>Audio</button>
              </div>

              {/* AMBIANCE : SEULEMENT DANS L'ONGLET LIVRES */}
              {activeTab === 'reads' && (
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10 ml-4">
                  {ambiances.map(amb => (
                    <button 
                      key={amb.id} 
                      onClick={() => setSelectedAmbiance(amb)}
                      className={`px-3 py-1 rounded-full text-[8px] font-black uppercase transition-all ${selectedAmbiance.id === amb.id ? 'bg-emerald-500 text-black' : 'text-white/40'}`}
                    >
                      {amb.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-[1.8rem] text-center min-w-[160px]">
            <span className="text-4xl font-mono font-black text-white">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-x-auto pb-12 custom-scrollbar">
          {[...contents.reads, ...contents.audios]
            .filter(item => item.type === (activeTab === 'reads' ? 'pdf' : 'audio'))
            .map(item => (
              <div key={item.id} className={`min-w-[85vw] md:min-w-0 bg-black/40 backdrop-blur-md p-6 rounded-[2.2rem] border transition-all duration-500 flex flex-col h-full group ${currentBookId === item.id ? 'border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'border-white/5'}`}>
                
                <div className="relative overflow-hidden rounded-[1.8rem] mb-6 aspect-square flex items-center justify-center bg-slate-900/50">
                  {activeTab === 'reads' ? (
                    <img src={item.cover} className="relative w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" alt={item.title} />
                  ) : (
                    <div className="relative w-4/5 aspect-square">
                      {/* CD Design avec contrôles */}
                      <div className={`relative w-full h-full rounded-full border-4 border-white/10 shadow-2xl overflow-hidden transition-all duration-1000 ${currentBookId === item.id && isAudioPlaying ? 'cd-rotate' : 'cd-rotate cd-rotate-paused'}`}>
                        <img src={item.cover} className="absolute inset-0 w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="w-16 h-16 bg-[#050b14] rounded-full border-4 border-white/10 flex items-center justify-center z-20">
                              <button onClick={toggleAudioPlay} className="text-emerald-500 hover:scale-110 transition-transform">
                                {isAudioPlaying ? '⏸' : '▶'}
                              </button>
                           </div>
                        </div>
                      </div>
                      
                      {/* Contrôles de navigation autour du CD */}
                      {currentBookId === item.id && (
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-4 z-30 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                          <button onClick={() => skipTime(-10)} className="text-[10px] text-white/60 hover:text-emerald-400"> -10s </button>
                          <button onClick={() => setIsLooping(!isLooping)} className={`text-[10px] ${isLooping ? 'text-emerald-400' : 'text-white/60'}`}> 🔁 </button>
                          <button onClick={() => skipTime(10)} className="text-[10px] text-white/60 hover:text-emerald-400"> +10s </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <h3 className="font-bold text-xl text-white italic line-clamp-1">{item.title}</h3>
                <p className="text-emerald-500/60 font-black text-[9px] uppercase tracking-widest mb-2">{(item as any).author || (item as any).source}</p>
                
                {/* Timer Audio */}
                {activeTab === 'audios' && currentBookId === item.id && (
                  <div className="mb-4">
                    <div className="flex justify-between text-[10px] font-mono text-emerald-400/80 mb-1">
                      <span>{currentTimeFormatted}</span>
                      <span>{totalTimeFormatted}</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${audioProgress}%` }} />
                    </div>
                  </div>
                )}

                <div className="flex-grow bg-white/2 p-4 rounded-xl mb-6 border border-white/5">
                  <p className="text-[11px] text-slate-400 leading-relaxed italic line-clamp-3">"{ (item as any).review || "Audio format immersif pour un apprentissage passif efficace." }"</p>
                </div>

                <button 
                  onMouseDown={() => handleActionStart(item)}
                  onMouseUp={handleActionEnd}
                  onTouchStart={() => handleActionStart(item)}
                  onTouchEnd={handleActionEnd}
                  className={`w-full py-4 rounded-2xl font-black uppercase text-[9px] transition-all ${currentBookId !== null && currentBookId !== item.id ? 'bg-white/5 text-white/20' : 'bg-emerald-500 text-black hover:bg-white'}`}
                >
                  {currentBookId === item.id ? (activeTab === 'reads' ? 'Maintenir pour ouvrir' : 'Maintenir pour synchroniser') : 'Choisir'}
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Modal Confirmation */}
      {confirmItem && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="absolute inset-0 bg-[#050b14]/90" onClick={() => setConfirmItem(null)} />
          <div className="relative bg-[#0a121e] border border-emerald-500/30 p-8 rounded-[2.5rem] max-w-sm w-full text-center">
            <h3 className="text-xl font-black text-white mb-2 uppercase italic">Confirmer le focus ?</h3>
            <button onClick={confirmChoice} className="w-full py-4 bg-emerald-500 text-black font-black uppercase text-[10px] rounded-xl hover:bg-white transition-all">Valider</button>
          </div>
        </div>
      )}

      {/* Lecteur PDF */}
      {viewingFile && activeTab === 'reads' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 md:p-8 animate-in fade-in zoom-in duration-500">
          <div className="absolute inset-0 bg-[#050b14]/98 backdrop-blur-3xl" />
          <div className="relative w-full max-w-6xl h-full bg-black border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/2">
              <div className="flex gap-2">
                {(['normal', 'sepia', 'night'] as const).map(mode => (
                  <button key={mode} onClick={() => setReadMode(mode)} className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${readMode === mode ? 'bg-white text-black' : 'text-white/40'}`}> {mode} </button>
                ))}
              </div>
              <button onClick={() => setViewingFile(null)} className="bg-white/5 text-white/60 border border-white/10 px-6 py-2 rounded-full text-[9px] font-black hover:bg-red-500 hover:text-white transition-all">Fermer</button>
            </div>
            <div className="w-full h-full relative bg-[#f2f2f2] overflow-hidden">
                <iframe src={`https://docs.google.com/viewer?url=${window.location.origin}${viewingFile}&embedded=true`} className="w-full h-full border-none" style={{ filter: getFilterStyle() }} title="Liseuse" />
                <div className="absolute inset-0 bg-transparent z-[205] pointer-events-none" onContextMenu={(e) => e.preventDefault()} />
            </div>
          </div>
        </div>
      )}

      {showAdvice && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-black px-8 py-4 rounded-full font-black text-[10px] uppercase shadow-lg">
          💡 Un livre à la fois pour un esprit discipliné.
        </div>
      )}
    </div>
  );
}
