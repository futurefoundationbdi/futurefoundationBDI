import React, { useState, useEffect, useRef } from 'react';

type ReadingMode = 'normal' | 'sepia' | 'night';

const contents = {
  reads: [
    { id: 1, title: "Le jeu de la Vie et comment le jouer", author: "Florence Scovel Shinn", cover: "/covers/J de la vie.webp", fileUrl: "/books/Le jeu de la Vie et comment le jouer.pdf", type: "pdf", review: "Commencez dès aujourd’hui à croire en vous et laissez-vous guider avec bonheur dans tous les domaines de votre vie!" },
    { id: 2, title: "La Science de la Grandeur", author: "Wallace D. Wattles", cover: "/covers/S de la G.webp", fileUrl: "/books/La science de la Grandeur.pdf", type: "pdf", review: "Apprenez comment croire en la grandeur de votre propre esprit et comment agir avec grandeur." },
    { id: 5, title: "L'Homme le plus riche de Babylone", author: "George S. Clason", cover: "/covers/riche.webp", fileUrl: "/books/homme-riche.pdf", type: "pdf", review: "Des principes millénaires toujours d'actualité." },
    { id: 6, title: "Réfléchissez et devenez riche", author: "Napoleon Hill", cover: "/covers/R et DR.webp", fileUrl: "/books/Réfléchissez et devenez riche.pdf", type: "pdf", review: "Le classique absolu sur la force de la pensée." },
    { id: 7, title: "La Science de l'Enrechissement", author: "Wallace D. Wattles", cover: "/covers/la S de l'E.webp", fileUrl: "/books/La science de l'Enrichissement.pdf", type: "pdf", review:"Le fondement de la mentalité d'abondance."},
    { id: 8, title: "L'Art d'avoir toujours raison", author: "Arthur Schopenhauer", cover: "/covers/à lire.webp", fileUrl: "/books/Lart davoir toujours raison.pdf", type: "pdf", review: "Outil puissant pour détecter les manipulations." }
  ],
  audios: [
    { id: 3, title: "La chèvre de ma mère: Les secrets de la prospérité financière", source: "NoteBookLM", duration: "15 min", audioSrc: "/audio/lachevre.mp3", type: "audio", cover: "/covers/La chèvre.webp" },
    { id: 4, title: "MARIÉS ET APRÈS ?", source: "NoteBookLM", duration: "08 min", audioSrc: "/audio/marriageetapres.mp3", type: "audio", cover: "/covers/MARIÉS ET APRÈS _.webp" }
  ]
};

const ambiances = [
  { id: 'none', name: '🔇', url: '' },
  { id: 'nature', name: '🍃 Nature', url: '/audio/nature.mp3' },
  { id: 'rain', name: '🌧️ Pluie', url: '/audio/rain.mp3' },
  { id: 'ocean', name: 'Waves', url: '/audio/waves.mp3' },
];

