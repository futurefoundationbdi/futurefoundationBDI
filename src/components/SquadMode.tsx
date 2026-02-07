import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Users, Send, ShieldCheck } from 'lucide-react';

// Import des sous-composants que tu as créés
import { SquadJoin } from './squad/SquadJoin';
import { SquadContract } from './squad/SquadContract';
import { SquadChat } from './squad/SquadChat';

const QUICK_EMOJIS = ["🔥", "💪", "🎯", "🚀", "👑", "🤝", "☕", "📍"];

interface Member {
  user_name: string;
  user_seed: string;
}

export default function SquadMode({ onBack }: { onBack: () => void }) {
  const [squadId, setSquadId] = useState<string | null>(localStorage.getItem('squad_id'));
  const [isContractSigned, setIsContractSigned] = useState(localStorage.getItem('squad_signed') === 'true');
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [members, setMembers] = useState<Member[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showChat, setShowChat] = useState(false);

  // Récupération des données Solo
  const mySoloData = (() => {
    const saved = localStorage.getItem('future_library_avatar');
    return saved ? JSON.parse(saved) : null;
  })();

  // 1. PROTECTION : AVATAR OBLIGATOIRE
  if (!mySoloData) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center space-y-6 min-h-[60vh]">
        <ShieldCheck size={64} className="text-purple-500 opacity-20" />
        <h2 className="text-2xl font-black uppercase italic text-white">Accès Refusé</h2>
        <p className="text-xs text-white/50 max-w-xs uppercase leading-relaxed">
          Tu dois d'abord éveiller ton monarque en mode <span className="text-purple-500">Solo</span> avant de rejoindre une unité d'élite.
        </p>
        <button onClick={onBack} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white">
          Retourner au Hub
        </button>
      </div>
    );
  }

  // 2. LOGIQUE D'ENTRÉE / CRÉATION
  const handleJoin = async (id: string, isNew: boolean) => {
    setError("");
    setIsLoading(true);
    const code = id.trim().toUpperCase();

    if (!isNew && !code) {
      setError("ENTREZ UN CODE D'UNITÉ");
      setIsLoading(false);
      return;
    }

    const finalCode = isNew ? Math.random().toString(36).substring(2, 8).toUpperCase() : code;

    // Vérification de l'existence si infiltration
    if (!isNew) {
      const { data: existingGroup } = await supabase
        .from('squad_members')
        .select('squad_id')
        .eq('squad_id', finalCode)
        .limit(1);

      if (!existingGroup || existingGroup.length === 0) {
        setError("CODE D'UNITÉ INVALIDE OU INEXISTANT");
        setIsLoading(false);
        return;
      }
    }

    setSquadId(finalCode);
    localStorage.setItem('squad_id', finalCode);
    setIsLoading(false);
  };

  // 3. SYNCHRO TEMPS RÉEL
  useEffect(() => {
    if (!squadId || !mySoloData) return;

    const fetchMembers = async () => {
      const { data } = await supabase.from('squad_members').select('user_name, user_seed').eq('squad_id', squadId);
      if (data) setMembers(data);
    };

    const setupUser = async () => {
      // Nettoyage des anciennes sessions
      await supabase.from('squad_members').delete().eq('user_name', mySoloData.name);
      // Insertion nouvelle session
      await supabase.from('squad_members').insert({
        squad_id: squadId,
        user_name: mySoloData.name,
        user_seed: mySoloData.seed,
        last_seen: new Date().toISOString()
      });
      fetchMembers();
      
      // Charger les messages existants
      const { data: msgs } = await supabase.from('messages').select('*').eq('squad_id', squadId).order('created_at', { ascending: true });
      if (msgs) setMessages(msgs);
    };

    setupUser();

    const channel = supabase.channel(`squad_${squadId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'squad_members', filter: `squad_id=eq.${squadId}` }, () => fetchMembers())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `squad_id=eq.${squadId}` }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [squadId, mySoloData.name]);

  // 4. ENVOI DE MESSAGE
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !squadId) return;

    const { error } = await supabase.from('messages').insert([{
      squad_id: squadId,
      user_name: mySoloData.name,
      text: newMessage.toUpperCase(), // Forçage Majuscules
      user_seed: mySoloData.seed
    }]);

    if (!error) setNewMessage("");
  };

  // --- RENDU CONDITIONNEL ---

  // Étape 1 : Rejoindre ou Créer
  if (!squadId) {
    return <SquadJoin inputCode={inputCode} setInputCode={setInputCode} onJoin={handleJoin} isLoading={isLoading} error={error} onBack={onBack} />;
  }

  // Étape 2 : Signature du Contrat
  if (!isContractSigned) {
    return <SquadContract squadId={squadId} onSign={() => { setIsContractSigned(true); localStorage.setItem('squad_signed', 'true'); }} />;
  }

  // Étape 3 : Dashboard de l'Unité
  return (
    <div className="relative min-h-[80vh] px-4 animate-in fade-in duration-700">
      {/* HEADER STATS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xs font-black text-purple-500 uppercase italic tracking-widest">Unité Opérationnelle</h2>
          <div className="flex items-center gap-3">
             <span className="text-4xl font-black text-white italic">{squadId}</span>
             <button onClick={() => {
               const url = `https://wa.me/?text=Rejoins mon unité d'élite sur Future Library ! Code : ${squadId}`;
               window.open(url, '_blank');
             }} className="p-2 bg-green-500/10 text-green-500 rounded-full hover:bg-green-500/20 transition-all">
               <Send size={16} />
             </button>
          </div>
        </div>
        
        <button onClick={() => {
            localStorage.removeItem('squad_id');
            localStorage.removeItem('squad_signed');
            setSquadId(null);
            setIsContractSigned(false);
          }} className="text-[10px] font-black text-white/20 hover:text-red-500 uppercase transition-colors">
          Quitter l'unité
        </button>
      </div>

      {/* GRID DES MEMBRES */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-20">
        {members.map((m, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-3xl flex flex-col items-center text-center space-y-3 relative overflow-hidden group">
            <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_green]"></div>
            <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${m.user_seed}`} className="w-16 h-16 md:w-20 md:h-20" alt="av" />
            <div>
              <p className="text-[10px] font-black text-white uppercase truncate w-full italic">{m.user_name}</p>
              <p className="text-[8px] font-bold text-purple-400 uppercase tracking-tighter">LVL ??</p>
            </div>
          </div>
        ))}
        {/* Slots vides */}
        {[...Array(Math.max(0, 6 - members.length))].map((_, i) => (
          <div key={i} className="border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center p-8 opacity-10">
            <Users size={20} className="text-white" />
          </div>
        ))}
      </div>

      {/* SYSTÈME DE CHAT (Sous-composant) */}
      <SquadChat 
        showChat={showChat} 
        setShowChat={setShowChat} 
        messages={messages} 
        newMessage={newMessage} 
        setNewMessage={setNewMessage} 
        onSend={sendMessage} 
        myName={mySoloData.name}
        quickEmojis={QUICK_EMOJIS}
      />
    </div>
  );
}
