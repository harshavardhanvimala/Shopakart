
import React, { useState, useEffect, useMemo } from 'react';
import { AppView, Shop, Product, Role, VisitListItem, Deal, NotificationItem, ChatMessage } from './types';
import { MOCK_SHOPS, CATEGORIES } from './constants';
import Navigation from './components/Navigation';
import SideMenu from './components/SideMenu';
import ShopDetail from './pages/ShopDetail';
import ManageShop from './pages/ManageShop';
import SellerHub from './pages/SellerHub';
import ManageInventory from './pages/ManageInventory';
import Profile from './pages/Profile';
import VisitList from './pages/VisitList';
import MapPreview from './components/MapPreview';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import MerchantDeals from './pages/MerchantDeals';
import MerchantStores from './pages/MerchantStores';
import MerchantPlus from './pages/MerchantPlus';
import ShopperDeals from './pages/ShopperDeals';
import ShopperStores from './pages/ShopperStores';
import ShopperPlus from './pages/ShopperPlus';
import ShopperFavorites from './pages/ShopperFavorites';
import ShopperChats from './pages/ShopperChats';
import ShopperContributions from './pages/ShopperContributions';
import ShopperHistory from './pages/ShopperHistory';
import PriceCompare from './pages/PriceCompare';
import ShopperPriceTracker from './pages/ShopperPriceTracker';
import Notifications from './pages/Notifications';
import { TRANSLATIONS, Locale } from './services/i18n';
import { db } from './database/index';
import { 
  MapPin, Search, Plus, User, Star, ArrowLeft, 
  Sparkles, Bell, ShoppingBag, ChevronRight, Filter,
  Sun, Moon, ShieldCheck, Activity, Globe, Menu, ShoppingCart,
  Store, Users, ArrowRight, LayoutGrid, Wifi, Download
} from 'lucide-react';

