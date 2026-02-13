
import React from 'react';
import { 
  X, User, ShoppingBag, Sparkles, Star, MapPin, 
  Settings, LogOut, Sun, Moon, Info, ShieldCheck,
  ChevronRight, Heart, History, MessageSquare, Store,
  BrainCircuit
} from 'lucide-react';
import { Role, AppView } from '../types';

interface SideMenuProps {
  role: Role;
  onClose: () => void;
  onNavigate: (view: AppView) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
  t: (key: string) => string;
}

const SideMenu: React.FC<SideMenuProps> = ({ role, onClose, onNavigate, isDarkMode, onToggleTheme, onLogout, t }) => {
  const isSeller = role === 'SELLER';

  const shopperLinks = [
    { id: 'SHOPPER_FAVORITES' as AppView, label: 'My Favorites', icon: <Heart className="text-rose-500" /> },
    { id: 'SHOPPER_PRICE_TRACKER' as AppView, label: 'AI Price Tracker', icon: <BrainCircuit className="text-indigo-500" /> },
    { id: 'SHOPPER_CHATS' as AppView, label: 'Messages', icon: <MessageSquare className="text-blue-500" /> },
    { id: 'SHOPPER_DEALS' as AppView, label: 'Live Deals', icon: <Sparkles className="text-pink-500" /> },
    { id: 'SHOPPER_STORES' as AppView, label: 'Store Directory', icon: <Store className="text-emerald-500" /> },
    { id: 'SHOPPER_HISTORY' as AppView, label: 'Browsing History', icon: <History className="text-amber-500" /> },
  ];

  const merchantLinks = [
    { id: 'SELLER_HUB' as AppView, label: 'Insights Portal', icon: <Star className="text-amber-500" /> },
    { id: 'MERCHANT_DEALS' as AppView, label: 'Promotion Manager', icon: <Sparkles className="text-pink-500" /> },
    { id: 'MERCHANT_STORES' as AppView, label: 'Locations', icon: <MapPin className="text-blue-500" /> },
    { id: 'MERCHANT_PLUS' as AppView, label: 'Plus Benefits', icon: <ShieldCheck className="text-emerald-500" /> },
  ];

  const activeLinks = isSeller ? merchantLinks : shopperLinks;

  return (
    <div className="fixed inset-0 z-[150] flex overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-obsidian/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <aside className="relative w-[280px] bg-white dark:bg-obsidian h-full shadow-2xl animate-in slide-in-from-left duration-500 ease-out flex flex-col border-r border-slate-100 dark:border-white/10 transition-colors">
        {/* Profile Section */}
        <div className="p-8 pt-16 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
          <div className="flex justify-between items-start mb-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg ${isSeller ? 'bg-indigo-600 rotate-3' : 'bg-emerald-600 -rotate-3'}`}>
              <User size={32} />
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 dark:text-white/20 hover:text-slate-900 dark:hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
            {isSeller ? 'Merchant Hub' : 'Alex Johnson'}
          </h2>
          <p className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] mt-1">
            {isSeller ? 'Global Verified Seller' : 'Local Pro Shopper'}
          </p>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2 no-scrollbar">
          <p className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.3em] mb-4 ml-2">Quick Navigation</p>
          {activeLinks.map(link => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className="w-full p-4 flex items-center justify-between rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 dark:bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {/* Fixed: Use React.ReactElement<any> to allow passing 'size' prop to cloneElement */}
                  {React.cloneElement(link.icon as React.ReactElement<any>, { size: 20 })}
                </div>
                <span className="font-bold text-slate-700 dark:text-white/80 text-sm">{link.label}</span>
              </div>
              <ChevronRight size={14} className="text-slate-300 dark:text-white/10 opacity-0 group-hover:opacity-100 transition-all" />
            </button>
          ))}

          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-white/10">
             <p className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.3em] mb-4 ml-2">Preferences</p>
             <button
              onClick={onToggleTheme}
              className="w-full p-4 flex items-center justify-between rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 dark:bg-white/10 rounded-xl flex items-center justify-center text-slate-400 dark:text-amber-400">
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </div>
                <span className="font-bold text-slate-700 dark:text-white/80 text-sm">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${isDarkMode ? 'bg-amber-400' : 'bg-slate-200 dark:bg-white/10'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${isDarkMode ? 'left-5.5' : 'left-0.5'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Footer Section */}
        <div className="p-6 pb-12 border-t border-slate-100 dark:border-white/10 space-y-4">
           <button 
             onClick={onLogout}
             className="w-full p-4 flex items-center gap-4 text-rose-500 font-black text-xs uppercase tracking-widest hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all"
           >
              <LogOut size={18} /> Sign Out
           </button>
           <div className="flex items-center gap-2 px-4 opacity-30">
              <Info size={14} />
              <span className="text-[8px] font-black uppercase tracking-[0.2em]">Shopakart v2.5.1 Build 409</span>
           </div>
        </div>
      </aside>
    </div>
  );
};

export default SideMenu;
