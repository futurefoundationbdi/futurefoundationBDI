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
    // LOGIQUE 24H : On vérifie si on doit reset le chrono
    const saved = localStorage.getItem('future_library_time');
    const lastDate = localStorage.getItem('future_library_last_date');
    const now = Date.now();

    if (lastDate && now - parseInt(lastDate) > 24 * 60 * 60 * 1000) {
      localStorage.setItem('future_library_last_date', now.toString());
      return 45 * 60; // Reset à 45 min
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
    if (ambianceRef.current) ambianceRef.current.volume = volume;
  }, [volume]);

  // CHRONO : Ne s'active QUE si viewingFile est présent ET qu'on est en mode lecture
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (viewingFile && activeTab === 'reads' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          localStorage.setItem('future_library_time', newTime.toString());
          localStorage.setItem('future_library_last_date', Date.now().toString());
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [viewingFile, activeTab, timeLeft]);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && e.keyCode === 73) || (e.ctrlKey && e.keyCode === 85)) {
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
      setAudioTimeInfo({ current: formatAudioTime(current), total: formatAudioTime(total) });
    }
  };

  const formatAudioTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleActionStart = (item: any) => {
    if (item.type === 'audio') {
      setConfirmItem(item); 
      return; 
    }

    if (item.type === 'pdf') {
      if (timeLeft <= 0) return;
      // CORRECTION LOGIQUE : On vérifie si un livre PDF est déjà choisi
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
        setTimeout(() => setShowAdvice(false), 3000);
      }
    }
  };

  const confirmChoice = () => {
    if (confirmItem) {
      if (confirmItem.type === 'pdf') {
        setCurrentBookId(confirmItem.id);
        localStorage.setItem('future_library_book_id', confirmItem.id.toString());
        setViewingFile(confirmItem.fileUrl);
      } else {
        // L'audio ne bloque pas le currentBookId des livres
        setViewingFile(confirmItem.audioSrc);
      }
      setConfirmItem(null);
    }
  };

  const getFilterStyle = () => {
    if (readMode === 'sepia') return 'sepia(0.8) contrast(0.9)';
    if (readMode === 'night') return 'invert(0.9) hue-rotate(180deg)';
    return 'none';
  };

  return (
    <div id="bibliotheque" className="relative min-h-screen text-slate-100 p-6 md:p-12 font-sans bg-[#050b14] select-none overflow-x-hidden">
      <style>{`
        .cd-rotate { animation: spin 6s linear infinite; }
        .cd-pause { animation-play-state: paused; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <audio ref={ambianceRef} src={selectedAmbiance.url} loop autoPlay={!!viewingFile} />
      <audio ref={bookAudioRef} key={viewingFile} src={activeTab === 'audios' ? viewingFile || '' : ''} onTimeUpdate={updateProgress} autoPlay={activeTab === 'audios' && !!viewingFile} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header avec Chrono */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 bg-black/30 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500 uppercase italic">Future Library</h1>
            <div className="flex gap-4 mt-4 bg-white/5 p-1.5 rounded-full w-fit border border-white/5">
              <button onClick={() => setActiveTab('reads')} className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase ${activeTab === 'reads' ? 'bg-emerald-500 text-black' : 'text-white/40'}`}>📚 Livres</button>
              <button onClick={() => setActiveTab('audios')} className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase ${activeTab === 'audios' ? 'bg-emerald-500 text-black' : 'text-white/40'}`}>🎧 Audio</button>
            </div>
          </div>
          {activeTab === 'reads' && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-[1.8rem] text-center min-w-[140px]">
              <span className="text-4xl font-mono font-black text-white">{Math.floor(timeLeft / 60)}m {timeLeft % 60}s</span>
            </div>
          )}
        </div>

        {/* Grille des contenus */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...contents.reads, ...contents.audios]
            .filter(item => item.type === (activeTab === 'reads' ? 'pdf' : 'audio'))
            .map(item => {
              const isThisBookSelected = currentBookId === item.id;
              const isOtherBookLocked = activeTab === 'reads' && currentBookId !== null && !isThisBookSelected && contents.reads.some(r => r.id === currentBookId);

              return (
                <div key={item.id} className={`bg-black/40 p-6 rounded-[2.2rem] border transition-all ${isThisBookSelected ? 'border-emerald-500/40 shadow-lg' : 'border-white/5'}`}>
                  <div className="relative overflow-hidden rounded-[1.8rem] mb-6 aspect-[3/4] bg-black/20 flex items-center justify-center">
                    {item.type === 'pdf' ? (
                      <img src={item.cover} className="w-full h-full object-contain p-2" alt="" />
                    ) : (
                      <div className={`w-4/5 aspect-square rounded-full border-4 border-white/10 overflow-hidden ${isAudioPlaying && viewingFile === item.audioSrc ? 'cd-rotate' : 'cd-rotate cd-pause'}`}>
                        <img src={item.cover} className="w-full h-full object-cover" alt="" />
                      </div>
                    )}
                    {isPressing && isThisBookSelected && <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center animate-pulse"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>}
                  </div>

                  <h3 className="font-bold text-xl text-white italic truncate">{item.title}</h3>
                  <p className="text-emerald-500/60 text-[9px] font-black uppercase mb-4">{(item as any).author || (item as any).source}</p>

                  <button 
                    onMouseDown={() => handleActionStart(item)}
                    onMouseUp={() => { setIsPressing(false); if(pressTimerRef.current) clearTimeout(pressTimerRef.current); }}
                    className={`w-full py-4 rounded-2xl font-black uppercase text-[9px] transition-all ${isOtherBookLocked ? 'bg-white/5 text-white/20' : 'bg-emerald-500 text-black'}`}
                  >
                    {item.type === 'audio' ? (viewingFile === item.audioSrc ? 'En lecture' : 'Écouter') : (isOtherBookLocked ? 'Verrouillé' : (isThisBookSelected ? 'Maintenir pour ouvrir' : 'Choisir'))}
                  </button>
                </div>
              );
            })}
        </div>
      </div>

      {/* MODAL CONFIRMATION */}
      {confirmItem && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 backdrop-blur-md bg-[#050b14]/90">
          <div className="bg-[#0a121e] border border-emerald-500/30 p-8 rounded-[2.5rem] max-w-sm w-full text-center">
            <h3 className="text-xl font-black text-white mb-2 uppercase italic">Confirmer ?</h3>
            <p className="text-slate-400 text-[11px] mb-8 italic">Ce choix sera votre compagnon pour les prochaines 24h.</p>
            <button onClick={confirmChoice} className="w-full py-4 bg-emerald-500 text-black font-black uppercase text-[10px] rounded-xl mb-3">Confirmer</button>
            <button onClick={() => setConfirmItem(null)} className="w-full py-4 text-white/40 text-[10px] font-bold">Annuler</button>
          </div>
        </div>
      )}

      {/* LISEUSE PDF */}
      {viewingFile && activeTab === 'reads' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#050b14]">
          <div className="relative w-full max-w-6xl h-full bg-black border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex gap-2">
                {['normal', 'sepia', 'night'].map(mode => (
                  <button key={mode} onClick={() => setReadMode(mode as any)} className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase ${readMode === mode ? 'bg-white text-black' : 'text-white/40'}`}>{mode}</button>
                ))}
              </div>
              <button onClick={() => setViewingFile(null)} className="bg-red-500/20 text-red-500 px-6 py-2 rounded-full text-[9px] font-black uppercase">Fermer</button>
            </div>
            <iframe src={`https://docs.google.com/viewer?url=${window.location.origin}${viewingFile}&embedded=true`} className="w-full h-full" style={{ filter: getFilterStyle() }} />
          </div>
        </div>
      )}

      {showAdvice && <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-black px-8 py-4 rounded-full font-black text-[10px] uppercase shadow-2xl animate-bounce">💡 Un livre à la fois pour un esprit discipliné.</div>}
    </div>
  );
}
