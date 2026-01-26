import React, { useState, useEffect, useRef } from 'react';

const contents = {
  reads: [
    { id: 1, title: "Père Riche Père Pauvre (Synthèse)", author: "Robert Kiyosaki", cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400", type: "pdf" },
    { id: 2, title: "La Psychologie de l'Argent", author: "Morgan Housel", cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400", type: "pdf" }
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
  { id: 'travel', name: '✈️ Voyage (Zen)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
];

export default function Library() {
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [activeTab, setActiveTab] = useState<'reads' | 'audios'>('reads');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBookId, setCurrentBookId] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  
  // États pour l'ambiance sonore
  const [selectedAmbiance, setSelectedAmbiance] = useState(ambiances[0]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // Gestion de la musique d'ambiance (uniquement pour les lectures)
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && activeTab === 'reads' && selectedAmbiance.url) {
        audioRef.current.play().catch(() => console.log("Interaction requise pour le son"));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, selectedAmbiance, activeTab]);

  const handleAction = (id: number) => {
    if (timeLeft <= 0) return;
    if (currentBookId === null || currentBookId === id) {
      setCurrentBookId(id);
      setIsPlaying(true);
    } else {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <div id="bibliotheque" className="relative min-h-screen text-slate-100 p-6 md:p-12 font-sans overflow-hidden bg-black">
      
      {/* --- DÉCORATION : LA GRILLE DORÉE EN MOUVEMENT --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            backgroundImage: `linear-gradient(to right, #eab308 1px, transparent 1px), linear-gradient(to bottom, #eab308 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            transform: 'perspective(500px) rotateX(60deg) translateY(-100px)',
            maskImage: 'linear-gradient(to bottom, transparent, black)'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
      </div>

      <audio ref={audioRef} src={selectedAmbiance.url} loop />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 uppercase italic tracking-tighter mb-2">
              Espace de Lecture
            </h1>
            <p className="text-yellow-500/80 font-bold tracking-[0.4em] uppercase text-[10px]">
              Franchissez le seuil de la connaissance
            </p>
          </div>

          <div className="bg-yellow-600/5 border border-yellow-500/30 p-6 rounded-[2rem] backdrop-blur-xl shadow-[0_0_50px_rgba(234,179,8,0.1)]">
            <span className="text-[10px] block text-yellow-500/70 font-black uppercase tracking-widest mb-1 text-center">Temps de Focus</span>
            <span className="text-5xl font-mono font-black text-white">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* --- SÉLECTEUR D'AMBIANCE (Uniquement Lectures) --- */}
        {activeTab === 'reads' && (
          <div className="mb-12 flex flex-col items-center animate-in fade-in zoom-in duration-700">
            <span className="text-yellow-500/50 text-[9px] font-black uppercase tracking-[0.3em] mb-4 italic">
              ✨ Meilleure expérience avec des écouteurs
            </span>
            <div className="flex flex-wrap justify-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
              {ambiances.map((amb) => (
                <button
                  key={amb.id}
                  onClick={() => setSelectedAmbiance(amb)}
                  className={`px-5 py-2 rounded-xl text-[11px] font-bold transition-all ${selectedAmbiance.id === amb.id ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30' : 'hover:bg-white/10 text-slate-400'}`}
                >
                  {amb.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-16 justify-center">
          <button 
            onClick={() => setActiveTab('reads')} 
            className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'reads' ? 'bg-yellow-500 text-black shadow-[0_0_40px_rgba(234,179,8,0.3)]' : 'bg-white/5 text-slate-500 border border-white/5'}`}
          >
            📖 Lectures
          </button>
          <button 
            onClick={() => setActiveTab('audios')} 
            className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'audios' ? 'bg-yellow-500 text-black shadow-[0_0_40px_rgba(234,179,8,0.3)]' : 'bg-white/5 text-slate-500 border border-white/5'}`}
          >
            🎙️ Livres Audio
          </button>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {timeLeft <= 0 ? (
            <div className="col-span-full py-24 text-center border border-yellow-500/20 rounded-[3rem] bg-yellow-500/5 backdrop-blur-md">
              <p className="text-3xl font-black text-yellow-500 uppercase italic mb-2">Esprit saturé</p>
              <p className="text-slate-400 font-medium">Revenez dans 24h pour franchir à nouveau le seuil.</p>
            </div>
          ) : (
            [...contents.reads, ...contents.audios]
              .filter(item => item.type === (activeTab === 'reads' ? 'pdf' : 'audio'))
              .map(item => (
                <div key={item.id} className={`group relative bg-gradient-to-b from-white/5 to-transparent p-6 rounded-[2.5rem] border transition-all duration-700 ${currentBookId === item.id ? 'border-yellow-500 shadow-2xl shadow-yellow-500/20' : 'border-white/10 opacity-70 hover:opacity-100'}`}>
                  <div className="relative overflow-hidden rounded-[2rem] mb-6 aspect-[4/5] shadow-2xl">
                    <img src={item.cover} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2000ms]" alt="" />
                    {currentBookId === item.id && (
                      <div className="absolute inset-0 bg-yellow-500/10 backdrop-blur-[3px] flex items-center justify-center">
                         <div className="flex flex-col items-center gap-3">
                           <div className="w-12 h-12 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                           <span className="text-yellow-500 font-black text-[9px] uppercase tracking-[0.3em] bg-black px-4 py-2 rounded-full">Immersion Active</span>
                         </div>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-white italic group-hover:text-yellow-500 transition-colors">{item.title}</h3>
                  <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-8">
                    {activeTab === 'reads' ? (item as any).author : 'NoteBookLM Original'}
                  </p>
                  <button 
                    onMouseDown={() => handleAction(item.id)}
                    onMouseUp={() => setIsPlaying(false)}
                    onMouseLeave={() => setIsPlaying(false)}
                    onTouchStart={() => handleAction(item.id)}
                    onTouchEnd={() => setIsPlaying(false)}
                    className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all bg-white text-black hover:bg-yellow-500 hover:shadow-xl active:scale-95"
                  >
                    {activeTab === 'reads' ? 'Maintenir pour Lire' : 'Maintenir pour Écouter'}
                  </button>
                </div>
              ))
          )}
        </div>
        
        <p className="text-center mt-32 text-yellow-500/20 text-[9px] uppercase tracking-[0.6em] font-black">
          The Future Foundation • Sanctuaire Digital
        </p>
      </div>

      {showWarning && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          ⚠️ Terminez d'abord votre immersion en cours
        </div>
      )}
    </div>
  );
}
