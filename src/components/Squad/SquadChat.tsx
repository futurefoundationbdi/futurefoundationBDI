import React, { useRef, useEffect } from 'react';
import { Send, Hash, ShieldCheck } from 'lucide-react';

interface ChatProps {
  messages: any[];
  newMessage: string;
  setNewMessage: (val: string) => void;
  onSend: (e: React.FormEvent) => void;
  myName: string;
}

export const SquadChat = ({ messages, newMessage, setNewMessage, onSend, myName }: ChatProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-black animate-in slide-in-from-right duration-300">
      
      {/* En-tête du Chat Style Opérations Spéciales */}
      <div className="p-4 bg-[#0A0A0A] border-b border-white/5 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-purple-900/20 p-2 rounded-xl border border-purple-500/30">
            <Hash size={16} className="text-purple-500" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase italic text-white tracking-widest">Canal Tactique</h3>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.8)]"></span>
              <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Liaison Établie</p>
            </div>
          </div>
        </div>
        <ShieldCheck size={20} className="text-white/10" />
      </div>

      {/* Zone des Messages (Dark Mode) */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
        style={{ scrollbarWidth: 'none' }}
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20">
            <div className="p-6 bg-white/5 rounded-full border border-white/5">
              <Send size={32} className="text-white" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Cryptage activé. En attente de transmission...</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.user_name === myName ? 'items-end' : 'items-start'}`}
            >
              {/* Nom de l'utilisateur avec accent violet */}
              <span className={`text-[8px] font-black uppercase mb-1.5 tracking-widest px-1 ${
                msg.user_name === myName ? 'text-purple-500' : 'text-white/40'
              }`}>
                {msg.user_name === myName ? 'VOUS (UNITÉ 01)' : msg.user_name}
              </span>
              
              {/* Bulle de message Tactique */}
              <div 
                className={`max-w-[85%] p-4 rounded-[24px] text-[12px] font-bold shadow-2xl leading-relaxed italic ${
                  msg.user_name === myName 
                    ? 'bg-purple-600 text-white rounded-br-none border border-purple-400/50 shadow-purple-900/20' 
                    : 'bg-white/5 text-white/90 rounded-bl-none border border-white/10'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Zone de Saisie Dark */}
      <div className="p-4 bg-[#0A0A0A] border-t border-white/5 pb-10">
        <form 
          onSubmit={onSend} 
          className="flex items-center gap-2 bg-white/5 p-2 rounded-[24px] border border-white/10 focus-within:border-purple-500/50 transition-all"
        >
          <input 
            type="text" 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="TRANSMETTRE UNE INFORMATION..."
            className="flex-1 bg-transparent p-3 text-[11px] font-black uppercase outline-none placeholder:text-white/10 text-white tracking-widest"
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            className={`p-3 rounded-full transition-all ${
              newMessage.trim() 
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:scale-105 active:scale-95' 
                : 'bg-white/5 text-white/20'
            }`}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