const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);
  const [initStatus, setInitStatus] = useState('Initializing DB');
  const [locale, setLocale] = useState<Locale>(() => (localStorage.getItem('sk_locale') as Locale) || 'en');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  // Database Collections State
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [visitList, setVisitList] = useState<VisitListItem[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);

  const [view, setView] = useState<AppView>('ONBOARDING');
  const [role, setRole] = useState<Role>('BUYER');
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [isMapView, setIsMapView] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const t = (key: string) => TRANSLATIONS[locale]?.[key] || TRANSLATIONS['en'][key] || key;

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const initData = async () => {
      try {
        setInitStatus('Establishing Secure Connection');
        await db.init();
        setDbConnected(true);
        
        setInitStatus('Fetching Inventory');
        const [s, p, vl, d, f, n, c] = await Promise.all([
          db.getData<Shop[]>('shops'),
          db.getData<Product[]>('products'),
          db.getData<VisitListItem[]>('visitList'),
          db.getData<Deal[]>('deals'),
          db.getData<string[]>('favorites'),
          db.getData<NotificationItem[]>('notifications'),
          db.getData<ChatMessage[]>('chats')
        ]);

        setShops(s || MOCK_SHOPS);
        setProducts(p || MOCK_SHOPS.flatMap(shop => shop.products.map(prod => ({ ...prod, shopId: shop.id }))));
        setVisitList(vl || []);
        setDeals(d || []);
        setFavorites(f || []);
        setNotifications(n || []);
        setChats(c || []);

        setInitStatus('Welcome to Shopakart');
      } catch (error) {
        console.error("Critical DB Failure:", error);
      } finally {
        setTimeout(() => setIsInitializing(false), 2000);
      }
    };
    initData();
  }, []);

  // Write-Through Cache Effects
  useEffect(() => { if (dbConnected) db.saveData('shops', shops); }, [shops, dbConnected]);
  useEffect(() => { if (dbConnected) db.saveData('products', products); }, [products, dbConnected]);
  useEffect(() => { if (dbConnected) db.saveData('visitList', visitList); }, [visitList, dbConnected]);
  useEffect(() => { if (dbConnected) db.saveData('deals', deals); }, [deals, dbConnected]);
  useEffect(() => { if (dbConnected) db.saveData('favorites', favorites); }, [favorites, dbConnected]);
  useEffect(() => { if (dbConnected) db.saveData('notifications', notifications); }, [notifications, dbConnected]);
  useEffect(() => { if (dbConnected) db.saveData('chats', chats); }, [chats, dbConnected]);

  const myShop = useMemo(() => shops.find(s => s.sellerId === 'seller-1') || shops[0] || MOCK_SHOPS[0], [shops]);
  const activeShop = useMemo(() => shops.find(s => s.id === selectedShopId), [shops, selectedShopId]);

  const filteredShops = useMemo(() => {
    if (activeCategory === 'All') return shops;
    return shops.filter(shop => shop.category.toLowerCase() === activeCategory.toLowerCase());
  }, [shops, activeCategory]);

  const displayCategories = [{ id: 'all', name: 'All', icon: <LayoutGrid size={18} /> }, ...CATEGORIES];

  const handleOpenShop = (shop: Shop) => {
    setSelectedShopId(shop.id);
    setView('SHOP_DETAIL');
    setIsMapView(false);
  };

  const handleAddToVisitList = (productId: string, shopId: string, quantity: number) => {
    setVisitList(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { productId, shopId, quantity }];
    });
  };

  const handleResetDB = async () => {
    if (confirm("This will permanently delete all local store data. Proceed?")) {
      await db.clearAll();
      window.location.reload();
    }
  };

  const handleRoleSelection = (selectedRole: Role) => {
    setRole(selectedRole);
    setView('SIGN_IN');
  };

  const handleSignInSuccess = () => {
    if (role === 'SELLER') {
      setView('SELLER_HUB');
    } else {
      setView('HOME');
    }
  };

  if (isInitializing) {
    return (
      <div className="h-screen bg-obsidian flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-1000">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-emerald-600/5 rounded-full animate-aura-pulse" />
        <div className="relative animate-logo-pop">
          <div className="relative w-32 h-32 bg-white/5 backdrop-blur-3xl rounded-[44px] border border-white/20 flex items-center justify-center shadow-2xl overflow-hidden">
            <ShoppingBag size={56} className="text-emerald-400 relative z-10" />
          </div>
        </div>
        <div className="mt-20 flex flex-col items-center gap-4">
          <h2 className="text-3xl font-black text-white tracking-tighter">Shopa<span className="text-emerald-400">kart</span></h2>
          <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">{initStatus}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-[#f1f3f6] dark:bg-obsidian relative overflow-hidden flex flex-col transition-colors duration-500">
      <div className={`flex-1 relative ${view !== 'ONBOARDING' && view !== 'SIGN_IN' && view !== 'SIGN_UP' ? 'scroll-container no-scrollbar' : 'overflow-hidden'}`}>
        
        {view === 'ONBOARDING' && (
          <div className="h-full bg-obsidian flex flex-col p-8 pt-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[80%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[80%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 text-center mb-16">
              <h1 className="text-5xl font-black text-white tracking-tighter mb-4">
                Shopa<span className="text-emerald-400 italic">kart</span>
              </h1>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">Experience the Local Pulse</p>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-6 relative z-10">
              <button 
                onClick={() => handleRoleSelection('BUYER')}
                className="group relative bg-white/5 border border-white/10 p-8 rounded-[44px] flex flex-col items-start gap-4 transition-all hover:bg-white/10 hover:border-emerald-500/30 text-left active:scale-[0.98]"
              >
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-[22px] flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <ShoppingBag size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">I'm a Shopper</h3>
                  <p className="text-white/40 text-sm font-medium mt-1 leading-snug">Browse local stores, track inventory, and plan your physical visits.</p>
                </div>
                <div className="absolute top-8 right-8 text-white/10 group-hover:text-emerald-400 transition-colors">
                  <ArrowRight size={28} />
                </div>
              </button>

              <button 
                onClick={() => handleRoleSelection('SELLER')}
                className="group relative bg-white/5 border border-white/10 p-8 rounded-[44px] flex flex-col items-start gap-4 transition-all hover:bg-white/10 hover:border-indigo-500/30 text-left active:scale-[0.98]"
              >
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-[22px] flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                  <Store size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">I'm a Merchant</h3>
                  <p className="text-white/40 text-sm font-medium mt-1 leading-snug">Manage your stock, update location, and connect with nearby buyers.</p>
                </div>
                <div className="absolute top-8 right-8 text-white/10 group-hover:text-indigo-400 transition-colors">
                  <ArrowRight size={28} />
                </div>
              </button>
            </div>

            <footer className="relative z-10 mt-12 pb-8 text-center">
              <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em]">Powered by Shopakart Commerce Engine</p>
            </footer>
          </div>
        )}

        {view === 'SIGN_IN' && (
          <SignIn 
            targetRole={role} 
            onSuccess={handleSignInSuccess} 
            onBack={() => setView('ONBOARDING')}
            onSignUp={() => setView('SIGN_UP')}
            t={t}
          />
        )}

        {view === 'SIGN_UP' && (
          <SignUp 
            role={role}
            setRole={setRole}
            onSuccess={handleSignInSuccess}
            onLogin={() => setView('SIGN_IN')}
            onBack={() => setView('ONBOARDING')}
          />
        )}

        {view === 'HOME' && (
          <div className="min-h-full">
            <header className="bg-emerald-600 px-4 pt-12 pb-4 sticky top-0 z-50 shadow-md transition-all">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsMenuOpen(true)}
                    className="w-10 h-10 flex items-center justify-center text-white active:scale-90 transition-transform"
                  >
                    <Menu size={24} />
                  </button>
                  <div className="flex flex-col">
                    <span className="text-white font-black italic text-xl leading-none">Shopakart</span>
                    <div className="flex items-center gap-1">
                      <span className="text-emerald-100 text-[8px] font-bold italic tracking-widest uppercase">PLUS <Sparkles size={8} className="fill-emerald-100" /></span>
                      <div className="w-1 h-1 bg-emerald-300 rounded-full mx-1 opacity-50" />
                      <Wifi size={8} className={`${dbConnected ? 'text-emerald-300' : 'text-rose-400 animate-pulse'}`} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-white">
                  {deferredPrompt && (
                    <button 
                      onClick={handleInstallApp}
                      className="flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse"
                    >
                      <Download size={12} /> Install
                    </button>
                  )}
                  <button 
                    onClick={() => setView('NOTIFICATIONS')}
                    className="w-10 h-10 flex items-center justify-center relative active:scale-90 transition-all"
                  >
                    <Bell size={22} />
                    {notifications.some(n => !n.isRead) && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border-2 border-emerald-600" />
                    )}
                  </button>
                  <ShoppingCart size={22} onClick={() => setView('VISIT_LIST')} />
                </div>
              </div>
              <div 
                onClick={() => setView('PRICE_COMPARE')}
                className="bg-white rounded-xl flex items-center px-4 py-3 shadow-inner cursor-text mb-2 mx-2"
              >
                <Search size={18} className="text-slate-400 mr-2" />
                <input 
                  type="text" 
                  readOnly
                  placeholder="Search for Shops or Items" 
                  className="bg-transparent border-none outline-none text-sm w-full font-medium cursor-text"
                />
              </div>
            </header>

            <section className="bg-white dark:bg-white/5 py-4 px-4 flex gap-6 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-white/10">
              {displayCategories.map(cat => {
                const isActive = activeCategory === cat.name;
                return (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.name)} className="flex flex-col items-center gap-1.5 shrink-0 transition-all">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all shadow-sm ${
                      isActive 
                        ? 'bg-emerald-600 border-emerald-600 text-white scale-110' 
                        : 'bg-slate-50 dark:bg-white/10 text-emerald-600 border-slate-100 dark:border-white/5'
                    }`}>
                      {cat.icon}
                    </div>
                    <span className={`text-[10px] font-black uppercase transition-colors ${
                      isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-white/60'
                    }`}>
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </section>

            <section className="px-3 mt-4 grid grid-cols-4 gap-2">
              {[
                { label: 'Map View', icon: <MapPin />, color: 'bg-blue-500', action: () => setIsMapView(true) },
                { label: 'Deals', icon: <Sparkles />, color: 'bg-pink-500', action: () => setView('SHOPPER_DEALS') },
                { label: 'Stores', icon: <ShoppingBag />, color: 'bg-emerald-500', action: () => setView('SHOPPER_STORES') },
                { label: 'Plus', icon: <Star />, color: 'bg-amber-500', action: () => setView('SHOPPER_PLUS') }
              ].map((item, i) => (
                <div key={i} onClick={item.action} className="bg-white dark:bg-white/5 rounded-2xl p-3 flex flex-col items-center gap-2 border border-slate-100 dark:border-white/10 shadow-sm active:scale-95 transition-all cursor-pointer">
                  <div className={`${item.color} text-white p-2 rounded-lg shadow-md`}>
                    {React.cloneElement(item.icon as any, { size: 18 })}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-tighter text-slate-500 dark:text-white/40">{item.label}</span>
                </div>
              ))}
            </section>

            <section className="mt-8 pb-32">
              <div className="px-5 flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">Nearby Opportunities</h3>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{activeCategory}</span>
              </div>
              <div className="px-4 flex gap-4 overflow-x-auto no-scrollbar pb-6">
                {filteredShops.map(shop => (
                  <div key={shop.id} onClick={() => handleOpenShop(shop)} className="w-48 shrink-0 bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm active:scale-95 transition-all cursor-pointer">
                    <div className="h-28 relative">
                      <img src={shop.imageUrl} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-1">
                        {shop.rating} <Star size={8} fill="white" />
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-black text-slate-800 dark:text-white text-sm truncate">{shop.name}</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-wider">{shop.category}</p>
                    </div>
                  </div>
                ))}
                {filteredShops.length === 0 && (
                  <div className="w-full py-12 flex flex-col items-center justify-center text-slate-400 opacity-50">
                    <Search size={32} strokeWidth={1} />
                    <p className="text-xs font-bold uppercase tracking-widest mt-2">No shops found in {activeCategory}</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {view === 'SHOP_DETAIL' && activeShop && (
          <ShopDetail 
            shop={activeShop} 
            role={role}
            onBack={() => setView(role === 'SELLER' ? 'SELLER_HUB' : 'HOME')} 
            onStartChat={(s) => { setSelectedShopId(s.id); setView('CHAT'); }} 
            onPlanVisit={handleAddToVisitList}
            onEditShop={() => setView('MANAGE_SHOP')}
            onManageInventory={() => setView('MANAGE_INVENTORY')}
            onEditProduct={(id) => { setSelectedShopId(activeShop.id); setView('MANAGE_INVENTORY'); }}
            t={t} 
          />
        )}

        {view === 'VISIT_LIST' && (
          <VisitList items={visitList} shops={shops} products={products} onRemoveItem={(id) => setVisitList(l => l.filter(i => i.productId !== id))} onVisitShop={handleOpenShop} onExplore={() => setView('HOME')} onBack={() => setView('HOME')} t={t} />
        )}

        {view === 'PROFILE' && (
          <Profile 
            role={role} 
            isDarkMode={isDarkMode} 
            onToggleTheme={() => setIsDarkMode(!isDarkMode)} 
            onLogout={() => setView('ONBOARDING')} 
            onToggleRole={() => { setRole(r => r === 'BUYER' ? 'SELLER' : 'BUYER'); setView(role === 'BUYER' ? 'SELLER_HUB' : 'HOME'); }} 
            onNavigate={(v) => setView(v)}
            onResetDB={handleResetDB}
            t={t} 
          />
        )}

        {view === 'SELLER_HUB' && (
          <SellerHub 
            shop={myShop} 
            onEditShop={() => setView('MANAGE_SHOP')} 
            onAddStock={() => setView('MANAGE_INVENTORY')} 
            onViewDeals={() => setView('MERCHANT_DEALS')}
            onViewStores={() => setView('MERCHANT_STORES')}
            onViewPlus={() => setView('MERCHANT_PLUS')}
            t={t} 
          />
        )}
        
        {view === 'MERCHANT_DEALS' && <MerchantDeals shop={myShop} onBack={() => setView('SELLER_HUB')} />}
        {view === 'MERCHANT_STORES' && <MerchantStores shops={shops} onBack={() => setView('SELLER_HUB')} />}
        {view === 'MERCHANT_PLUS' && <MerchantPlus onBack={() => setView('SELLER_HUB')} />}

        {view === 'SHOPPER_DEALS' && <ShopperDeals shops={shops} onBack={() => setView('HOME')} onOpenShop={handleOpenShop} />}
        {view === 'SHOPPER_STORES' && <ShopperStores shops={shops} onBack={() => setView('HOME')} onOpenShop={handleOpenShop} />}
        {view === 'SHOPPER_PLUS' && <ShopperPlus onBack={() => setView('HOME')} />}
        
        {view === 'SHOPPER_FAVORITES' && <ShopperFavorites shops={shops} favorites={favorites} setFavorites={setFavorites} onBack={() => setView('PROFILE')} onOpenShop={handleOpenShop} />}
        {view === 'SHOPPER_CHATS' && <ShopperChats chats={chats} onBack={() => setView('PROFILE')} />}
        {view === 'SHOPPER_CONTRIBUTIONS' && <ShopperContributions onBack={() => setView('PROFILE')} />}
        {view === 'SHOPPER_HISTORY' && <ShopperHistory shops={shops} onBack={() => setView('PROFILE')} onOpenShop={handleOpenShop} />}
        {view === 'SHOPPER_PRICE_TRACKER' && <ShopperPriceTracker onBack={() => setView('HOME')} />}

        {view === 'NOTIFICATIONS' && <Notifications notifications={notifications} setNotifications={setNotifications} onBack={() => setView('HOME')} />}

        {view === 'PRICE_COMPARE' && (
          <PriceCompare 
            products={products} 
            shops={shops} 
            onBack={() => setView('HOME')} 
            onOpenShop={handleOpenShop} 
            onNavigateToPriceTracker={() => setView('SHOPPER_PRICE_TRACKER')}
            t={t} 
          />
        )}

        {view === 'MANAGE_INVENTORY' && <ManageInventory shopId={myShop.id} products={products} setProducts={setProducts} onBack={() => setView('SELLER_HUB')} />}
        {view === 'MANAGE_SHOP' && <ManageShop shop={myShop} onSave={(s) => { setShops(prev => prev.map(sh => sh.id === s.id ? s : sh)); setView('SELLER_HUB'); }} onBack={() => setView('SELLER_HUB')} />}

        {isMapView && (
          <div className="fixed inset-0 z-[100] bg-white dark:bg-obsidian animate-in slide-in-from-bottom duration-500">
            <header className="px-6 pt-14 pb-6 flex items-center gap-4 border-b border-slate-100 dark:border-white/10 bg-emerald-600 text-white">
              <button 
                onClick={() => setIsMapView(false)} 
                className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center active:scale-95 transition-all"
              >
                <ArrowLeft size={22} strokeWidth={2.5} />
              </button>
              <h2 className="text-2xl font-black tracking-tighter">Live Map</h2>
            </header>
            <div className="h-full pb-20"><MapPreview shops={shops} onShopClick={handleOpenShop} /></div>
          </div>
        )}
      </div>

      {(view === 'HOME' || view === 'VISIT_LIST' || view === 'PROFILE' || view === 'SELLER_HUB' || view === 'MANAGE_INVENTORY' || view === 'MANAGE_SHOP' || view === 'MERCHANT_DEALS' || view === 'MERCHANT_STORES' || view === 'MERCHANT_PLUS' || view === 'SHOPPER_DEALS' || view === 'SHOPPER_STORES' || view === 'SHOPPER_PLUS' || view === 'SHOPPER_FAVORITES' || view === 'SHOPPER_CHATS' || view === 'SHOPPER_CONTRIBUTIONS' || view === 'SHOPPER_HISTORY' || view === 'PRICE_COMPARE' || view === 'NOTIFICATIONS' || view === 'SHOPPER_PRICE_TRACKER') && (
        <Navigation currentView={view} setView={setView} role={role} t={t} />
      )}

      {isMenuOpen && (
        <SideMenu 
          role={role}
          onClose={() => setIsMenuOpen(false)}
          onNavigate={(v) => { setView(v); setIsMenuOpen(false); }}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          onLogout={() => { setView('ONBOARDING'); setIsMenuOpen(false); }}
          t={t}
        />
      )}
    </div>
  );
};

export default App;
