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
    <div className="flex flex-col h-full bg-[#F8F9FF] animate-in slide-in-from-right duration-300">
      
      {/* En-tête du Chat Style Tactique */}
      <div className="p-4 bg-white border-b border-slate-100 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2 rounded-xl">
            <Hash size={16} className="text-purple-400" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase italic text-slate-900">Canal Tactique</h3>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Unité Active</p>
            </div>
          </div>
        </div>
        <ShieldCheck size={20} className="text-slate-200" />
      </div>

      {/* Zone des Messages */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
            <div className="p-6 bg-slate-100 rounded-full">
              <Send size={32} className="text-slate-400" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">En attente de transmission...</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.user_name === myName ? 'items-end' : 'items-start'}`}
            >
              {/* Nom de l'utilisateur */}
              <span className="text-[8px] font-black text-slate-300 uppercase mb-1.5 tracking-tighter px-1">
                {msg.user_name === myName ? 'Moi (Elite)' : msg.user_name}
              </span>
              
              {/* Bulle de message */}
              <div 
                className={`max-w-[85%] p-4 rounded-[24px] text-[12px] font-bold shadow-sm leading-relaxed ${
                  msg.user_name === myName 
                    ? 'bg-black text-white rounded-br-none' 
                    : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Zone de Saisie Style Me+ */}
      <div className="p-4 bg-white border-t border-slate-100 pb-10">
        <form 
          onSubmit={onSend} 
          className="flex items-center gap-2 bg-slate-50 p-2 rounded-[24px] border border-slate-100 focus-within:border-purple-300 transition-all shadow-inner"
        >
          <input 
            type="text" 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="ÉCRIRE UNE NOTE À L'UNITÉ..."
            className="flex-1 bg-transparent p-3 text-[11px] font-bold uppercase outline-none placeholder:text-slate-300"
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            className={`p-3 rounded-full transition-all ${
              newMessage.trim() 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
                : 'bg-slate-200 text-slate-400'
            }`}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
