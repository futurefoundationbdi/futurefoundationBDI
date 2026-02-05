import React, { useState, useEffect } from 'react';

interface Message {
  id: number;
  user: string;
  text: string;
  time: string;
}

export default function SquadMode({ onBack }: { onBack: () => void }) {
  const [squadId, setSquadId] = useState<string | null>(localStorage.getItem('squad_id'));
  const [inputCode, setInputCode] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  
  // Simulation des membres (À connecter à une API plus tard)
  const [members] = useState([
    { name: "Toi", level: 5, status: "Prêt" },
    { name: "Chasseur_X", level: 3, status: "En attente" },
    { name: "Elite_Geri", level: 12, status: "Prêt" },
  ]);

  // Sauvegarde auto du squad_id
  const joinSquad = (id: string) => {
    const code = id || Math.random().toString(36).substring(2, 8).toUpperCase();
    setSquadId(code);
    localStorage.setItem('squad_id', code);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: Date.now(),
      user: "Moi",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, msg]);
    setNewMessage("");
  };

  if (!squadId) {
    return (
      <div className="flex flex-col items-center justify-center p-6 animate-in zoom-in duration-500">
        <h2 className="text-4xl font-black italic uppercase text-purple-500 mb-8">Rejoindre une Unité</h2>
        <div className="w-full max-w-sm space-y-4">
          <input 
            type="text" 
            placeholder="CODE D'ESCOUADE..." 
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl text-center font-bold outline-none focus:border-purple-500"
          />
          <button onClick={() => joinSquad(inputCode)} className="w-full py-5 bg-purple-600 text-white font-black uppercase rounded-3xl shadow-lg shadow-purple-900/40 active:scale-95 transition-all">
            Lancer l'Assaut
          </button>
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase text-white/20"><span className="bg-[#050505] px-4">Ou créer une unité</span></div>
          </div>
          <button onClick={() => joinSquad("")} className="w-full py-4 border border-purple-500/30 text-purple-400 font-black uppercase rounded-3xl hover:bg-purple-500/10 transition-all">
            Générer Nouveau Code
          </button>
        </div>
        <button onClick={onBack} className="mt-8 text-[10px] font-black uppercase tracking-widest text-white/20">Annuler</button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[80vh]">
      
      {/* GAUCHE : LISTE DES MEMBRES (3 à 6 pers) */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white/5 border border-white/10 p-6 rounded-[32px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black uppercase text-purple-400 italic">Unité : {squadId}</h3>
            <span className="text-[10px] bg-purple-500/20 px-2 py-1 rounded text-purple-300 font-bold">{members.length}/6</span>
          </div>
          <div className="space-y-3">
            {members.map((m, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${m.status === 'Prêt' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                  <div>
                    <p className="text-xs font-black uppercase">{m.name}</p>
                    <p className="text-[9px] text-white/30 font-bold uppercase">Niveau {m.level}</p>
                  </div>
                </div>
                <div className="text-[10px] font-black text-white/20 uppercase italic">{m.status}</div>
              </div>
            ))}
          </div>
        </div>
        
        <button onClick={() => {localStorage.removeItem('squad_id'); setSquadId(null);}} className="w-full py-3 text-[9px] font-black text-red-500/50 uppercase tracking-widest hover:text-red-500">
          Quitter l'Escouade
        </button>
      </div>

      {/* DROITE : CHAT INSTANTANÉ */}
      <div className="lg:col-span-8 flex flex-col bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
          <span className="text-[10px] font-black uppercase tracking-widest italic">Communication Cryogénique</span>
          <div className="flex gap-1">
             <div className="w-1 h-1 rounded-full bg-purple-500" />
             <div className="w-1 h-1 rounded-full bg-purple-500 opacity-50" />
             <div className="w-1 h-1 rounded-full bg-purple-500 opacity-20" />
          </div>
        </div>

        {/* Zone des messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {messages.length === 0 && (
            <p className="text-center text-[10px] text-white/10 uppercase mt-20 italic tracking-widest">Canal sécurisé établi. En attente de transmission...</p>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.user === 'Moi' ? 'items-end' : 'items-start'}`}>
              <div className="flex gap-2 mb-1">
                <span className="text-[9px] font-black text-purple-400 uppercase">{msg.user}</span>
                <span className="text-[9px] text-white/20 font-bold">{msg.time}</span>
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl text-xs font-medium leading-relaxed ${msg.user === 'Moi' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white/10 text-white/90 rounded-tl-none'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Chat */}
        <form onSubmit={sendMessage} className="p-4 bg-black/20 border-t border-white/5 flex gap-2">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrire un message..."
            className="flex-1 bg-white/5 border border-white/10 p-3 rounded-2xl text-xs outline-none focus:border-purple-500 transition-all"
          />
          <button type="submit" className="bg-purple-600 px-6 rounded-2xl font-black text-[10px] uppercase active:scale-90 transition-all">
            Envoyer
          </button>
        </form>
      </div>

    </div>
  );
}
