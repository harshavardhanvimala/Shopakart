
import React, { useState } from 'react';
import { 
  User, Settings, Heart, BarChart3, 
  Store, Package, CheckCircle, TrendingUp,
  RefreshCw, ArrowLeft, History, Star, Clock, 
  Zap, Lock, MessageSquare, MessageCircle, Users,
  Bell, Shield, HelpCircle, LogOut, ChevronRight, Eye, Database, Trash2,
  Sun, Moon, BellOff, MapPin, Fingerprint, Info, Mail, Globe, ShieldCheck,
  BrainCircuit
} from 'lucide-react';
import { Role, AppView } from '../types';

interface ProfileProps {
  role: Role;
  onLogout: () => void;
  onNavigateToSellerHub?: () => void;
  onToggleRole?: () => void;
  onResetDB?: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onNavigate?: (view: AppView) => void;
  t: (key: string) => string;
}

const Profile: React.FC<ProfileProps> = ({ role, onLogout, onNavigateToSellerHub, onToggleRole, onResetDB, isDarkMode, onToggleTheme, onNavigate, t }) => {
  const [activeSubScreen, setActiveSubScreen] = useState<string | null>(null);
  const [toggles, setToggles] = useState({
    notifications: true,
    deals: true,
    messages: true,
    incognito: false,
    biometric: false,
    precision: true
  });

  const isSeller = role === 'SELLER';

  const buyerMenuItems = [
    { id: 'SHOPPER_FAVORITES', icon: <Heart size={22} />, label: 'Favorites', color: 'text-rose-500 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10', description: 'Saved shops and products' },
    { id: 'SHOPPER_PRICE_TRACKER', icon: <BrainCircuit size={22} />, label: 'AI Price Tracker', color: 'text-indigo-500 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10', description: 'Monitor deals and trends' },
    { id: 'SHOPPER_CHATS', icon: <MessageSquare size={22} />, label: 'My Chats', color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', description: 'Interactions with merchants' },
    { id: 'SHOPPER_CONTRIBUTIONS', icon: <Star size={22} />, label: 'Contributions', color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', description: 'Your reviews and ratings' },
    { id: 'SHOPPER_HISTORY', icon: <History size={22} />, label: 'History', color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', description: 'Recently viewed shops' },
  ];

  const sellerMenuItems = [
    { id: 'storefront', icon: <Eye size={22} />, label: 'Public View', color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', description: 'See your shop as a customer' },
    { id: 'inbox', icon: <MessageCircle size={22} />, label: 'Customer Inbox', color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', description: 'Recent customer inquiries' },
    { id: 'campaigns', icon: <Zap size={22} />, label: 'Local Deals', color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', description: 'Manage shop promotions' },
    { id: 'customers', icon: <Users size={22} />, label: 'Top Visitors', color: 'text-indigo-500 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10', description: 'Your most loyal customers' },
  ];

  const settingsItems = [
    { id: 'notifications', icon: <Bell size={20} />, label: 'Notifications' },
    { id: 'privacy', icon: <Shield size={20} />, label: 'Privacy & Security' },
    { id: 'help', icon: <HelpCircle size={20} />, label: 'Help Center' },
  ];

  const menuItems = isSeller ? sellerMenuItems : buyerMenuItems;

  const toggleVal = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMenuClick = (id: string) => {
    // If it's a shopper view we handle it via App routing
    if (id.startsWith('SHOPPER_')) {
      onNavigate?.(id as AppView);
    } else {
      setActiveSubScreen(id);
    }
  };

  const renderSubScreen = () => {
    if (!activeSubScreen) return null;

    const currentItem = [...buyerMenuItems, ...sellerMenuItems, ...settingsItems].find(item => item.id === activeSubScreen) as any;
    
    return (
      <div className="fixed inset-0 z-[120] bg-slate-50 dark:bg-indigo-950 animate-in slide-in-from-right duration-300 flex flex-col transition-colors overflow-hidden">
        <header className="px-8 pt-16 pb-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => setActiveSubScreen(null)} 
              className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-900 dark:text-white shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{currentItem?.label}</h2>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar pb-32">
          {activeSubScreen === 'notifications' && (
            <div className="space-y-8">
              <div className="p-8 bg-amber-400 dark:bg-amber-400/10 rounded-[40px] border border-amber-500/20 shadow-xl shadow-amber-200 dark:shadow-none mb-10">
                <Bell size={40} className="text-indigo-950 dark:text-amber-400 mb-4" />
                <h3 className="text-2xl font-black text-indigo-950 dark:text-white tracking-tight">Stay Pulse-Sync</h3>
                <p className="text-indigo-950/60 dark:text-white/40 font-medium text-sm leading-relaxed">Real-time alerts for neighborhood restocks and curated deals.</p>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'notifications', label: 'Push Notifications', desc: 'Main alert system', icon: <Bell /> },
                  { key: 'deals', label: 'Local Deal Blasts', desc: 'Offers within 1 mile', icon: <Zap /> },
                  { key: 'messages', label: 'Merchant Chat', desc: 'Concierge replies', icon: <MessageSquare /> }
                ].map(item => (
                  <button 
                    key={item.key}
                    onClick={() => toggleVal(item.key as any)}
                    className="w-full flex items-center justify-between p-6 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[32px] group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-slate-50 dark:bg-white/10 rounded-2xl flex items-center justify-center text-slate-400 dark:text-indigo-300">
                        {React.cloneElement(item.icon as any, { size: 20 })}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-slate-900 dark:text-white">{item.label}</p>
                        <p className="text-xs text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                    <div className={`w-14 h-8 rounded-full relative transition-colors ${toggles[item.key as keyof typeof toggles] ? 'bg-amber-400' : 'bg-slate-200 dark:bg-white/10'}`}>
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${toggles[item.key as keyof typeof toggles] ? 'left-7' : 'left-1'}`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeSubScreen === 'privacy' && (
            <div className="space-y-8">
              <div className="p-8 bg-emerald-500 dark:bg-emerald-500/10 rounded-[40px] border border-emerald-600/20 shadow-xl shadow-emerald-100 dark:shadow-none mb-10">
                <ShieldCheck size={40} className="text-white dark:text-emerald-400 mb-4" />
                <h3 className="text-2xl font-black text-white dark:text-emerald-400 tracking-tight">Vault Secured</h3>
                <p className="text-white/80 dark:text-emerald-400/40 font-medium text-sm leading-relaxed">Your browsing habits are encrypted locally on this device.</p>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'incognito', label: 'Incognito Discovery', desc: 'Hide visits from shops', icon: <Eye size={20} /> },
                  { key: 'biometric', label: 'Biometric Shield', desc: 'FaceID to open app', icon: <Fingerprint size={20} /> },
                  { key: 'precision', label: 'Location Precision', desc: 'High accuracy market scan', icon: <MapPin size={20} /> }
                ].map(item => (
                  <button 
                    key={item.key}
                    onClick={() => toggleVal(item.key as any)}
                    className="w-full flex items-center justify-between p-6 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[32px] group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-slate-50 dark:bg-white/10 rounded-2xl flex items-center justify-center text-slate-400 dark:text-emerald-400">
                        {item.icon}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-slate-900 dark:text-white">{item.label}</p>
                        <p className="text-xs text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                    <div className={`w-14 h-8 rounded-full relative transition-colors ${toggles[item.key as keyof typeof toggles] ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-white/10'}`}>
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${toggles[item.key as keyof typeof toggles] ? 'left-7' : 'left-1'}`} />
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-6 bg-rose-50 dark:bg-rose-500/5 rounded-[32px] border border-rose-100 dark:border-rose-500/10">
                <div className="flex items-center gap-4 mb-4">
                  <Database size={20} className="text-rose-500" />
                  <h4 className="font-black text-rose-500 uppercase text-xs tracking-widest">Data Management</h4>
                </div>
                <button 
                  onClick={onResetDB}
                  className="w-full py-4 bg-white dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl border border-rose-100 dark:border-rose-500/20 active:scale-95 transition-all"
                >
                  Request Permanent Deletion
                </button>
              </div>
            </div>
          )}

          {activeSubScreen === 'help' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-4">
                {[
                  { q: 'How do I chat with a merchant?', a: 'Tap the chat icon on any shop page to connect via our local bridge.' },
                  { q: 'Is my location always on?', a: 'Only when searching for nearby shops. You can disable this in Privacy.' },
                  { q: 'Can I pay via Shopakart?', a: 'We focus on discovery and inventory. Payment happens at the shop counter.' }
                ].map((faq, i) => (
                  <div key={i} className="p-6 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[32px]">
                    <h4 className="font-black text-slate-900 dark:text-white text-sm mb-2">{faq.q}</h4>
                    <p className="text-xs text-slate-500 dark:text-white/40 leading-relaxed font-medium">{faq.a}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-6 bg-indigo-950 dark:bg-white text-white dark:text-indigo-950 rounded-[32px] shadow-xl">
                  <div className="flex items-center gap-4">
                    <Mail size={20} />
                    <span className="font-bold text-sm">Concierge Support</span>
                  </div>
                  <ChevronRight size={18} />
                </button>
                <div className="flex gap-4">
                  <button className="flex-1 flex flex-col items-center gap-3 p-6 bg-slate-100 dark:bg-white/5 rounded-[32px] text-slate-600 dark:text-white/60">
                    <Globe size={24} />
                    <span className="text-[10px] font-black uppercase">Website</span>
                  </button>
                  <button className="flex-1 flex flex-col items-center gap-3 p-6 bg-slate-100 dark:bg-white/5 rounded-[32px] text-slate-600 dark:text-white/60">
                    <Info size={24} />
                    <span className="text-[10px] font-black uppercase">Version</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Fallback for other IDs */}
          {!['notifications', 'privacy', 'help'].includes(activeSubScreen) && (
            <div className="flex flex-col items-center justify-center text-center py-20">
              <div className={`w-24 h-24 rounded-[32px] ${currentItem?.bg || 'bg-slate-100 dark:bg-white/10'} ${currentItem?.color || 'text-slate-500 dark:text-white/40'} flex items-center justify-center mb-6 shadow-sm`}>
                {/* Fixed: Use React.ReactElement<any> to allow passing 'size' prop to cloneElement */}
                {currentItem?.icon && React.cloneElement(currentItem.icon as React.ReactElement<any>, { size: 48 })}
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{currentItem?.label}</h3>
              <p className="text-slate-500 dark:text-white/40 max-w-xs mb-10 font-medium leading-relaxed">
                Activity records for {currentItem?.label.toLowerCase()} will appear here once you interact with local merchants.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-indigo-950 pb-32 animate-in fade-in duration-300 transition-colors">
      {renderSubScreen()}
      
      <header className={`px-6 pt-16 pb-8 rounded-b-[40px] transition-colors duration-500 ${isSeller ? 'bg-indigo-50 dark:bg-white/5' : 'bg-slate-50 dark:bg-white/5'}`}>
        <div className="flex items-center gap-6">
          <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-white shadow-xl relative transition-all duration-500 ${isSeller ? 'bg-indigo-600 shadow-indigo-100 dark:shadow-none rotate-2' : 'bg-emerald-600 shadow-emerald-100 dark:shadow-none -rotate-2'}`}>
            <User size={48} />
            <button 
              onClick={() => setActiveSubScreen('notifications')}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-indigo-900 rounded-2xl shadow-md flex items-center justify-center text-slate-600 dark:text-white border border-slate-100 dark:border-white/10 active:scale-90 transition-transform hover:bg-slate-50 dark:hover:bg-indigo-800"
            >
              <Settings size={18} />
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
              {isSeller ? 'Merchant Hub' : 'Alex Johnson'}
            </h1>
            <p className="text-slate-500 dark:text-white/40 font-bold text-sm">
              {isSeller ? 'Verified Shop Owner' : 'Indiranagar Local'}
            </p>
            <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              isSeller ? 'bg-indigo-100 text-indigo-700 dark:bg-white/10 dark:text-indigo-300' : 'bg-emerald-100 text-emerald-700 dark:bg-white/10 dark:text-emerald-300'
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
            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm p-4 rounded-[24px] border border-white/50 dark:border-white/5 shadow-sm">
              <p className="text-[10px] font-black text-indigo-400 dark:text-amber-400/60 uppercase tracking-widest mb-1">Weekly Reach</p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-black text-slate-900 dark:text-white">1.2k</p>
                <div className="flex items-center text-emerald-500 dark:text-emerald-400 text-[10px] font-bold">
                  <TrendingUp size={12} /> +12%
                </div>
              </div>
            </div>
            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm p-4 rounded-[24px] border border-white/50 dark:border-white/5 shadow-sm">
              <p className="text-[10px] font-black text-indigo-400 dark:text-amber-400/60 uppercase tracking-widest mb-1">Trust Score</p>
              <p className="text-xl font-black text-slate-900 dark:text-white">4.9/5.0</p>
            </div>
          </div>
        )}
      </header>

      <main className="px-6 mt-8 space-y-8">
        <div>
           <button 
             onClick={onToggleRole}
             className="w-full flex items-center justify-between p-5 bg-slate-900 dark:bg-white/10 text-white rounded-[28px] shadow-lg active:scale-95 transition-all mb-8 group"
           >
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-white/10 dark:bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
                    <RefreshCw size={20} />
                 </div>
                 <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{t('switchPortal')}</p>
                    <p className="font-bold">Switch to {isSeller ? 'Buyer' : 'Seller'} Portal</p>
                 </div>
              </div>
              <ChevronRight size={18} className="opacity-40" />
           </button>

          <h3 className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.2em] mb-4 ml-1">
            {isSeller ? 'Merchant Operations' : 'Shopping Activity'}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {menuItems.map((item, idx) => (
              <button 
                key={idx}
                onClick={() => handleMenuClick(item.id)}
                className="p-5 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[28px] flex flex-col items-start gap-3 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm active:scale-95 text-left group"
              >
                <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <div>
                   <span className="font-bold text-slate-800 dark:text-white leading-tight block">{item.label}</span>
                   <span className="text-[9px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-tight leading-tight mt-1 group-hover:text-slate-500 transition-colors">{item.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.2em] mb-4 ml-1">Account Preference</h3>
          <div className="bg-slate-50 dark:bg-white/5 rounded-[32px] p-2">
            <button 
              onClick={onToggleTheme}
              className="w-full flex items-center justify-between p-5 bg-white dark:bg-transparent rounded-[24px] mb-1 last:mb-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                <div className="text-slate-400 dark:text-amber-400">
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </div>
                <span className="font-medium">{isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-colors ${isDarkMode ? 'bg-amber-400' : 'bg-slate-200 dark:bg-white/20'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`} />
              </div>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.2em] mb-4 ml-1">System Health</h3>
          <div className="bg-slate-50 dark:bg-white/5 rounded-[32px] p-4 space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white dark:bg-white/10 rounded-xl shadow-sm text-emerald-600 dark:text-emerald-400"><Database size={18} /></div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest leading-none">Database Type</p>
                      <p className="font-bold text-slate-800 dark:text-white">IndexedDB Local</p>
                   </div>
                </div>
                <div className="px-2 py-1 bg-emerald-500 text-white text-[8px] font-black rounded uppercase tracking-widest">Active</div>
             </div>
             
             <button 
                onClick={onResetDB}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 font-black text-[10px] uppercase tracking-widest rounded-2xl border border-rose-100 dark:border-rose-500/20 active:scale-95 transition-all"
             >
                <Trash2 size={14} /> Wipe All Local Data
             </button>
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.2em] mb-4 ml-1">Account Settings</h3>
          <div className="bg-slate-50 dark:bg-white/5 rounded-[32px] p-2">
            {settingsItems.map((item, idx) => (
              <button 
                key={idx}
                onClick={() => handleMenuClick(item.id)}
                className="w-full flex items-center justify-between p-5 bg-white dark:bg-transparent rounded-[24px] mb-1 last:mb-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-slate-400 dark:text-white/30 group-hover:text-slate-600 dark:group-hover:text-white/60 transition-colors">
                    {item.icon}
                  </div>
                  <span className="font-medium text-slate-700 dark:text-white/80">{item.label}</span>
                </div>
                <ChevronRight size={20} className="text-slate-300 dark:text-white/10" />
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="w-full py-5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-[28px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all border border-rose-100 dark:border-rose-500/20 hover:bg-rose-100 dark:hover:bg-rose-500/20"
        >
          <LogOut size={20} />
          {t('logout')}
        </button>

        <p className="text-center text-[10px] font-bold text-slate-300 dark:text-white/10 uppercase tracking-[0.3em] pb-12">
          RETAIL CONNECT v2.5.1 • STABLE
        </p>
      </main>
    </div>
  );
};

export default Profile;
