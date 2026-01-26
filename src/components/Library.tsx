import React, { useState, useEffect } from 'react';

// Données de la bibliothèque
const contents = {
  reads: [
    { id: 1, title: "Père Riche Père Pauvre (Synthèse)", author: "Robert Kiyosaki", cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400", type: "pdf" },
    { id: 2, title: "La Psychologie de l'Argent", author: "Morgan Housel", cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400", type: "pdf" }
  ],
  audios: [
    { id: 3, title: "Dialogue : L'Investissement", source: "NoteBookLM", duration: "12 min", audioSrc: "/audio/invest.mp3", type: "audio" },
    { id: 4, title: "Analyse : Discipline & Succès", source: "NoteBookLM", duration: "08 min", audioSrc: "/audio/discipline.mp3", type: "audio" }
  ]
};

export default function Library() {
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [activeTab, setActiveTab] = useState<'reads' | 'audios'>('reads');
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Système anti-zapping
  const [currentBookId, setCurrentBookId] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  // Initialisation et vérification des 24h
  useEffect(() => {
    const savedTime = localStorage.getItem('future_library_time');
    const lastAccess = localStorage.getItem('future_library_date');
    const savedBook = localStorage.getItem('future_current_book');
    const today = new Date().toDateString();

    if (lastAccess !== today) {
      localStorage.setItem('future_library_time', (45 * 60).toString());
      localStorage.setItem('future_library_date', today);
      localStorage.removeItem('future_current_book');
      setTimeLeft(45 * 60);
    } else {
      if (savedTime) setTimeLeft(parseInt(savedTime));
      if (savedBook) setCurrentBookId(parseInt(savedBook));
    }
  }, []);

  // Chronomètre actif uniquement pendant la lecture/écoute
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
    } else if (timeLeft <= 0) {
      setIsPlaying(false);
    }
  }, [isPlaying, timeLeft]);

  // Gestion de l'action de lecture (avec blocage si un autre livre est commencé)
  const handleAction = (id: number) => {
    if (timeLeft <= 0) return;

    if (currentBookId === null) {
      setCurrentBookId(id);
      localStorage.setItem('future_current_book', id.toString());
      setIsPlaying(true);
    } else if (currentBookId === id) {
      setIsPlaying(true);
    } else {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 4000);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <div className="relative min-h-screen text-slate-100 p-6 font-sans overflow-hidden bg-[#020617]">
      
      {/* Background stylisé (Blobs de lumière) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Alerte Anti-Zapping */}
      {showWarning && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#eab308] text-[#020617] px-8 py-4 rounded-2xl shadow-[0_20px_50px_rgba(234,179,8,0.3)] border border-yellow-300 animate-in fade-in zoom-in duration-300 text-sm font-black uppercase tracking-tight text-center">
          ⚠️ Visionnaire, finissez d'abord votre lecture actuelle.
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
          <div>
            <h1 className="text-4xl font-black text-yellow-500 uppercase italic tracking-tighter mb-2">
              Bibliothèque 45'
            </h1>
            <p className="text-slate-400 font-medium">
              "La discipline est le pont entre les objectifs et l'accomplissement."
            </p>
          </div>
          
          <div className={`relative p-1 rounded-3xl bg-gradient-to-br ${timeLeft > 300 ? 'from-yellow-500 to-yellow-700' : 'from-red-500 to-red-700'}`}>
              <div className="bg-[#0f172a] px-8 py-4 rounded-[1.4rem] text-center min-w-[160px]">
                  <span className="text-[10px] block text-slate-500 uppercase font-black tracking-[0.2em] mb-1">Focus Quotidien</span>
                  <span className="text-4xl font-mono font-black text-white">{formatTime(timeLeft)}</span>
              </div>
          </div>
        </div>

        {/* Onglets de navigation */}
        <div className="flex gap-2 mb-10 bg-slate-900/50 p-1.5 rounded-2xl w-fit border border-white/5">
          <button 
            onClick={() => setActiveTab('reads')} 
            className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'reads' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-slate-400 hover:text-white'}`}
          >
            Lectures
          </button>
          <button 
            onClick={() => setActiveTab('audios')} 
            className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'audios' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-slate-400 hover:text-white'}`}
          >
            Dialogues IA
          </button>
        </div>

        {/* Grille de livres */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {timeLeft <= 0 ? (
            <div className="col-span-full py-24 text-center bg-slate-900/40 backdrop-blur-md rounded-[3rem] border border-dashed border-slate-700">
              <h2 className="text-6xl mb-6">🎯</h2>
              <p className="text-2xl font-bold text-yellow-500">Esprit rassasié pour aujourd'hui !</p>
              <p className="text-slate-400 mt-2">Votre cerveau traite ces informations. Revenez dans 24h.</p>
            </div>
          ) : (
            [...contents.reads, ...contents.audios]
              .filter(item => item.type === (activeTab === 'reads' ? 'pdf' : 'audio'))
              .map(item => (
                <div 
                  key={item.id} 
                  className={`group relative bg-slate-900/40 backdrop-blur-sm p-5 rounded-[2.5rem] border transition-all duration-500 ${currentBookId === item.id ? 'border-yellow-500 ring-4 ring-yellow-500/10' : 'border-white/5 opacity-80'}`}
                >
                  <div className="relative overflow-hidden rounded-[2rem] mb-6 shadow-2xl">
                    <img 
                      src={item.cover || 'https://via.placeholder.com/400x600'} 
                      className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700" 
                      alt={item.title} 
                    />
                    {currentBookId === item.id && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-yellow-500 text-black text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter">Lecture en cours</span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-xl leading-tight mb-2 h-14 overflow-hidden">{item.title}</h3>
                  <p className="text-sm text-slate-500 mb-8 uppercase tracking-widest font-semibold">
                    {activeTab === 'reads' ? (item as any).author : 'NoteBookLM Deep Dive'}
                  </p>
                  
                  <button 
                    onMouseDown={() => handleAction(item.id)}
                    onMouseUp={() => setIsPlaying(false)}
                    onMouseLeave={() => setIsPlaying(false)}
                    className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.15em] text-xs transition-all duration-300 ${
                      currentBookId === item.id || currentBookId === null 
                      ? 'bg-yellow-500 text-black hover:shadow-[0_0_40px_rgba(234,179,8,0.4)] hover:-translate-y-1' 
                      : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                    }`}
                  >
                    {activeTab === 'reads' ? '📖 Lire (Maintenir)' : '🎧 Écouter (Maintenir)'}
                  </button>
                </div>
              ))
          )}
        </div>
        
        <p className="text-center mt-20 text-slate-600 text-[10px] uppercase tracking-[0.3em] font-black">
          Système de Rétention Cognitive • The Future Foundation
        </p>
      </div>
    </div>
  );
}
