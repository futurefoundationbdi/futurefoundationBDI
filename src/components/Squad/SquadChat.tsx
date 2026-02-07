import React, { useRef, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react';

interface ChatProps {
  showChat: boolean;
  setShowChat: (val: boolean) => void;
  messages: any[];
  newMessage: string;
  setNewMessage: (val: string) => void;
  onSend: (e: React.FormEvent) => void;
  myName: string;
  quickEmojis: string[];
}

export const SquadChat = ({ showChat, setShowChat, messages, newMessage, setNewMessage, onSend, myName, quickEmojis }: ChatProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, showChat]);

  return (
    <div className={`fixed bottom-0 right-0 md:right-10 w-full md:w-[400px] h-[500px] bg-black border-t md:border-x border-purple-500/30 rounded-t-[32px] transition-all duration-500 z-50 shadow-2xl ${showChat ? 'translate-y-0' : 'translate-y-[440px]'}`}>
      <button onClick={() => setShowChat(!showChat)} className="w-full p-4 flex justify-between items-center bg-purple-900/20 rounded-t-[32px]">
        <div className="flex items-center gap-3">
          <MessageSquare size={18} className="text-purple-500" />
          <span className="text-[10px] font-black uppercase italic text-white">Canal de Communication</span>
        </div>
        <div className="bg-purple-600 text-[10px] px-2 py-0.5 rounded-full font-black text-white">{messages.length}</div>
      </button>

      <div className="flex flex-col h-[440px]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.user_name === myName ? 'items-end' : 'items-start'}`}>
              <span className="text-[8px] font-black text-white/20 uppercase mb-1">{msg.user_name}</span>
              <div className={`p-3 rounded-2xl text-[11px] font-bold uppercase ${msg.user_name === myName ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white/10 text-white rounded-bl-none'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={onSend} className="p-4 bg-white/5 flex gap-2">
          <input 
            type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
            placeholder="MESSAGE..."
            className="flex-1 bg-black border border-white/10 p-3 rounded-xl text-[10px] font-black uppercase outline-none focus:border-purple-500 text-white"
          />
          <button type="submit" className="bg-purple-600 p-3 rounded-xl text-white"><Send size={16} /></button>
        </form>
      </div>
    </div>
  );
};
