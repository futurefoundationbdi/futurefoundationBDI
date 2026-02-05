import React, { useState, useEffect, useRef } from 'react';

// Configuration visuelle
const QUICK_EMOJIS = ["🔥", "💪", "🎯", "🚀", "👑", "🤝", "☕", "📍"];

const SQUAD_MISSIONS = [
  { id: 'sq1', task: "Synchronisation : 500 pompes", goal: 500, current: 120 },
  { id: 'sq2', task: "Focus : 3h de lecture", goal: 180, current: 45 },
  { id: 'sq3', task: "Endurance : 20km de marche", goal: 20, current: 8.5 }
];

interface Message {
  id: string;
  user: string;
  text: string;
  time: string;
  isMe: boolean;
  seed: string;
}

export default function SquadMode({ onBack }: { onBack: () => void }) {
  const [squadId, setSquadId] = useState<string | null>(localStorage.getItem('squad_id'));
  const [inputCode, setInputCode] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Récupération des données Solo pour l'identité dans le groupe
  const mySoloData = JSON.parse(localStorage.getItem('future_library_avatar') || '{"seed":"Aneka", "name":"Chasseur"}');

  // Simulation des membres de l'unité (3 à 6 pers)
  const [members] = useState([
    { name: "Toi", level: 5, seed: mySoloData.seed, status: "Actif", contribution: 45 },
    { name: "Chasseur_X", level: 3, seed: "Ryker", status: "En pause", contribution: 12 },
    { name: "Elite_Geri", level: 12, seed: "Grace", status: "Actif", contribution: 88 },
  ]);

  // Charger l'historique et gérer le scroll
  useEffect(() => {
    const savedChat = localStorage.getItem(`chat_history_${squadId}`);
    if (savedChat) setMessages(JSON.parse(savedChat));
  }, [squadId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const joinSquad = (id: string) => {
    const code = id || Math.random().toString(36).substring(2, 8).toUpperCase();
    setSquadId(code);
    localStorage.setItem('squad_id', code);
  };

  const handleSendMessage = (e?: React.FormEvent, textOverride?: string) => {
    if (e) e.preventDefault();
    const content = textOverride || newMessage;
    if (!content.trim()) return;

    const msg: Message = {
      id: Date.now().toString(),
      user: mySoloData.name,
      text: content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      seed: mySoloData.seed
    };

    const updated = [...messages, msg];
    setMessages(updated);
    localStorage.setItem(`chat_history_${squadId}`, JSON.stringify(updated));
    setNewMessage("");
  };

  // Fonction pour préparer le terrain des notifications Push
  const triggerAlert = () => {
    const alertMsg = "🚨 RAPPEL STRATÉGIQUE : Rassemblement de l'unité demandé !";
    handleSendMessage(undefined, alertMsg);
    // Logique Push à venir avec Supabase
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`UNITÉ ${squadId}`, { body: `${mySoloData.name} a lancé une alerte !` });
    }
  };

  if (!squadId) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-8 animate-in zoom-in duration-500 min-h-[60vh]">
        <div className="text-center space-y-2">
          <h2 className="text-5xl font-black italic uppercase text-purple-500 tracking-tighter">Coalition</h2>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Unité de 3 à 6 Chasseurs</p>
        </div>
        <div className="w-full max-w-sm space-y-4">
          <input 
            type="text" 
            placeholder="CODE D'UNITÉ..." 
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl text-center font-bold outline-none focus:border-purple-500 uppercase transition-all"
          />
          <button onClick={() => joinSquad(inputCode)} className="w-full py-5 bg-purple-600 text-white font-black uppercase rounded-3xl shadow-lg shadow-purple-900/40 active:scale-95 transition-all">
            Infiltrer
          </button>
          <button onClick={() => joinSquad("")} className="w-full py-4 border border-purple-500/30 text-purple-400 font-black uppercase rounded-3xl hover:bg-purple-500/10 transition-all">
            Générer une Unité
          </button>
        </div>
        <button onClick={onBack} className="text-[10px] font-black uppercase tracking-widest text-white/20">Retour au Hub</button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10 h-auto lg:h-[80vh] animate-in fade-in duration-700">
      
      {/* GAUCHE : ÉTAT DE L'UNITÉ */}
      <div className="lg:col-span-4 space-y-4 flex flex-col overflow-y-auto custom-scrollbar">
        <div className="bg-white/5 border border-white/10 p-6 rounded-[40px] shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black uppercase text-purple-400 italic tracking-tighter">ID: {squadId}</h3>
            <span className="text-[9px] bg-purple-500/20 px-3 py-1 rounded-full text-purple-300 font-black italic uppercase">Rang de Groupe D</span>
          </div>

          <div className="space-y-4">
            {members.map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all">
                <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${m.seed}`} className="w-10 h-10 rounded-xl bg-purple-500/10 border border-white/5" alt="avatar" />
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                    <span>{m.name}</span>
                    <span className="text-purple-400">{m.contribution} XP</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${(m.contribution / 100) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
            {members.length < 6 && (
              <div className="border-2 border-dashed border-white/5 rounded-2xl p-4 flex items-center justify-center opacity-20 hover:opacity-100 transition-all cursor-pointer group">
                <span className="text-[10px] font-black uppercase group-hover:text-purple-400">+ Recruter un membre</span>
              </div>
            )}
          </div>
        </div>

        {/* MISSIONS COLLECTIVES */}
        <div className="bg-purple-900/10 border border-purple-500/20 p-6 rounded-[40px] space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-purple-400 italic">Objectifs de Coalition</h4>
          <div className="space-y-4">
            {SQUAD_MISSIONS.map((m) => (
              <div key={m.id} className="space-y-2">
                <div className="flex justify-between text-[9px] font-bold uppercase">
                  <span className="text-white/50">{m.task}</span>
                  <span className="text-purple-400">{Math.round((m.current/m.goal)*100)}%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]" style={{ width: `${(m.current/m.goal)*100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => {localStorage.removeItem('squad_id'); setSquadId(null);}} className="text-[9px] font-black text-white/10 hover:text-red-500/50 transition-colors uppercase italic text-center py-2">
          Quitter l'unité
        </button>
      </div>

      {/* DROITE : CHAT SOCIAL & ALERTES */}
      <div className="lg:col-span-8 flex flex-col bg-white/5 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl relative">
        
        {/* Header du Chat */}
        <div className="p-5 border-b border-white/5 bg-white/5 flex justify-between items-center backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Fréquence de Coordination</span>
          </div>
          <button 
            onClick={triggerAlert}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[9px] font-black px-4 py-2 rounded-full border border-red-500/20 transition-all active:scale-95"
          >
            Lancer Rappel Push 🔔
          </button>
        </div>

        {/* Zone des messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 custom-scrollbar bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full opacity-10 space-y-4">
              <span className="text-4xl text-purple-500 italic font-black">CHAT</span>
              <p className="text-[10px] uppercase font-black tracking-[0.5em]">Liaison sécurisée établie</p>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-3 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-2 duration-300`}>
              <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${msg.seed}`} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 shadow-lg" alt="av" />
              <div className={`flex flex-col max-w-[80%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-[8px] font-black text-white/20 uppercase mb-1 px-1">{msg.user} • {msg.time}</span>
                <div className={`p-4 rounded-2xl text-xs leading-relaxed shadow-xl ${
                  msg.isMe 
                    ? 'bg-purple-600 text-white rounded-br-none border border-purple-400/30' 
                    : 'bg-white/10 text-white/90 rounded-bl-none border border-white/5'
                } ${msg.text.includes("🚨") ? 'border-red-500/50 bg-red-950/20' : ''}`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Emojis Rapides */}
        <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar bg-black/40 border-t border-white/5">
          {QUICK_EMOJIS.map(emoji => (
            <button key={emoji} onClick={() => handleSendMessage(undefined, emoji)} className="p-2 hover:bg-white/10 rounded-xl transition-all text-lg active:scale-90 flex-shrink-0">{emoji}</button>
          ))}
        </div>

        {/* Barre de saisie */}
        <form onSubmit={handleSendMessage} className="p-4 bg-black/60 flex gap-2 backdrop-blur-md">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="COORDONNER, PLANIFIER, MOTIVER..."
            className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl text-xs font-bold outline-none focus:border-purple-500 transition-all uppercase placeholder:text-white/5"
          />
          <button type="submit" className="bg-purple-600 px-8 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-purple-900/40 active:scale-95 transition-all hover:bg-purple-500">
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}
