
import React, { useState } from 'react';
import { 
  User, Settings, Heart, BarChart3, 
  Store, Package, CheckCircle, TrendingUp,
  RefreshCw, ArrowLeft, History, Star, Clock, 
  Zap, Lock, MessageSquare, MessageCircle, Users,
  Bell, Shield, HelpCircle, LogOut, ChevronRight, Eye, Database, Trash2
} from 'lucide-react';
import { Role } from '../types';

interface ProfileProps {
  role: Role;
  onLogout: () => void;
  onNavigateToSellerHub?: () => void;
  onToggleRole?: () => void;
  onResetDB?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ role, onLogout, onNavigateToSellerHub, onToggleRole, onResetDB }) => {
  const [activeSubScreen, setActiveSubScreen] = useState<string | null>(null);
  const isSeller = role === 'SELLER';

  const buyerMenuItems = [
    { id: 'favorites', icon: <Heart size={22} />, label: 'Favorites', color: 'text-rose-500', bg: 'bg-rose-50', description: 'Saved shops and products' },
    { id: 'chats', icon: <MessageSquare size={22} />, label: 'My Chats', color: 'text-blue-500', bg: 'bg-blue-50', description: 'Interactions with merchants' },
    { id: 'reviews', icon: <Star size={22} />, label: 'Contributions', color: 'text-amber-500', bg: 'bg-amber-50', description: 'Your reviews and ratings' },
    { id: 'history', icon: <History size={22} />, label: 'History', color: 'text-emerald-500', bg: 'bg-emerald-50', description: 'Recently viewed shops' },
  ];

  const sellerMenuItems = [
    { id: 'storefront', icon: <Eye size={22} />, label: 'Public View', color: 'text-emerald-500', bg: 'bg-emerald-50', description: 'See your shop as a customer' },
    { id: 'inbox', icon: <MessageCircle size={22} />, label: 'Customer Inbox', color: 'text-blue-500', bg: 'bg-blue-50', description: 'Recent customer inquiries' },
    { id: 'campaigns', icon: <Zap size={22} />, label: 'Local Deals', color: 'text-amber-500', bg: 'bg-amber-50', description: 'Manage shop promotions' },
    { id: 'customers', icon: <Users size={22} />, label: 'Top Visitors', color: 'text-indigo-500', bg: 'bg-indigo-50', description: 'Your most loyal customers' },
  ];

  const settingsItems = [
    { id: 'notifications', icon: <Bell size={20} />, label: 'Notifications' },
    { id: 'privacy', icon: <Shield size={20} />, label: 'Privacy & Security' },
    { id: 'help', icon: <HelpCircle size={20} />, label: 'Help Center' },
  ];

  const menuItems = isSeller ? sellerMenuItems : buyerMenuItems;

  const renderSubScreen = () => {
    if (!activeSubScreen) return null;

    const currentItem = [...buyerMenuItems, ...sellerMenuItems, ...settingsItems].find(item => item.id === activeSubScreen) as any;
    
    return (
      <div className="fixed inset-0 z-[60] bg-white animate-in slide-in-from-right duration-300 flex flex-col">
        <header className="px-6 pt-16 pb-6 border-b flex items-center gap-4">
          <button 
            onClick={() => setActiveSubScreen(null)} 
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-900 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">{currentItem?.label}</h2>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
          <div className={`w-24 h-24 rounded-[32px] ${currentItem?.bg || 'bg-slate-100'} ${currentItem?.color || 'text-slate-500'} flex items-center justify-center mb-6 shadow-sm`}>
            {currentItem?.icon && React.cloneElement(currentItem.icon as React.ReactElement, { size: 48 })}
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">{currentItem?.label}</h3>
          <p className="text-slate-500 max-w-xs mb-10 font-medium leading-relaxed">
            {currentItem?.id === 'chats' ? "You don't have any active chats with merchants right now. Start a conversation to ask about stock or opening hours!" : 
             currentItem?.id === 'favorites' ? "Your heart list is empty. Tap the heart on shop pages to save them here for quick access." :
             currentItem?.id === 'campaigns' ? "You haven't created any local promotions yet. Blast a special deal to users in your 1-mile radius!" :
             currentItem?.id === 'inbox' ? "No new customer requests. When users chat with your shop, they will appear here." :
             `Your ${currentItem?.label.toLowerCase()} history and activity will appear here. This section is live-synced with your neighborhood profile.`}
          </p>
          
          <div className="w-full space-y-3">
             <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4 text-left">
                <div className="p-2 bg-white rounded-xl shadow-sm"><Clock size={18} className="text-slate-400" /></div>
                <div>
                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Last Update</p>
                   <p className="font-bold text-slate-800">Synced just now</p>
                </div>
             </div>
             {currentItem?.id === 'privacy' && (
               <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center gap-4 text-left">
                  <div className="p-2 bg-white rounded-xl shadow-sm text-emerald-600"><Lock size={18} /></div>
                  <div>
                     <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Encryption</p>
                     <p className="font-bold text-emerald-800">End-to-end local tunnel active</p>
                  </div>
               </div>
             )}
          </div>
          
          <button 
            onClick={() => setActiveSubScreen(null)}
            className="mt-12 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white pb-32 animate-in fade-in duration-300">
      {renderSubScreen()}
      
      <header className={`px-6 pt-16 pb-8 rounded-b-[40px] transition-colors duration-500 ${isSeller ? 'bg-indigo-50' : 'bg-slate-50'}`}>
        <div className="flex items-center gap-6">
          <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-white shadow-xl relative transition-all duration-500 ${isSeller ? 'bg-indigo-600 shadow-indigo-100 rotate-2' : 'bg-emerald-600 shadow-emerald-100 -rotate-2'}`}>
            <User size={48} />
            <button 
              onClick={() => setActiveSubScreen('notifications')}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-md flex items-center justify-center text-slate-600 border border-slate-100 active:scale-90 transition-transform hover:bg-slate-50"
            >
              <Settings size={18} />
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">
              {isSeller ? 'Merchant Hub' : 'Alex Johnson'}
            </h1>
            <p className="text-slate-500 font-bold text-sm">
              {isSeller ? 'Verified Shop Owner' : 'Indiranagar Local'}
            </p>
            <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              isSeller ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {isSeller ? (
                <><CheckCircle size={10} /> Certified Business</>
              ) : (
                'Pro Buyer'
              )}
            </div>
          </div>
        </div>

        {isSeller && (
          <div className="grid grid-cols-2 gap-4 mt-8 animate-in slide-in-from-bottom duration-500">
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-[24px] border border-white/50 shadow-sm">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Weekly Reach</p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-black text-slate-900">1.2k</p>
                <div className="flex items-center text-emerald-500 text-[10px] font-bold">
                  <TrendingUp size={12} /> +12%
                </div>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-[24px] border border-white/50 shadow-sm">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Trust Score</p>
              <p className="text-xl font-black text-slate-900">4.9/5.0</p>
            </div>
          </div>
        )}
      </header>

      <main className="px-6 mt-8 space-y-8">
        <div>
           <button 
             onClick={onToggleRole}
             className="w-full flex items-center justify-between p-5 bg-slate-900 text-white rounded-[28px] shadow-lg active:scale-95 transition-all mb-8 group"
           >
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
                    <RefreshCw size={20} />
                 </div>
                 <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Switch Workspace</p>
                    <p className="font-bold">Switch to {isSeller ? 'Buyer' : 'Seller'} Portal</p>
                 </div>
              </div>
              <ChevronRight size={18} className="opacity-40" />
           </button>

          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">
            {isSeller ? 'Merchant Operations' : 'Shopping Activity'}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {menuItems.map((item, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveSubScreen(item.id)}
                className="p-5 bg-white border border-slate-100 rounded-[28px] flex flex-col items-start gap-3 hover:bg-slate-50 transition-colors shadow-sm active:scale-95 text-left group"
              >
                <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <div>
                   <span className="font-bold text-slate-800 leading-tight block">{item.label}</span>
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight leading-tight mt-1 group-hover:text-slate-500 transition-colors">{item.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">System Health</h3>
          <div className="bg-slate-50 rounded-[32px] p-4 space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white rounded-xl shadow-sm text-emerald-600"><Database size={18} /></div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Database Type</p>
                      <p className="font-bold text-slate-800">IndexedDB Local</p>
                   </div>
                </div>
                <div className="px-2 py-1 bg-emerald-500 text-white text-[8px] font-black rounded uppercase tracking-widest">Active</div>
             </div>
             
             <button 
                onClick={onResetDB}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white text-rose-500 font-black text-[10px] uppercase tracking-widest rounded-2xl border border-rose-100 active:scale-95 transition-all"
             >
                <Trash2 size={14} /> Wipe All Local Data
             </button>
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Account Settings</h3>
          <div className="bg-slate-50 rounded-[32px] p-2">
            {settingsItems.map((item, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveSubScreen(item.id)}
                className="w-full flex items-center justify-between p-5 bg-white rounded-[24px] mb-1 last:mb-0 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-slate-400 group-hover:text-slate-600 transition-colors">
                    {item.icon}
                  </div>
                  <span className="font-medium text-slate-700">{item.label}</span>
                </div>
                <ChevronRight size={20} className="text-slate-300" />
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="w-full py-5 bg-rose-50 text-rose-600 rounded-[28px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all border border-rose-100 hover:bg-rose-100"
        >
          <LogOut size={20} />
          Sign Out of Shopakart
        </button>

        <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] pb-12">
          RETAIL CONNECT v2.5.1 • STABLE
        </p>
      </main>
    </div>
  );
};

export default Profile;
