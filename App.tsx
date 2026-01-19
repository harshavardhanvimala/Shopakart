
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AppView, Shop, Product, Role, VisitListItem } from './types';
import { MOCK_SHOPS } from './constants';
import Navigation from './components/Navigation';
import ShopDetail from './pages/ShopDetail';
import ManageShop from './pages/ManageShop';
import SellerHub from './pages/SellerHub';
import ManageInventory from './pages/ManageInventory';
import Profile from './pages/Profile';
import VisitList from './pages/VisitList';
import MapPreview from './components/MapPreview';
import { db } from './database/index'; // Updated import to point to database folder
import { GoogleGenAI } from "@google/genai";
import { 
  MapPin, Search, Plus, 
  Map as MapIcon, User, 
  Star, ArrowLeft, LayoutGrid, Tag,
  ChevronRight, ShoppingBag, Send,
  MoreVertical, CheckCheck, Loader2, Sparkles, Database
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isSmartSearching, setIsSmartSearching] = useState(false);

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
        setTimeout(() => setIsInitializing(false), 800);
      }
    };
    initData();
  }, []);

  useEffect(() => { if (!isInitializing) db.saveData('shops', shops); }, [shops, isInitializing]);
  useEffect(() => { if (!isInitializing) db.saveData('products', products); }, [products, isInitializing]);
  useEffect(() => { if (!isInitializing) db.saveData('visitList', visitList); }, [visitList, isInitializing]);

  const myShop = useMemo(() => shops[0] || MOCK_SHOPS[0], [shops]);
  const activeShop = useMemo(() => shops.find(s => s.id === selectedShopId), [shops, selectedShopId]);

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
      <div className="h-screen bg-white flex flex-col items-center justify-center animate-pulse">
        <div className="w-24 h-24 bg-emerald-600 rounded-[32px] flex items-center justify-center text-white shadow-2xl">
           <Database size={48} />
        </div>
        <p className="mt-8 font-black text-slate-900 uppercase tracking-[0.4em] text-[10px]">Shopakart OS Loading</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white relative overflow-hidden flex flex-col">
      <div className="flex-1 overflow-hidden relative">
        {view === 'ONBOARDING' && (
          <div className="h-full bg-white flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500">
            <div className="relative w-40 h-40 bg-emerald-600 rounded-[3rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-200 mb-12">
              <span className="text-8xl font-black tracking-tighter italic">S</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">Shopakart</h1>
            <p className="text-slate-500 mb-16 max-w-xs font-bold leading-relaxed">Local shopping, redefined for your neighborhood.</p>
            <div className="w-full space-y-4 max-w-xs">
              <button onClick={() => { setRole('BUYER'); setView('HOME'); }} className="w-full py-5 bg-emerald-600 text-white rounded-[28px] font-black text-lg active:scale-95 transition-all shadow-xl shadow-emerald-100">Browse Nearby</button>
              <button onClick={() => { setRole('SELLER'); setView('SELLER_HUB'); }} className="w-full py-5 bg-slate-900 text-white rounded-[28px] font-black text-lg active:scale-95 transition-all">Merchant Portal</button>
            </div>
          </div>
        )}

        {view === 'HOME' && (
          <div className="h-full scroll-container pb-32 px-6">
            <header className="py-10 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Discover</h1>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1"><MapPin size={12} fill="currentColor" /> Indiranagar, BLR</p>
              </div>
              <button onClick={() => setView('PROFILE')} className="w-14 h-14 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-900 border border-slate-200"><User size={28} /></button>
            </header>

            <div onClick={() => setView('PRICE_COMPARE')} className="bg-slate-100 rounded-[32px] p-5 flex items-center gap-4 mb-8 border border-slate-200 active:scale-95 transition-all">
              <Search className="text-slate-500" />
              <span className="text-slate-500 font-bold">Search local stocks...</span>
              <Sparkles className="ml-auto text-emerald-600" />
            </div>

            <section className="mb-10">
              <div onClick={() => setIsMapView(true)} className="relative h-48 w-full bg-slate-200 rounded-[40px] overflow-hidden shadow-inner group cursor-pointer">
                <MapPreview shops={shops} onShopClick={handleOpenShop} />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h4 className="font-black text-xl">Area Radar</h4>
                  <p className="text-[10px] font-black uppercase opacity-80">{shops.length} Active Stores</p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Featured Merchants</h3>
              {shops.map(shop => (
                <div key={shop.id} onClick={() => handleOpenShop(shop)} className="bg-white p-5 rounded-[40px] border border-slate-100 flex gap-5 shadow-sm active:bg-slate-50 transition-all cursor-pointer group">
                  <div className="w-24 h-24 rounded-[32px] overflow-hidden flex-shrink-0"><img src={shop.imageUrl} className="w-full h-full object-cover" /></div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="font-black text-slate-900 text-xl leading-tight">{shop.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{shop.category}</span>
                      <span className="text-[10px] font-black text-slate-300">•</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">0.4 MI</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-black text-sm mt-2"><Star size={14} fill="currentColor" /> {shop.rating}</div>
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
          <div className="h-full scroll-container px-6">
            <header className="py-10 flex items-center gap-4">
              <button onClick={() => setView('HOME')} className="p-3 bg-slate-100 rounded-2xl"><ArrowLeft /></button>
              <h2 className="text-2xl font-black text-slate-900">Compare Stock</h2>
            </header>
            <div className="space-y-4">
              {products.slice(0, 10).map(p => {
                const s = shops.find(sh => sh.id === p.shopId);
                return (
                  <div key={p.id} onClick={() => s && handleOpenShop(s)} className="p-5 bg-white border border-slate-100 rounded-[32px] flex items-center gap-4 shadow-sm active:scale-[0.98] transition-all">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50"><img src={p.imageUrl} className="w-full h-full object-cover" /></div>
                    <div className="flex-1">
                      <h4 className="font-black text-slate-900">{p.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">at {s?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-emerald-600">${p.price}</p>
                      <p className="text-[10px] font-black text-slate-300 uppercase">{p.stock} in stock</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === 'PROFILE' && (
          <Profile role={role} onLogout={() => setView('ONBOARDING')} onToggleRole={() => { setRole(r => r === 'BUYER' ? 'SELLER' : 'BUYER'); setView(role === 'BUYER' ? 'SELLER_HUB' : 'HOME'); }} />
        )}

        {view === 'SELLER_HUB' && (
          <SellerHub shop={myShop} onEditShop={() => setView('MANAGE_SHOP')} onAddStock={() => setView('MANAGE_INVENTORY')} />
        )}

        {view === 'MANAGE_INVENTORY' && (
          <ManageInventory shopId={myShop.id} products={products} setProducts={setProducts} onBack={() => setView('SELLER_HUB')} />
        )}

        {view === 'MANAGE_SHOP' && (
          <ManageShop shop={myShop} onSave={(s) => { setShops(prev => prev.map(sh => sh.id === s.id ? s : sh)); setView('SELLER_HUB'); }} onBack={() => setView('SELLER_HUB')} />
        )}

        {isMapView && (
          <div className="fixed inset-0 z-[100] bg-white animate-in slide-in-from-bottom duration-500">
            <header className="p-8 flex justify-between items-center border-b border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Area Radar</h2>
              <button onClick={() => setIsMapView(false)} className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600"><Plus className="rotate-45" /></button>
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
