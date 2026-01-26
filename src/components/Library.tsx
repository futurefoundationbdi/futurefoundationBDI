import React, { useState, useEffect } from 'react';

const contents = {
  reads: [
    { id: 1, title: "Père Riche Père Pauvre (Synthèse)", author: "Robert Kiyosaki", cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200", type: "pdf" },
    { id: 2, title: "La Psychologie de l'Argent", author: "Morgan Housel", cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=200", type: "pdf" }
  ],
  audios: [
    { id: 3, title: "Dialogue : L'Investissement", source: "NoteBookLM", duration: "12 min", audioSrc: "/audio/invest.mp3", type: "audio" },
    { id: 4, title: "Analyse : Discipline & Succès", source: "NoteBookLM", duration: "08 min", audioSrc: "/audio/discipline.mp3", type: "audio" }
  ]
};

export default function Library() {
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [activeTab, setActiveTab] = useState<'reads' | 'audios'>('reads');
  const [isPlaying, setIsPlaying] = useState(false);
  
  // NOUVEAU : Suivi du livre en cours pour éviter le zapping
  const [currentBookId, setCurrentBookId] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const savedTime = localStorage.getItem('future_library_time');
    const lastAccess = localStorage.getItem('future_library_date');
    const savedBook = localStorage.getItem('future_current_book'); // Persister le livre en cours
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

  // Fonction pour gérer l'ouverture d'un livre
  const handleAction = (id: number) => {
    if (currentBookId === null) {
      setCurrentBookId(id);
      localStorage.setItem('future_current_book', id.toString());
      setIsPlaying(true);
    } else if (currentBookId === id) {
      setIsPlaying(true);
    } else {
      // L'utilisateur essaie d'ouvrir un autre livre
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 4000);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    // Background ajusté avec un dégradé radial pour la profondeur
    <div className="relative bg-[#0f172a] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-slate-950 min-h-screen text-slate-100 p-6 font-sans overflow-hidden">
      
      {/* Alerte de Focus */}
      {showWarning && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-yellow-600 text-white px-6 py-3 rounded-full shadow-2xl border border-yellow-400 animate-bounce text-sm font-bold">
          ⚠️ Visionnaire, finissez d'abord votre lecture actuelle pour bien ancrer vos connaissances.
        </div>
      )}

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-4 relative z-10">
        <div>
          <h1 className="text-3xl font-black text-yellow-500 uppercase italic tracking-tighter">Bibliothèque 45'</h1>
          <p className="text-slate-400">La discipline est le pont entre les objectifs et l'accomplissement.</p>
        </div>
        <div className={`p-4 rounded-2xl border-2 transition-colors duration-500 ${timeLeft > 300 ? 'border-yellow-500/50' : 'border-red-500 animate-pulse'} bg-slate-900/80 backdrop-blur-md`}>
          <span className="text-xs block text-slate-500 uppercase font-bold tracking-widest">Focus Quotidien</span>
          <span className="text-3xl font-mono font-black text-yellow-500">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex gap-4 mb-8 relative z-10">
        <button onClick={() => setActiveTab('reads')} className={`px-8 py-2 rounded-xl font-bold transition-all ${activeTab === 'reads' ? 'bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)]' : 'bg-slate-800 text-slate-400'}`}>Lectures</button>
        <button onClick={() => setActiveTab('audios')} className={`px-8 py-2 rounded-xl font-bold transition-all ${activeTab === 'audios' ? 'bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)]' : 'bg-slate-800 text-slate-400'}`}>Dialogues IA</button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {timeLeft <= 0 ? (
          <div className="col-span-full py-20 text-center bg-slate-900/50 backdrop-blur-md rounded-3xl border border-dashed border-slate-700">
            <h2 className="text-5xl mb-6">🎯</h2>
            <p className="text-2xl font-bold text-yellow-500">Esprit rassasié pour aujourd'hui !</p>
            <p className="text-slate-400 mt-2">Votre cerveau traite maintenant ces informations. Revenez demain.</p>
          </div>
        ) : (
          [...contents.reads, ...contents.audios].filter(i => i.type === (activeTab === 'reads' ? 'pdf' : 'audio')).map(item => (
            <div 
              key={item.id} 
              className={`relative bg-slate-900/40 backdrop-blur-sm p-5 rounded-[2rem] border transition-all duration-300 ${currentBookId === item.id ? 'border-yellow-500 ring-1 ring-yellow-500/50 scale-[1.02]' : 'border-slate-800 opacity-80'}`}
            >
              <div className="relative">
                <img src={item.cover || 'https://via.placeholder.com/200x300'} className="w-full h-56 object-cover rounded-[1.5rem] mb-4 shadow-2xl" alt="" />
                {currentBookId === item.id && (
                  <span className="absolute top-3 right-3 bg-yellow-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">En cours</span>
                )}
              </div>
              <h3 className="font-bold text-xl leading-tight mb-1 h-14 overflow-hidden">{item.title}</h3>
              <p className="text-sm text-slate-500 mb-6">{activeTab === 'reads' ? item.author : 'NoteBookLM Deep Dive'}</p>
              
              <button 
                onMouseDown={() => handleAction(item.id)}
                onMouseUp={() => setIsPlaying(false)}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${currentBookId === item.id || currentBookId === null ? 'bg-yellow-500 text-black hover:shadow-[0_0_30px_rgba(234,179,8,0.4)]' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
              >
                {activeTab === 'reads' ? '📖 Lire (Maintenir)' : '🎧 Écouter (Maintenir)'}
              </button>
            </div>
          ))
        )}
      </div>
      
      <p className="text-center mt-16 text-slate-600 text-[10px] uppercase tracking-[0.2em] font-bold">
        Système de rétention cognitive - Future Foundation ©
      </p>
    </div>
  );
}
