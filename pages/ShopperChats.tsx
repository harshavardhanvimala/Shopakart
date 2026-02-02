
import React from 'react';
import { ArrowLeft, MessageSquare, ChevronRight, CheckCheck, Clock } from 'lucide-react';

interface ShopperChatsProps {
  onBack: () => void;
}

const ShopperChats: React.FC<ShopperChatsProps> = ({ onBack }) => {
  const chats = [
    { id: '1', shopName: 'The Daily Grind', lastMsg: 'Your order is ready for pickup!', time: '2h ago', unread: 0, online: true },
    { id: '2', shopName: 'Tech Haven', lastMsg: 'We have the part in stock now.', time: '1d ago', unread: 0, online: false }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-obsidian pb-32 animate-in slide-in-from-right transition-colors">
      <header className="px-8 pt-16 pb-8 bg-white dark:bg-white/5 border-b border-slate-100 dark:border-white/10 rounded-b-[40px] shadow-sm">
        <div className="flex items-center gap-5">
          <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/10 flex items-center justify-center text-slate-900 dark:text-white active:scale-95 transition-all">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Conversations</h2>
        </div>
      </header>

      <main className="px-6 mt-8 space-y-3">
        {chats.map(chat => (
          <div key={chat.id} className="bg-white dark:bg-white/5 p-5 rounded-[32px] border border-slate-100 dark:border-white/10 flex items-center gap-4 shadow-sm active:scale-[0.98] transition-all cursor-pointer group">
            <div className="relative">
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-600">
                <MessageSquare size={24} />
              </div>
              {chat.online && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-obsidian rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{chat.shopName}</h4>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{chat.time}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-white/40 truncate font-medium">{chat.lastMsg}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <CheckCheck size={16} className="text-emerald-500" />
              <ChevronRight size={16} className="text-slate-200" />
            </div>
          </div>
        ))}

        <div className="mt-12 text-center opacity-30">
          <Clock size={32} className="mx-auto mb-2 text-slate-400" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">Message History v2.0</p>
        </div>
      </main>
    </div>
  );
};

export default ShopperChats;
