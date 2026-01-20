
import React, { useState, useEffect, useMemo } from 'react';
import { AppView, Shop, Product, Role, VisitListItem } from './types';
import { MOCK_SHOPS, CATEGORIES } from './constants';
import Navigation from './components/Navigation';
import ShopDetail from './pages/ShopDetail';
import ManageShop from './pages/ManageShop';
import SellerHub from './pages/SellerHub';
import ManageInventory from './pages/ManageInventory';
import Profile from './pages/Profile';
import VisitList from './pages/VisitList';
import MapPreview from './components/MapPreview';
import { db } from './database/index';
import { 
  MapPin, Search, Plus, User, Star, ArrowLeft, 
  Sparkles, Bell, ShoppingBag, ChevronRight, Filter,
  Sun, Moon
} from 'lucide-react';

const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [visitList, setVisitList] = useState<VisitListItem[]>([]);
  const [view, setView] = useState<AppView>('ONBOARDING');
  const [role, setRole] = useState<Role>('BUYER');
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [isMapView, setIsMapView] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

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
        await db.init();
        const storedShops = await db.getData<Shop[]>('shops');
        const storedProducts = await db.getData<Product[]>('products');
        const storedVisitList = await db.getData<VisitListItem[]>('visitList');

        setShops(storedShops || MOCK_SHOPS);
        if (!storedShops) await db.saveData('shops', MOCK_SHOPS);

        setProducts(storedProducts || MOCK_SHOPS.flatMap(s => s.products.map(p => ({ ...p, shopId: s.id }))));
        setVisitList(storedVisitList || []);
      } catch (error) {
        console.error("DB Error:", error);
      } finally {
        setTimeout(() => setIsInitializing(false), 1200);
      }
    };
    initData();
  }, []);

  useEffect(() => { if (!isInitializing) db.saveData('shops', shops); }, [shops, isInitializing]);
  useEffect(() => { if (!isInitializing) db.saveData('products', products); }, [products, isInitializing]);
  useEffect(() => { if (!isInitializing) db.saveData('visitList', visitList); }, [visitList, isInitializing]);

  const myShop = useMemo(() => shops[0] || MOCK_SHOPS[0], [shops]);
  const activeShop = useMemo(() => shops.find(s => s.id === selectedShopId), [shops, selectedShopId]);

  const filteredShops = useMemo(() => {
    if (activeCategory === 'All') return shops;
    return shops.filter(s => s.category.toLowerCase() === activeCategory.toLowerCase());
  }, [shops, activeCategory]);

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

  if (isInitializing) {
    return (
      <div className="h-screen bg-indigo-950 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-28 h-28 bg-white/10 rounded-[40px] flex items-center justify-center backdrop-blur-3xl border border-white/20 animate-[pulse_2s_infinite]">
             <ShoppingBag size={48} className="text-amber-400" />
          </div>
          <div className="absolute -inset-8 bg-amber-400/10 rounded-full blur-[60px]" />
        </div>
        <p className="mt-12 font-black text-amber-400 uppercase tracking-[0.6em] text-[10px] animate-pulse">Shopakart Core</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-slate-50 dark:bg-indigo-950 relative overflow-hidden flex flex-col transition-colors duration-500">
      {/* Main content area handles scrolling for most views */}
      <div className={`flex-1 relative ${view !== 'ONBOARDING' ? 'scroll-container no-scrollbar' : 'overflow-hidden'}`}>
        {view === 'ONBOARDING' && (
          <div className="h-full bg-indigo-950 flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[30%] bg-amber-500/10 blur-[100px] rounded-full" />
            
            <div className="relative w-56 h-56 mb-12">
              <div className="absolute inset-0 bg-white/5 rounded-[5rem] rotate-12" />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-800 rounded-[5rem] flex items-center justify-center shadow-2xl">
                <span className="text-[10rem] font-black tracking-tighter italic text-white/20 absolute">S</span>
                <ShoppingBag size={80} className="text-amber-400 relative z-10" />
              </div>
            </div>
            
            <h1 className="text-6xl font-black text-white mb-6 tracking-tighter leading-none">Shopa<span className="text-amber-400">kart</span></h1>
            <p className="text-indigo-200/60 mb-16 max-w-[260px] font-medium text-xl leading-snug">The premium pulse of your local marketplace.</p>
            
            <div className="w-full space-y-4 max-w-xs">
              <button onClick={() => { setRole('BUYER'); setView('HOME'); }} className="w-full py-6 bg-white text-indigo-950 rounded-[32px] font-extrabold text-xl active:scale-95 transition-all shadow-xl">Explore Nearby</button>
              <button onClick={() => { setRole('SELLER'); setView('SELLER_HUB'); }} className="w-full py-6 bg-indigo-900/50 text-indigo-200 border border-indigo-700/50 rounded-[32px] font-extrabold text-xl active:scale-95 transition-all">Merchant Portal</button>
            </div>
          </div>
        )}

        {view === 'HOME' && (
          <div className="min-h-full">
            {/* Glossy Header */}
            <header className="px-8 pt-14 pb-6 flex justify-between items-end">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                  <p className="text-[10px] font-bold text-slate-400 dark:text-indigo-300/50 uppercase tracking-[0.3em]">Live Updates</p>
                </div>
                <h1 className="text-4xl font-black text-indigo-950 dark:text-white tracking-tighter">Indiranagar</h1>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="w-14 h-14 bg-white dark:bg-white/10 rounded-3xl flex items-center justify-center text-indigo-950 dark:text-amber-400 border border-indigo-100 dark:border-white/10 shadow-xl shadow-indigo-100/50 dark:shadow-none transition-all"
                >
                  {isDarkMode ? <Sun size={24} strokeWidth={2.5} /> : <Moon size={24} strokeWidth={2.5} />}
                </button>
                <button onClick={() => setView('PROFILE')} className="w-14 h-14 bg-white dark:bg-white/10 rounded-3xl flex items-center justify-center text-indigo-950 dark:text-white border border-indigo-100 dark:border-white/10 shadow-xl shadow-indigo-100/50 dark:shadow-none transition-all"><User size={24} strokeWidth={2.5} /></button>
              </div>
            </header>

            {/* Bento-Style Discovery Card */}
            <section className="px-6 mt-6 grid grid-cols-2 gap-4">
              <div onClick={() => setIsMapView(true)} className="col-span-2 relative h-56 bg-indigo-900 rounded-[40px] overflow-hidden shadow-2xl shadow-indigo-200 dark:shadow-indigo-900/40 group active:scale-[0.98] transition-all">
                <MapPreview shops={shops} onShopClick={handleOpenShop} />
                <div className="absolute inset-0 bg-indigo-950/20 pointer-events-none" />
                <div className="absolute top-6 left-6 flex items-center gap-2 glass px-4 py-2 rounded-full border border-white/20">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping" />
                  <span className="text-[10px] font-black text-indigo-950 dark:text-white uppercase tracking-widest">Active Area</span>
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <h4 className="text-white font-black text-2xl tracking-tighter leading-none">Market Radar</h4>
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-indigo-950"><ChevronRight size={20} /></div>
                </div>
              </div>

              <div onClick={() => setView('PRICE_COMPARE')} className="bg-amber-400 h-44 rounded-[40px] p-6 flex flex-col justify-between shadow-xl shadow-amber-100 dark:shadow-amber-900/20 group active:scale-[0.98] transition-all">
                <div className="w-10 h-10 bg-white/30 rounded-2xl flex items-center justify-center text-white"><Search size={22} strokeWidth={3} /></div>
                <div>
                  <h4 className="font-black text-indigo-950 text-xl tracking-tighter leading-tight">Stock Search</h4>
                  <p className="text-indigo-900/60 text-[10px] font-bold uppercase tracking-widest mt-1">Live Inventory</p>
                </div>
              </div>

              <div onClick={() => setView('VISIT_LIST')} className="bg-indigo-950 dark:bg-white/10 h-44 rounded-[40px] p-6 flex flex-col justify-between shadow-xl shadow-indigo-100 dark:shadow-none group active:scale-[0.98] transition-all">
                <div className="w-10 h-10 bg-white/10 dark:bg-white/20 rounded-2xl flex items-center justify-center text-white"><Plus size={22} strokeWidth={3} /></div>
                <div>
                  <h4 className="font-black text-white text-xl tracking-tighter leading-tight">My Catalog</h4>
                  <p className="text-indigo-300/60 dark:text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">{visitList.length} Items Planned</p>
                </div>
              </div>
            </section>

            {/* Editorial Category Chips */}
            <section className="mt-12 px-6">
              <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="text-xs font-black text-indigo-950/30 dark:text-white/20 uppercase tracking-[0.4em]">Curated</h3>
                <Filter size={16} className="text-indigo-900/20 dark:text-white/10" />
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {['All', ...CATEGORIES.map(c => c.name)].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                      activeCategory === cat ? 'bg-indigo-950 dark:bg-amber-400 text-white dark:text-indigo-950 shadow-2xl shadow-indigo-200 dark:shadow-amber-900/40' : 'bg-white dark:bg-white/5 text-indigo-900/40 dark:text-white/30 border border-indigo-50 dark:border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            {/* Staggered Merchant Grid */}
            <section className="px-6 mt-8 grid grid-cols-1 gap-6">
              {filteredShops.map((shop, idx) => (
                <div 
                  key={shop.id} 
                  onClick={() => handleOpenShop(shop)} 
                  className={`bg-white dark:bg-white/5 rounded-[48px] overflow-hidden border border-indigo-50 dark:border-white/10 shadow-xl shadow-indigo-100/40 dark:shadow-none group active:scale-[0.98] transition-all ${idx % 2 === 0 ? 'rounded-br-none' : 'rounded-bl-none'}`}
                >
                  <div className="h-64 relative">
                    <img src={shop.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-6 right-6 glass px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 shadow-xl">
                      <Star size={12} fill="#fbbf24" className="text-amber-400" />
                      <span className="text-[10px] font-black text-indigo-950 dark:text-white">{shop.rating}</span>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black text-indigo-400 dark:text-amber-400/60 uppercase tracking-[0.2em] mb-2 block">{shop.category}</span>
                        <h4 className="font-black text-indigo-950 dark:text-white text-3xl tracking-tighter leading-tight">{shop.name}</h4>
                      </div>
                      <div className={`w-3 h-3 rounded-full mt-2 ${shop.isOpen ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-slate-200 dark:bg-white/20'}`} />
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center gap-2 text-slate-400 dark:text-white/30 text-[10px] font-bold uppercase tracking-widest">
                        <MapPin size={12} className="text-indigo-400 dark:text-amber-400" /> 0.4 MILES
                      </div>
                      <button className="text-[10px] font-black text-indigo-950 dark:text-white uppercase underline decoration-2 underline-offset-4 decoration-amber-400">View Catalog</button>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}

        {view === 'SHOP_DETAIL' && activeShop && (
          <ShopDetail shop={activeShop} onBack={() => setView('HOME')} onStartChat={(s) => { setSelectedShopId(s.id); setView('CHAT'); }} onPlanVisit={handleAddToVisitList} />
        )}

        {view === 'VISIT_LIST' && (
          <VisitList items={visitList} shops={shops} products={products} onRemoveItem={(id) => setVisitList(l => l.filter(i => i.productId !== id))} onVisitShop={handleOpenShop} onExplore={() => setView('HOME')} />
        )}

        {view === 'PRICE_COMPARE' && (
          <div className="px-8">
            <header className="py-14 flex items-center gap-4">
              <button onClick={() => setView('HOME')} className="w-14 h-14 bg-white dark:bg-white/10 rounded-3xl flex items-center justify-center border border-indigo-50 dark:border-white/10 shadow-xl shadow-indigo-100/50 dark:shadow-none text-indigo-950 dark:text-white"><ArrowLeft size={24} strokeWidth={3} /></button>
              <h2 className="text-4xl font-black text-indigo-950 dark:text-white tracking-tighter">Market Pulse</h2>
            </header>
            <div className="space-y-6">
              {products.map(p => {
                const s = shops.find(sh => sh.id === p.shopId);
                return (
                  <div key={p.id} onClick={() => s && handleOpenShop(s)} className="p-6 bg-white dark:bg-white/5 border border-indigo-50 dark:border-white/10 rounded-[40px] flex items-center gap-6 shadow-xl shadow-indigo-100/30 dark:shadow-none active:scale-[0.98] transition-all">
                    <div className="w-20 h-20 rounded-[28px] overflow-hidden bg-slate-50 dark:bg-white/10 shadow-inner"><img src={p.imageUrl} className="w-full h-full object-cover" /></div>
                    <div className="flex-1">
                      <h4 className="font-black text-indigo-950 dark:text-white text-xl leading-none mb-1 tracking-tight">{p.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">at {s?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-indigo-950 dark:text-white tracking-tighter leading-none">${p.price}</p>
                      <span className="text-[10px] font-black text-amber-500 uppercase">{p.stock} units</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === 'PROFILE' && (
          <Profile role={role} isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} onLogout={() => setView('ONBOARDING')} onToggleRole={() => { setRole(r => r === 'BUYER' ? 'SELLER' : 'BUYER'); setView(role === 'BUYER' ? 'SELLER_HUB' : 'HOME'); }} />
        )}

        {view === 'SELLER_HUB' && <SellerHub shop={myShop} onEditShop={() => setView('MANAGE_SHOP')} onAddStock={() => setView('MANAGE_INVENTORY')} />}
        {view === 'MANAGE_INVENTORY' && <ManageInventory shopId={myShop.id} products={products} setProducts={setProducts} onBack={() => setView('SELLER_HUB')} />}
        {view === 'MANAGE_SHOP' && <ManageShop shop={myShop} onSave={(s) => { setShops(prev => prev.map(sh => sh.id === s.id ? s : sh)); setView('SELLER_HUB'); }} onBack={() => setView('SELLER_HUB')} />}

        {isMapView && (
          <div className="fixed inset-0 z-[100] bg-white dark:bg-indigo-950 animate-in slide-in-from-bottom duration-500">
            <header className="px-8 pt-14 pb-6 flex justify-between items-center border-b border-indigo-50 dark:border-white/10">
              <h2 className="text-3xl font-black text-indigo-950 dark:text-white tracking-tighter">Live Map</h2>
              <button onClick={() => setIsMapView(false)} className="w-14 h-14 bg-indigo-50 dark:bg-white/10 rounded-full flex items-center justify-center text-indigo-950 dark:text-white active:rotate-90 transition-transform"><Plus className="rotate-45" size={28} /></button>
            </header>
            <div className="h-full pb-20"><MapPreview shops={shops} onShopClick={handleOpenShop} /></div>
          </div>
        )}
      </div>

      {(view === 'HOME' || view === 'PRICE_COMPARE' || view === 'VISIT_LIST' || view === 'PROFILE' || view === 'SELLER_HUB' || view === 'MANAGE_INVENTORY' || view === 'MANAGE_SHOP') && (
        <Navigation currentView={view} setView={setView} role={role} />
      )}
    </div>
  );
};

export default App;
