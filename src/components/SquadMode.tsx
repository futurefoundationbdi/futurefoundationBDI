import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './lib/supabaseClient';
import { Copy, Users, LogOut, UserPlus } from 'lucide-react';

const QUICK_EMOJIS = ["🔥", "💪", "🎯", "🚀", "👑", "🤝", "☕", "📍"];

interface Message {
  id: string;
  user_name: string;
  text: string;
  created_at: string;
  user_seed: string;
  squad_id: string;
}

interface Member {
  user_name: string;
  user_seed: string;
}

export default function SquadMode({ onBack }: { onBack: () => void }) {
  const [squadId, setSquadId] = useState<string | null>(localStorage.getItem('squad_id'));
  const [inputCode, setInputCode] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- LOGIQUE D'AVATAR ---
  // On récupère l'avatar. Si null, on force la création.
  const [mySoloData, setMySoloData] = useState(() => {
    const saved = localStorage.getItem('future_library_avatar');
    return saved ? JSON.parse(saved) : null;
  });

  const [tempName, setTempName] = useState("");

  // Fonction pour créer l'avatar si nouveau joueur
  const createAvatar = () => {
    if (!tempName.trim()) return;
    const newAvatar = {
      name: tempName,
      seed: tempName + Math.floor(Math.random() * 1000), // Graine aléatoire basée sur le nom
      level: 1
    };
    localStorage.setItem('future_library_avatar', JSON.stringify(newAvatar));
    setMySoloData(newAvatar);
  };

  // --- LOGIQUE SUPABASE ---

  useEffect(() => {
    if (!squadId || !mySoloData) return;

    const syncMembers = async () => {
      // S'ajouter à la liste des membres actifs
      await supabase.from('squad_members').upsert({
        squad_id: squadId,
        user_name: mySoloData.name,
        user_seed: mySoloData.seed,
        last_seen: new Date().toISOString()
      }, { onConflict: 'squad_id,user_name' });

      // Récupérer la liste des membres
      const { data } = await supabase.from('squad_members').select('user_name, user_seed').eq('squad_id', squadId);
      if (data) setMembers(data);
    };

    syncMembers();

    // Temps réel : Nouveaux membres et nouveaux messages
    const memberChannel = supabase.channel(`members_${squadId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'squad_members', filter: `squad_id=eq.${squadId}` }, syncMembers)
      .subscribe();

    const msgChannel = supabase.channel(`msgs_${squadId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `squad_id=eq.${squadId}` }, 
      (payload) => setMessages(prev => [...prev, payload.new as Message]))
      .subscribe();

    // Charger historique
    supabase.from('messages').select('*').eq('squad_id', squadId).order('created_at', { ascending: true })
      .then(({ data }) => data && setMessages(data));

    return () => {
      supabase.removeChannel(memberChannel);
      supabase.removeChannel(msgChannel);
    };
  }, [squadId, mySoloData]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // --- ACTIONS ---

  const joinSquad = async (id: string) => {
    const code = id.trim().toUpperCase() || Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Vérifier si le groupe est plein (max 6)
    const { count } = await supabase.from('squad_members').select('*', { count: 'exact', head: true }).eq('squad_id', code);
    
    if (count && count >= 6) {
      setError("UNITÉ SATURÉE (MAX 6)");
      return;
    }

    setSquadId(code);
    localStorage.setItem('squad_id', code);
    setError("");
  };

  const copyInvite = () => {
    navigator.clipboard.writeText(`Rejoins mon unité ! Code : ${squadId}`);
    alert("Code copié !");
  };

  // --- RENDU ---

  // ÉCRAN 1 : CRÉATION D'AVATAR (Si nouveau)
  if (!mySoloData) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-8 min-h-[60vh] animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black italic uppercase text-purple-500">Nouveau Chasseur</h2>
          <p className="text-[10px] text-white/40 uppercase tracking-widest">Crée ton identité avant la coalition</p>
        </div>
        <div className="w-full max-w-sm space-y-4">
          <input 
            type="text" placeholder="NOM DE CODE..." value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl text-center font-bold outline-none focus:border-purple-500 uppercase"
          />
          <button onClick={createAvatar} className="w-full py-5 bg-purple-600 text-white font-black rounded-3xl shadow-lg shadow-purple-900/40">
            INITIALISER L'AVATAR
          </button>
        </div>
      </div>
    );
  }

  // ÉCRAN 2 : REJOINDRE UNE UNITÉ
  if (!squadId) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-8 min-h-[60vh] animate-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <h2 className="text-5xl font-black italic uppercase text-purple-500">Coalition</h2>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.3em]">Unité de 3 à 6 Chasseurs</p>
        </div>
        <div className="w-full max-w-sm space-y-4">
          <input 
            type="text" placeholder="CODE D'UNITÉ..." value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl text-center font-bold outline-none focus:border-purple-500"
          />
          {error && <p className="text-red-500 text-[10px] font-bold text-center animate-pulse">{error}</p>}
          <button onClick={() => joinSquad(inputCode)} className="w-full py-5 bg-purple-600 text-white font-black rounded-3xl">
            INFILTRER
          </button>
          <button onClick={() => joinSquad("")} className="w-full py-4 border border-purple-500/30 text-purple-400 font-black rounded-3xl hover:bg-purple-500/10 transition-all">
            GÉNÉRER UNE UNITÉ
          </button>
        </div>
        <button onClick={onBack} className="text-[10px] font-black uppercase tracking-widest text-white/20">Retour au Hub</button>
      </div>
    );
  }

  // ÉCRAN 3 : INTERFACE DE GROUPE (DYNAMIQUE)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10 h-auto lg:h-[80vh] animate-in fade-in duration-700">
      
      {/* GAUCHE : MEMBRES RÉELS */}
      <div className="lg:col-span-4 space-y-4 flex flex-col">
        <div className="bg-white/5 border border-white/10 p-6 rounded-[40px] shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black uppercase text-purple-400 italic">UNITÉ: {squadId}</h3>
            <button onClick={copyInvite} className="p-2 bg-purple-500/10 rounded-full text-purple-400 hover:bg-purple-500/20 transition-all" title="Inviter des amis">
              <Copy size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Users size={12} className="text-white/20" />
              <span className="text-[9px] font-black uppercase text-white/20">Membres Actifs ({members.length}/6)</span>
            </div>
            {members.map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all">
                <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${m.user_seed}`} className="w-10 h-10 rounded-xl bg-purple-500/10 border border-white/5" alt="avatar" />
                <div className="flex-1">
                  <div className="text-[10px] font-black uppercase">
                    {m.user_name} {m.user_name === mySoloData.name && <span className="text-purple-500 ml-1">(TOI)</span>}
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: '30%' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => {localStorage.removeItem('squad_id'); setSquadId(null);}} className="text-[9px] font-black text-white/10 hover:text-red-500/50 transition-colors uppercase italic text-center py-2 flex items-center justify-center gap-2">
          <LogOut size={12} /> Quitter l'unité
        </button>
      </div>

      {/* DROITE : CHAT SOCIAL */}
      <div className="lg:col-span-8 flex flex-col bg-white/5 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 custom-scrollbar bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full opacity-10 space-y-4">
              <span className="text-4xl text-purple-500 italic font-black uppercase">Prêt ?</span>
              <p className="text-[10px] uppercase font-black tracking-[0.5em]">Liaison sécurisée établie</p>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-3 ${msg.user_name === mySoloData.name ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-2 duration-300`}>
              <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${msg.user_seed}`} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10" alt="av" />
              <div className={`flex flex-col max-w-[80%] ${msg.user_name === mySoloData.name ? 'items-end' : 'items-start'}`}>
                <span className="text-[8px] font-black text-white/20 uppercase mb-1 px-1">{msg.user_name}</span>
                <div className={`p-4 rounded-2xl text-xs shadow-xl ${
                  msg.user_name === mySoloData.name 
                    ? 'bg-purple-600 text-white rounded-br-none border border-purple-400/30' 
                    : 'bg-white/10 text-white/90 rounded-bl-none border border-white/5'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Barre de saisie */}
        <form onSubmit={(e) => {
          e.preventDefault();
          if (!newMessage.trim()) return;
          supabase.from('messages').insert([{
            squad_id: squadId,
            user_name: mySoloData.name,
            text: newMessage,
            user_seed: mySoloData.seed
          }]).then(() => setNewMessage(""));
        }} className="p-4 bg-black/60 flex gap-2 backdrop-blur-md">
          <input 
            type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
            placeholder="COORDONNER, PLANIFIER..."
            className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl text-xs font-bold outline-none focus:border-purple-500 uppercase"
          />
          <button type="submit" className="bg-purple-600 px-8 rounded-2xl font-black text-[10px] uppercase shadow-lg hover:bg-purple-500 transition-all">
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}
