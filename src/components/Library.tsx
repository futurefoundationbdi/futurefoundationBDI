import React, { useState, useEffect } from 'react';

// Simulation de données (à remplacer par tes vrais fichiers)
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
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [activeTab, setActiveTab] = useState<'reads' | 'audios'>('reads');
  const [isPlaying, setIsPlaying] = useState(false);

  // Gestion du chrono (sauvegarde dans le localStorage pour persister si on ferme la page)
  useEffect(() => {
    const savedTime = localStorage.getItem('future_library_time');
    const lastAccess = localStorage.getItem('future_library_date');
    const today = new Date().toDateString();

    // Réinitialisation toutes les 24h
    if (lastAccess !== today) {
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

  const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 p-6 font-sans">
      {/* Header & Chrono */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-yellow-500 uppercase italic">Bibliothèque 45'</h1>
          <p className="text-slate-400">Votre quota quotidien de sagesse financière.</p>
        </div>
        <div className={`p-4 rounded-2xl border-2 ${timeLeft > 300 ? 'border-green-500' : 'border-red-500 animate-pulse'} bg-slate-900`}>
          <span className="text-xs block text-slate-500 uppercase font-bold">Temps Restant</span>
          <span className="text-3xl font-mono font-black">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto flex gap-4 mb-8">
        <button onClick={() => setActiveTab('reads')} className={`px-6 py-2 rounded-full font-bold transition ${activeTab === 'reads' ? 'bg-yellow-500 text-black' : 'bg-slate-800'}`}>Lectures</button>
        <button onClick={() => setActiveTab('audios')} className={`px-6 py-2 rounded-full font-bold transition ${activeTab === 'audios' ? 'bg-yellow-500 text-black' : 'bg-slate-800'}`}>Audio (IA Dialogues)</button>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {timeLeft <= 0 ? (
          <div className="col-span-full py-20 text-center bg-slate-900 rounded-3xl border border-dashed border-slate-700">
            <h2 className="text-4xl mb-4">⌛</h2>
            <p className="text-xl font-bold">Quota épuisé !</p>
            <p className="text-slate-400">Revenez demain pour 45 nouvelles minutes de savoir.</p>
          </div>
        ) : (
          contents[activeTab].map(item => (
            <div key={item.id} className="bg-slate-900 p-4 rounded-3xl border border-slate-800 hover:border-yellow-500 transition group">
              <img src={item.cover || 'https://via.placeholder.com/200x300'} className="w-full h-48 object-cover rounded-2xl mb-4 shadow-lg" alt="" />
              <h3 className="font-bold text-lg leading-tight mb-1">{item.title}</h3>
              <p className="text-sm text-slate-500 mb-4">{activeTab === 'reads' ? item.author : item.source}</p>
              <button 
                onMouseDown={() => setIsPlaying(true)}
                onMouseUp={() => setIsPlaying(false)}
                className="w-full py-3 bg-slate-800 group-hover:bg-yellow-500 group-hover:text-black rounded-xl font-bold transition flex items-center justify-center gap-2"
              >
                {activeTab === 'reads' ? '📖 Lire (Maintenir)' : '🎧 Écouter (Maintenir)'}
              </button>
            </div>
          ))
        )}
      </div>
      
      <p className="text-center mt-12 text-slate-600 text-xs">Note : Le chronomètre tourne uniquement pendant la consultation active.</p>
    </div>
  );
}
