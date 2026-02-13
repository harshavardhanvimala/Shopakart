
import React from 'react';
import { 
  ArrowLeft, Bell, BellOff, Sparkles, Package, 
  MessageSquare, ChevronRight, Check, Trash2, Clock 
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsProps {
  // Added missing notification state to match usage in App.tsx
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  onBack: () => void;
  onNavigateToShop?: (shopId: string) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ notifications, setNotifications, onBack, onNavigateToShop }) => {
  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DEAL': return <Sparkles className="text-pink-500" size={20} />;
      case 'RESTOCK': return <Package className="text-emerald-500" size={20} />;
      case 'MESSAGE': return <MessageSquare className="text-blue-500" size={20} />;
      default: return <Bell className="text-amber-500" size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-obsidian pb-32 animate-in slide-in-from-bottom duration-500 transition-colors">
      <header className="px-6 pt-16 pb-8 bg-white dark:bg-white/5 border-b border-slate-100 dark:border-white/10 rounded-b-[40px] shadow-sm sticky top-0 z-50 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/10 flex items-center justify-center text-slate-900 dark:text-white active:scale-95 transition-all">
              <ArrowLeft size={22} />
            </button>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Activity</h1>
          </div>
          {notifications.length > 0 && (
            <button 
              onClick={markAllRead}
              className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 active:scale-90 transition-all"
            >
              <Check size={20} />
            </button>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="flex justify-between items-center px-2">
            <span className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.2em]">
              {notifications.filter(n => !n.isRead).length} Unread Updates
            </span>
            <button onClick={clearAll} className="flex items-center gap-1.5 text-rose-500 font-black text-[10px] uppercase tracking-widest">
              <Trash2 size={12} /> Clear All
            </button>
          </div>
        )}
      </header>

      <main className="px-6 mt-8 space-y-3">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`p-5 rounded-[32px] border transition-all flex items-start gap-4 active:scale-[0.98] cursor-pointer group shadow-sm ${
                notification.isRead 
                  ? 'bg-white/40 dark:bg-white/2 border-slate-50 dark:border-white/5 grayscale-[0.3]' 
                  : 'bg-white dark:bg-white/10 border-slate-100 dark:border-white/10 shadow-emerald-500/5'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                notification.isRead ? 'bg-slate-50 dark:bg-white/5' : 'bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10'
              }`}>
                {getTypeIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`font-black text-sm leading-tight truncate ${notification.isRead ? 'text-slate-500 dark:text-white/40' : 'text-slate-900 dark:text-white'}`}>
                    {notification.title}
                  </h4>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 whitespace-nowrap">
                    {notification.time}
                  </span>
                </div>
                <p className={`text-xs font-medium leading-relaxed ${notification.isRead ? 'text-slate-400 dark:text-white/20' : 'text-slate-600 dark:text-white/60'}`}>
                  {notification.message}
                </p>
                {!notification.isRead && (
                  <div className="mt-3 flex items-center gap-1.5 text-emerald-500 font-black text-[9px] uppercase tracking-widest">
                    Action Required <ChevronRight size={10} strokeWidth={3} />
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center opacity-40">
            <div className="w-24 h-24 bg-slate-100 dark:bg-white/10 rounded-[40px] flex items-center justify-center mb-6">
              <BellOff size={40} className="text-slate-400" />
            </div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Quiet Pulse</h4>
            <p className="text-xs font-medium text-slate-500 dark:text-white/40 max-w-[200px] mt-2">
              No new alerts in your neighborhood. We’ll notify you when restocks or deals arrive.
            </p>
          </div>
        )}

        <div className="mt-12 text-center pb-12">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-full">
              <Clock size={12} className="text-slate-400" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Syncing neighborhood data...</span>
           </div>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