export default function Library() {
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('future_library_time');
    const lastDate = localStorage.getItem('future_library_last_date');
    const now = Date.now();

    // Si plus de 24h se sont écoulées, on remet à 45 min
    if (lastDate && now - parseInt(lastDate) > 24 * 60 * 60 * 1000) {
      localStorage.setItem('future_library_last_date', now.toString());
      return 45 * 60;
    }
    return saved ? parseInt(saved) : 45 * 60;
  });

  const [currentBookId, setCurrentBookId] = useState<number | null>(() => {
    const saved = localStorage.getItem('future_library_book_id');
    return saved ? parseInt(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<'reads' | 'audios'>('reads');
  const [isPressing, setIsPressing] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [confirmItem, setConfirmItem] = useState<any>(null); 
  const [selectedAmbiance, setSelectedAmbiance] = useState(ambiances[0]);
  const [volume, setVolume] = useState(0.5);
  const [showAdvice, setShowAdvice] = useState(false);
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  const [readMode, setReadMode] = useState<ReadingMode>('normal');
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioTimeInfo, setAudioTimeInfo] = useState({ current: '00:00', total: '00:00' });
  
  const ambianceRef = useRef<HTMLAudioElement | null>(null);
  const bookAudioRef = useRef<HTMLAudioElement | null>(null);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (ambianceRef.current) {
      ambianceRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === 123 || 
         (e.ctrlKey && e.shiftKey && e.keyCode === 73) || 
         (e.ctrlKey && e.keyCode === 85) || 
         (e.ctrlKey && e.keyCode === 80) || 
         (e.ctrlKey && e.keyCode === 83)) {
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
  
  useEffect(() => {
    if ('mediaSession' in navigator && currentBookId) {
      const activeBook = [...contents.reads, ...contents.audios].find(b => b.id === currentBookId);
      if (activeBook) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: activeBook.title,
          artist: (activeBook as any).author || (activeBook as any).source,
          artwork: [{ src: activeBook.cover, sizes: '512x512', type: 'image/webp' }]
        });
        navigator.mediaSession.setActionHandler('play', togglePlay);
        navigator.mediaSession.setActionHandler('pause', togglePlay);
        navigator.mediaSession.setActionHandler('seekbackward', () => seek(-10));
        navigator.mediaSession.setActionHandler('seekforward', () => seek(10));
      }
    }
  }, [currentBookId, isAudioPlaying]);
  
  useEffect(() => {
    // Le chrono ne tourne QUE si on est en train de lire un livre (viewingFile n'est pas nul)
    const isReadingBook = viewingFile && activeTab === 'reads';
    
    if (isReadingBook && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          localStorage.setItem('future_library_time', newTime.toString());
          // On met à jour la date pour le calcul des 24h
          localStorage.setItem('future_library_last_date', Date.now().toString());
          return newTime;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [viewingFile, activeTab, timeLeft]); // Le timer se coupera dès que viewingFile changera

  const togglePlay = () => {
    if (bookAudioRef.current) {
      if (isAudioPlaying) bookAudioRef.current.pause();
      else bookAudioRef.current.play();
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  const seek = (amount: number) => {
    if (bookAudioRef.current) bookAudioRef.current.currentTime += amount;
  };

  const updateProgress = () => {
    if (bookAudioRef.current) {
      const current = bookAudioRef.current.currentTime;
      const total = bookAudioRef.current.duration || 0;
      setAudioProgress((current / total) * 100);
      setAudioTimeInfo({
        current: formatAudioTime(current),
        total: formatAudioTime(total)
      });
    }
  };

  const formatAudioTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleActionStart = (item: any) => {
    if (item.type === 'pdf' && timeLeft <= 0) return;
    
    if (item.type === 'audio') {
      setConfirmItem(item); 
      return; 
    }

    // On vérifie si un livre (PDF) est déjà verrouillé
    const isAPdfLocked = currentBookId !== null && contents.reads.some(r => r.id === currentBookId);

    if (!isAPdfLocked) {
      setConfirmItem(item);
    } else if (currentBookId === item.id) {
      setIsPressing(true);
      pressTimerRef.current = setTimeout(() => {
        setViewingFile(item.fileUrl);
        setIsPressing(false);
      }, 2000);
    } else {
      setShowAdvice(true);
      setTimeout(() => setShowAdvice(false), 4000);
    }
  };

  const confirmChoice = () => {
    if (confirmItem) {
      if (confirmItem.type === 'pdf') {
        setCurrentBookId(confirmItem.id);
        localStorage.setItem('future_library_book_id', confirmItem.id.toString());
        setViewingFile(confirmItem.fileUrl);
      } else {
        // Audio : On change sans verrouiller le currentBookId global du PDF
        // Mais on l'utilise pour savoir quel CD tourne
        setCurrentBookId(confirmItem.id); 
        setViewingFile(confirmItem.audioSrc);
        setIsAudioPlaying(false);
        setAudioProgress(0);
      }
      setConfirmItem(null);
    }
  };

  const getFilterStyle = () => {
    switch(readMode) {
      case 'sepia': return 'sepia(0.8) contrast(0.9) brightness(0.9)';
      case 'night': return 'invert(0.9) hue-rotate(180deg) brightness(0.8)';
      default: return 'none';
    }
  };

  return (
    <div id="bibliotheque" className="relative min-h-screen text-slate-100 p-6 md:p-12 font-sans bg-[#050b14] select-none overflow-x-hidden scroll-mt-20">
      <style>{`
        .cd-rotate { animation: spin 6s linear infinite; }
        .cd-pause { animation-play-state: paused; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }
      `}</style>

      <audio ref={ambianceRef} src={selectedAmbiance.url} loop autoPlay={!!viewingFile} />
      <audio 
        ref={bookAudioRef} 
        key={viewingFile}
        src={activeTab === 'audios' ? (viewingFile || '') : ''} 
        loop={isLooping}
        onTimeUpdate={updateProgress}
        onPlay={() => setIsAudioPlaying(true)}
        onPause={() => setIsAudioPlaying(false)}
        autoPlay={activeTab === 'audios' && !!viewingFile}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 bg-black/30 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500 uppercase italic">Future Library</h1>
            <div className="flex gap-4 mt-4 bg-white/5 p-1.5 rounded-full w-fit border border-white/5">
              <button onClick={() => setActiveTab('reads')} className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase transition-all duration-300 ${activeTab === 'reads' ? 'bg-emerald-500 text-black' : 'text-white/40 hover:text-white'}`}>📚 Livres</button>
              <button onClick={() => setActiveTab('audios')} className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase transition-all duration-300 ${activeTab === 'audios' ? 'bg-emerald-500 text-black' : 'text-white/40 hover:text-white'}`}>🎧 Audio</button>
            </div>
          </div>

          <div className={`transition-all duration-500 ${activeTab === 'reads' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-[1.8rem] text-center min-w-[140px]">
              <span className="text-4xl font-mono font-black text-white">{Math.floor(timeLeft / 60)}m {timeLeft % 60}s</span>
            </div>
          </div>
        </div>

        <div key={activeTab} className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-x-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {[...contents.reads, ...contents.audios]
            .filter(item => item.type === (activeTab === 'reads' ? 'pdf' : 'audio'))
            .map(item => {
              // LOGIQUE DE VERROUILLAGE : Uniquement si on est dans l'onglet Livres et qu'un autre livre est déjà choisi
              const isLocked = activeTab === 'reads' && currentBookId !== null && currentBookId !== item.id && contents.reads.some(r => r.id === currentBookId);
              
              return (
                <div key={item.id} className={`min-w-[85vw] md:min-w-0 bg-black/40 p-6 rounded-[2.2rem] border transition-all duration-500 ${currentBookId === item.id ? 'border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.1)]' : 'border-white/5'}`}>
                  
                  <div className="relative overflow-hidden rounded-[1.8rem] mb-6 aspect-[3/4] flex items-center justify-center bg-black/20">
                    {item.type === 'pdf' ? (
                      <img src={item.cover} className="w-full h-full object-contain p-2 drop-shadow-2xl" alt="" />
                    ) : (
                      <div className={`relative w-4/5 aspect-square rounded-full border-4 border-white/10 shadow-2xl overflow-hidden ${currentBookId === item.id && isAudioPlaying ? 'cd-rotate' : 'cd-rotate cd-pause'}`}>
                        <img src={item.cover} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-[#050b14] rounded-full border-4 border-white/10" />
                        </div>
                      </div>
                    )}
                    {isPressing && currentBookId === item.id && <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center animate-pulse"><div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>}
                  </div>

                  <h3 className="font-bold text-xl text-white italic line-clamp-1">{item.title}</h3>
                  <p className="text-emerald-500/60 text-[9px] font-black uppercase tracking-widest mb-4">{(item as any).author || (item as any).source}</p>

                  {activeTab === 'audios' && currentBookId === item.id && viewingFile && (
                    <div className="bg-white/5 p-4 rounded-2xl mb-4 border border-white/10 animate-in zoom-in-95 duration-300">
                      <div className="flex justify-between text-[10px] font-mono text-emerald-400 mb-2">
                        <span>{audioTimeInfo.current}</span>
                        <span>{audioTimeInfo.total}</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full mb-4 overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${audioProgress}%` }} />
                      </div>
                      <div className="flex justify-center items-center gap-6">
                        <button onClick={() => seek(-10)} className="text-white/40 hover:text-white text-xs transition-colors">-10s</button>
                        <button onClick={togglePlay} className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform">
                          {isAudioPlaying ? 'II' : '▶'}
                        </button>
                        <button onClick={() => seek(10)} className="text-white/40 hover:text-white text-xs transition-colors">+10s</button>
                        <button onClick={() => setIsLooping(!isLooping)} className={`text-xs transition-colors ${isLooping ? 'text-emerald-400' : 'text-white/20'}`}>🔁</button>
                      </div>
                    </div>
                  )}

                  <button 
                    onMouseDown={() => handleActionStart(item)}
                    onMouseUp={() => { setIsPressing(false); if(pressTimerRef.current) clearTimeout(pressTimerRef.current); }}
                    className={`w-full py-4 rounded-2xl font-black uppercase text-[9px] transition-all duration-300 ${isLocked ? 'bg-white/5 text-white/20' : 'bg-emerald-500 text-black hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]'}`}
                  >
                    {item.type === 'audio' ? (currentBookId === item.id && viewingFile ? 'En lecture' : 'Écouter') : (isLocked ? 'Verrouillé' : (currentBookId === item.id ? 'Maintenir pour ouvrir' : 'Choisir'))}
                  </button>
                </div>
              );
            })}
        </div>
      </div>

      {/* Modals et Liseuse restent identiques */}
      {confirmItem && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 backdrop-blur-md bg-[#050b14]/90 animate-in fade-in duration-300">
          <div className="bg-[#0a121e] border border-emerald-500/30 p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-xl font-black text-white mb-2 uppercase italic">{confirmItem.type === 'audio' ? 'Écouter cet audio ?' : 'Confirmer ce livre ?'}</h3>
            <p className="text-slate-400 text-[11px] mb-8 italic">{confirmItem.type === 'audio' ? 'L\'audio va démarrer maintenant.' : 'Ce choix sera verrouillé pour votre session.'}</p>
            <button onClick={confirmChoice} className="w-full py-4 bg-emerald-500 text-black font-black uppercase text-[10px] rounded-xl mb-3 hover:scale-[1.02] transition-transform">Confirmer</button>
            <button onClick={() => setConfirmItem(null)} className="w-full py-4 text-white/40 text-[10px] font-bold hover:text-white transition-colors">Annuler</button>
          </div>
        </div>
      )}

      {viewingFile && activeTab === 'reads' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 md:p-8 animate-in fade-in duration-500 bg-[#050b14]">
          <div className="relative w-full max-w-6xl h-full bg-black border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-white/5 flex flex-wrap justify-between items-center bg-white/5 gap-4">
              <div className="flex gap-2 bg-black/40 p-1 rounded-full border border-white/10">
                {['normal', 'sepia', 'night'].map(mode => (
                  <button key={mode} onClick={() => setReadMode(mode as any)} className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase transition-all ${readMode === mode ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>{mode}</button>
                ))}
              </div>
              
              <div className="flex items-center gap-4 bg-emerald-500/10 p-1 pr-4 rounded-full border border-emerald-500/20">
                <div className="flex gap-1">
                  {ambiances.map(amb => (
                    <button 
                      key={amb.id} 
                      onClick={() => setSelectedAmbiance(amb)}
                      className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase transition-all ${selectedAmbiance.id === amb.id ? 'bg-emerald-500 text-black' : 'text-emerald-500/50 hover:text-emerald-400'}`}
                    >
                      {amb.name}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 border-l border-emerald-500/20 pl-4">
                  <span className="text-[10px]">🔊</span>
                  <input 
                    type="range" 
                    min="0" max="1" step="0.01" 
                    value={volume} 
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-16 md:w-24 accent-emerald-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <button onClick={() => setViewingFile(null)} className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-6 py-2 rounded-full text-[9px] font-black uppercase transition-all">Fermer</button>
            </div>

            <div className="w-full h-full relative bg-white">
              <iframe 
                src={`https://docs.google.com/viewer?url=${window.location.origin}${viewingFile}&embedded=true`} 
                className="w-full h-full border-none" 
                style={{ filter: getFilterStyle() }} 
              />
              <div className="absolute top-0 right-0 w-24 h-24 bg-transparent z-[210]" />
              <div className="absolute inset-0 bg-transparent z-[205] pointer-events-none" />
            </div>
          </div>
        </div>
      )}

      {showAdvice && <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-black px-8 py-4 rounded-full font-black text-[10px] uppercase shadow-2xl animate-bounce">💡 Un livre à la fois pour un esprit discipliné.</div>}
    </div>
  );
}
