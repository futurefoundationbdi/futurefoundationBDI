import React, { useState, useEffect, useRef } from 'react';

const contents = {
  reads: [
    { id: 1, title: "Père Riche Père Pauvre (Synthèse)", author: "Robert Kiyosaki", cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400", fileUrl: "/books/pere-riche.pdf", type: "pdf" },
    { id: 2, title: "La Psychologie de l'Argent", author: "Morgan Housel", cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400", fileUrl: "/books/psychologie-argent.pdf", type: "pdf" },
    { id: 5, title: "L'Homme le plus riche de Babylone", author: "George S. Clason", cover: "/covers/riche.webp", fileUrl: "/books/homme-riche.pdf.pdf", type: "pdf" },
    { id: 6, title: "Réfléchissez et devenez riche", author: "Napoleon Hill", cover: "https://images.unsplash.com/photo-1592492159418-39f319320569?w=400", fileUrl: "/books/napoleon-hill.pdf", type: "pdf" }
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
  const [showWarning, setShowWarning] = useState(false);
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedTime = localStorage.getItem('future_library_time');
    const today = new Date().toDateString();
    if (localStorage.getItem('future_library_date') !== today) {
      localStorage.setItem('future_library_time', (45 * 60).toString());
      localStorage.setItem('future_library_date', today);
      setTimeLeft(45 * 60);
    } else if (savedTime) {
      setTimeLeft(parseInt(savedTime));
    }
  }, []);

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

      // Si c'est un PDF, on déclenche l'ouverture après 2 secondes de maintien
      if (item.type === 'pdf') {
        pressTimerRef.current = setTimeout(() => {
          setViewingFile(item.fileUrl);
          setIsPlaying(false);
        }, 2000);
      }
    } else {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
    }
  };

  const handleActionEnd = () => {
    setIsPlaying(false);
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <div id="bibliotheque" className="relative min-h-screen text-slate-100 p-6 md:p-12 font-sans overflow-hidden bg-[#050b14]">
      
      {/* --- FOND GLOWING SKY --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[70%] bg-emerald-500/15 blur-[120px] rounded-full animate-pulse duration-[10s] opacity-50 shadow-[inset_0_0_100px_rgba(16,185,129,0.2)]"></div>
        <div className="absolute top-[10%] right-[-20%] w-[100%] h-[60%] bg-cyan-500/10 blur-[100px] rounded-full animate-pulse duration-[15s] opacity-30"></div>
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      </div>

      <audio ref={audioRef} src={selectedAmbiance.url} loop />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 bg-black/30 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-white to-emerald-400 uppercase italic tracking-tighter mb-2">
              Espace de Lecture
            </h1>
            <p className="text-emerald-400/70 font-black tracking-[0.4em] uppercase text-[10px]">
              La dimension du focus profond
            </p>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-[1.8rem] text-center min-w-[160px]">
            <span className="text-[9px] block text-emerald-400 uppercase font-black tracking-widest mb-1">Concentration</span>
            <span className="text-4xl font-mono font-black text-white">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Ambiance et Mode */}
        <div className="flex flex-col items-center gap-8 mb-12">
            {activeTab === 'reads' && (
              <div className="flex flex-col items-center animate-in fade-in slide-in-from-top-4">
                <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] mb-3 italic">✨ Ouverture après 2s de focus</span>
                <div className="flex gap-2 bg-black/40 p-1.5 rounded-full border border-white/5 backdrop-blur-md">
                  {ambiances.map((amb) => (
                    <button
                      key={amb.id}
                      onClick={() => setSelectedAmbiance(amb)}
                      className={`px-5 py-2 rounded-full text-[10px] font-bold transition-all ${selectedAmbiance.id === amb.id ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-white'}`}
                    >
                      {amb.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 p-1.5 bg-white/5 rounded-2xl border border-white/10">
                <button onClick={() => setActiveTab('reads')} className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${activeTab === 'reads' ? 'bg-white text-black' : 'text-slate-500 hover:text-white'}`}>📖 Lectures</button>
                <button onClick={() => setActiveTab('audios')} className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${activeTab === 'audios' ? 'bg-white text-black' : 'text-slate-500 hover:text-white'}`}>🎙️ Livres Audio</button>
            </div>
        </div>

        {/* Grille */}
        <div className="relative group/grid">
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-x-auto md:overflow-visible pb-12 md:pb-0 snap-x snap-mandatory custom-scrollbar">
            {timeLeft <= 0 ? (
              <div className="w-full col-span-full py-24 text-center border border-emerald-500/20 rounded-[3rem] bg-black/40">
                <p className="text-2xl font-black text-emerald-500 uppercase italic mb-2">Portail Clos</p>
              </div>
            ) : (
              [...contents.reads, ...contents.audios]
                .filter(item => item.type === (activeTab === 'reads' ? 'pdf' : 'audio'))
                .map(item => (
                  <div key={item.id} className="min-w-[85vw] sm:min-w-[45vw] md:min-w-0 snap-center group relative bg-black/40 backdrop-blur-md p-6 rounded-[2.2rem] border transition-all duration-500 border-white/5 opacity-80 hover:opacity-100 hover:border-white/20">
                    <div className="relative overflow-hidden rounded-[1.8rem] mb-6 aspect-[4/5] shadow-2xl">
                      <img src={item.cover} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1500ms]" alt="" />
                      {currentBookId === item.id && isPlaying && (
                        <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[4px] flex flex-col items-center justify-center animate-pulse">
                           <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                           <span className="text-[10px] font-black uppercase text-white tracking-widest">Immersion...</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-white italic group-hover:text-emerald-400 line-clamp-1">{item.title}</h3>
                    <p className="text-slate-500 font-black text-[9px] uppercase tracking-widest mb-8 border-l border-emerald-500/40 pl-3">
                      {activeTab === 'reads' ? (item as any).author : 'NoteBookLM Original'}
                    </p>
                    <button 
                      onMouseDown={() => handleActionStart(item)}
                      onMouseUp={handleActionEnd}
                      onMouseLeave={handleActionEnd}
                      onTouchStart={() => handleActionStart(item)}
                      onTouchEnd={handleActionEnd}
                      className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[9px] transition-all bg-emerald-500 text-black hover:bg-white active:scale-95 shadow-lg"
                    >
                      {activeTab === 'reads' ? 'Maintenir pour Lire' : 'Maintenir pour Écouter'}
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* --- LECTEUR IMMERSIF (MODAL) --- */}
      {viewingFile && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-10 animate-in fade-in zoom-in duration-500">
          <div className="absolute inset-0 bg-[#050b14]/90 backdrop-blur-2xl" onClick={() => setViewingFile(null)} />
          <div className="relative w-full max-w-5xl h-[90vh] bg-black/40 border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(16,185,129,0.1)]">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 animate-pulse">Lecture Immersive Active</span>
              <button onClick={() => setViewingFile(null)} className="bg-emerald-500 text-black px-6 py-2 rounded-full text-[10px] font-black hover:bg-white transition-colors uppercase tracking-widest">Fermer</button>
            </div>
            {/* Lecteur optimisé avec paramètres d'affichage direct */}
            <iframe 
              src={`${viewingFile}#toolbar=0&navpanes=0&view=FitH`} 
              className="w-full h-full border-none" 
              title="Lecteur"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {showWarning && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] bg-red-600/90 backdrop-blur-md text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest animate-in fade-in zoom-in duration-300">
          ⚠️ Terminez d'abord votre immersion en cours
        </div>
      )}

      <style>{`
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        @media (max-width: 768px) { .custom-scrollbar { scrollbar-width: none; } .custom-scrollbar::-webkit-scrollbar { display: none; } }
      `}</style>
    </div>
  );
}
