
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
import { db } from './database';
import { GoogleGenAI } from "@google/genai";
import { 
  MapPin, Search, Plus, 
  Map as MapIcon, User, 
  Mic, Star, ArrowLeft, LayoutGrid, Tag,
  ChevronRight, ShoppingBag, Send,
  MoreVertical, CheckCheck, Loader2, Sparkles, X, Database
} from 'lucide-react';

const App: React.FC = () => {
  // --- Database & State Management ---
  const [isInitializing, setIsInitializing] = useState(true);
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [visitList, setVisitList] = useState<VisitListItem[]>([]);

  // Initial Load from Database
  useEffect(() => {
    const initData = async () => {
      try {
        await db.init();
        
        const storedShops = await db.getData<Shop[]>('shops');
        const storedProducts = await db.getData<Product[]>('products');
        const storedVisitList = await db.getData<VisitListItem[]>('visitList');

        if (storedShops) {
          setShops(storedShops);
        } else {
          setShops(MOCK_SHOPS);
          await db.saveData('shops', MOCK_SHOPS);
        }

        if (storedProducts) {
          setProducts(storedProducts);
        } else {
          const initialProducts = MOCK_SHOPS.flatMap(s => s.products.map(p => ({ ...p, shopId: s.id })));
          setProducts(initialProducts);
          await db.saveData('products', initialProducts);
        }

        if (storedVisitList) {
          setVisitList(storedVisitList);
        } else {
          setVisitList([]);
          await db.saveData('visitList', []);
        }
      } catch (error) {
        console.error("Database initialization failed:", error);
      } finally {
        setTimeout(() => setIsInitializing(false), 800);
      }
    };

    initData();
  }, []);

  // Save hooks
  useEffect(() => {
    if (!isInitializing) db.saveData('shops', shops);
  }, [shops, isInitializing]);

  useEffect(() => {
    if (!isInitializing) db.saveData('products', products);
  }, [products, isInitializing]);

  useEffect(() => {
    if (!isInitializing) db.saveData('visitList', visitList);
  }, [visitList, isInitializing]);

  const [view, setView] = useState<AppView>('ONBOARDING');
  const [role, setRole] = useState<Role>('BUYER');
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [isMapView, setIsMapView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSmartSearching, setIsSmartSearching] = useState(false);
  const [smartSearchActive, setSmartSearchActive] = useState(false);

  // Seller context (mocking the first shop as "owned" by the merchant)
  const myShop = useMemo(() => shops[0] || MOCK_SHOPS[0], [shops]);
  const activeShop = useMemo(() => shops.find(s => s.id === selectedShopId), [shops, selectedShopId]);

  const updateShop = (updatedShop: Shop) => {
    setShops(prev => prev.map(s => s.id === updatedShop.id ? updatedShop : s));
  };

  // --- Search & Compare Logic ---
  const compareResults = useMemo(() => {
    if (!searchQuery) return [];
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => a.price - b.price);
  }, [products, searchQuery]);

  const handleSmartSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSmartSearching(true);
    setSmartSearchActive(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are a local shopping assistant. The user is looking for: "${searchQuery}". 
      Available Products: ${products.map(p => p.name).join(', ')}. 
      Available Shops: ${shops.map(s => s.name).join(', ')}.
      Suggest the best product or shop from the list above. Return ONLY the name of the most relevant item. If nothing matches well, return "none".`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      
      const result = response.text.trim().toLowerCase();
      if (result !== 'none') {
        const foundProduct = products.find(p => p.name.toLowerCase().includes(result));
        const foundShop = shops.find(s => s.name.toLowerCase().includes(result));
        
        if (foundShop) {
          handleOpenShop(foundShop);
        } else if (foundProduct) {
          const shop = shops.find(s => s.id === foundProduct.shopId);
          if (shop) handleOpenShop(shop);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSmartSearching(false);
    }
  };

  const handleOpenShop = (shop: Shop) => {
    setSelectedShopId(shop.id);
    setView('SHOP_DETAIL');
    setIsMapView(false);
    setSmartSearchActive(false);
  };

  const handleStartChat = (shop: Shop) => {
    setSelectedShopId(shop.id);
    setView('CHAT');
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

  const handleRemoveFromVisitList = (productId: string) => {
    setVisitList(prev => prev.filter(item => item.productId !== productId));
  };

  const handleLogout = () => {
    setView('ONBOARDING');
  };

  const toggleRole = () => {
    setRole(prev => prev === 'BUYER' ? 'SELLER' : 'BUYER');
    setView(role === 'BUYER' ? 'SELLER_HUB' : 'HOME');
  };

  const handleClearDatabase = async () => {
    if (confirm("Reset database? This will restore mock data and delete all your changes.")) {
      await db.clearAll();
      window.location.reload();
    }
  };

  if (isInitializing) {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center animate-in fade-in">
        <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center text-white animate-pulse shadow-2xl shadow-emerald-100">
           <Database size={40} />
        </div>
        <p className="mt-6 font-black text-slate-400 uppercase tracking-[0.3em] text-[10px]">Initializing Local DB</p>
      </div>
    );
  }

  if (view === 'ONBOARDING') {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center p-12 text-center animate-in fade-in">
        <div className="relative mb-12 group cursor-pointer">
          <div className="absolute -inset-4 bg-emerald-100/50 rounded-full blur-2xl group-hover:bg-emerald-200/50 transition-all duration-700"></div>
          <div className="relative w-32 h-32 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-200 rotate-3 group-hover:rotate-0 transition-transform duration-500">
            <div className="absolute -top-2 -right-2 bg-emerald-400 p-2 rounded-xl shadow-lg border-2 border-white">
              <ShoppingBag size={20} className="text-white" />
            </div>
            <span className="text-6xl font-black tracking-tighter italic">S</span>
          </div>
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">Shopakart</h1>
        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-6">Retail Connect</p>
        <p className="text-slate-500 mb-16 max-w-xs font-medium leading-relaxed">The pulse of your local neighborhood merchants in your pocket.</p>
        <div className="w-full space-y-4 max-w-sm">
          <button 
            onClick={() => { setRole('BUYER'); setView('HOME'); }}
            className="w-full py-5 bg-emerald-600 text-white rounded-[24px] font-black text-lg shadow-xl shadow-emerald-200 active:scale-95 transition-all"
          >
            Explore Nearby
          </button>
          <button 
            onClick={() => { setRole('SELLER'); setView('SELLER_HUB'); }}
            className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-lg active:scale-95 transition-all"
          >
            Merchant Portal
          </button>
        </div>
      </div>
    );
  }

  const renderHome = () => (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <header className="px-6 pt-10 pb-4 z-40 bg-white border-b border-slate-50">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl italic shadow-lg shadow-emerald-100">S</div>
             <div>
                <h1 className="text-xl font-black text-slate-900 leading-tight">Shopakart</h1>
                <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[9px] uppercase tracking-widest">
                  <MapPin size={10} fill="currentColor" />
                  <span>Indiranagar</span>
                </div>
             </div>
          </div>
          <button onClick={() => setView('PROFILE')} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 hover:text-emerald-600 transition-colors"><User size={24} /></button>
        </div>
        <div className="bg-slate-100 rounded-2xl p-1 flex items-center gap-2 mb-2 group focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 text-slate-400">
            <Search size={20} className="text-slate-500" />
            <input 
              type="text" 
              placeholder="Search local stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setView('PRICE_COMPARE')}
              onKeyDown={(e) => e.key === 'Enter' && handleSmartSearch()}
              className="bg-transparent border-none outline-none text-slate-900 font-bold placeholder:text-slate-500 w-full text-sm"
            />
          </div>
          <button 
            onClick={handleSmartSearch}
            className="p-3 text-emerald-600 bg-white rounded-xl shadow-sm active:scale-95 transition-all hover:bg-emerald-50"
          >
            {isSmartSearching ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-32 no-scrollbar">
        <section className="px-6 mt-6 mb-8">
           <div onClick={() => setIsMapView(true)} className="relative h-44 w-full bg-slate-100 rounded-[32px] overflow-hidden border border-slate-200 shadow-inner group cursor-pointer">
              <div className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all opacity-40">
                 <MapPreview shops={shops} onShopClick={handleOpenShop} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 flex items-center gap-3 text-white">
                 <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center"><MapIcon size={20} /></div>
                 <div>
                    <h4 className="font-black text-sm">Radar View</h4>
                    <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{shops.length} merchants nearby</p>
                 </div>
              </div>
           </div>
        </section>

        <section className="mb-8">
          <div className="px-6 flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Pulse</h3>
            <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[10px] uppercase">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto px-6 pb-2 no-scrollbar">
            {products.slice(0, 6).map((item, idx) => {
              const shop = shops.find(s => s.id === item.shopId);
              return (
                <div key={idx} onClick={() => shop && handleOpenShop(shop)} className="flex-shrink-0 w-40 bg-white border border-slate-100 rounded-[28px] p-2 shadow-sm active:scale-95 transition-all cursor-pointer group">
                  <div className="relative h-32 rounded-[20px] overflow-hidden mb-2">
                    <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-[8px] font-black text-white uppercase">
                      {item.stock} left
                    </div>
                  </div>
                  <div className="px-1">
                    <h4 className="font-black text-xs text-slate-900 truncate">{item.name}</h4>
                    <p className="text-[9px] font-bold text-slate-400 truncate">@ {shop?.name}</p>
                    <p className="text-sm font-black text-emerald-600 mt-1">${item.price}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-6 space-y-4 pb-12">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Merchants</h3>
          {shops.map(shop => (
            <div 
              key={shop.id}
              onClick={() => handleOpenShop(shop)}
              className="bg-white p-5 rounded-[32px] border border-slate-100 flex gap-4 shadow-sm active:bg-slate-50 transition-all cursor-pointer group"
            >
              <div className="w-20 h-20 rounded-[24px] overflow-hidden relative flex-shrink-0">
                <img src={shop.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-start">
                  <h4 className="font-black text-slate-900 text-lg leading-tight">{shop.name}</h4>
                  <div className="flex items-center gap-1 text-emerald-600 font-black text-xs">
                    <Star size={12} fill="currentColor" /> {shop.rating}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  <span>{shop.category}</span>
                  <span>•</span>
                  <span>0.4 mi</span>
                </div>
              </div>
              <div className="self-center">
                <ChevronRight size={20} className="text-slate-300" />
              </div>
            </div>
          ))}
        </section>
      </div>
      <Navigation currentView={view} setView={setView} role={role} />
    </div>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen relative bg-white overflow-hidden shadow-2xl selection:bg-emerald-100">
      {view === 'HOME' && renderHome()}
      
      {view === 'PRICE_COMPARE' && (
        <div className="h-screen bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
           <header className="px-6 pt-12 pb-6 border-b">
              <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setView('HOME')} className="p-2 -ml-2 rounded-full hover:bg-slate-50" aria-label="Go back">
                  <ArrowLeft className="text-slate-900" size={24} />
                </button>
                <h2 className="text-xl font-black text-slate-900">Price Compare</h2>
              </div>
              <div className="bg-slate-100 rounded-2xl px-4 py-3 flex items-center gap-3">
                <Search size={20} className="text-slate-500" />
                <input 
                  autoFocus
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSmartSearch()}
                  placeholder="What are you looking for?"
                  className="bg-transparent border-none outline-none text-slate-900 font-bold w-full placeholder:text-slate-500"
                />
                <button onClick={handleSmartSearch} className="text-emerald-600">
                   {isSmartSearching ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                </button>
              </div>
           </header>
           <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-32">
              {compareResults.length > 0 ? (
                compareResults.map((p, idx) => {
                  const shop = shops.find(s => s.id === p.shopId);
                  const isLowest = idx === 0;
                  return (
                    <div key={p.id} onClick={() => handleOpenShop(shop!)} className={`p-4 rounded-[28px] border-2 transition-all flex gap-4 items-center cursor-pointer ${isLowest ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-100'}`}>
                       <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm">
                          <img src={p.imageUrl} className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1">
                          <h4 className="font-black text-slate-900 leading-tight">{p.name}</h4>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{shop?.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[10px] font-black px-2 py-0.5 bg-white border rounded shadow-sm text-slate-700">{p.stock} in stock</span>
                             {isLowest && <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-500 text-white rounded shadow-sm flex items-center gap-1"><Tag size={10} /> Lowest Price</span>}
                          </div>
                       </div>
                       <div className="text-right">
                          <p className={`text-xl font-black ${isLowest ? 'text-emerald-600' : 'text-slate-900'}`}>${p.price}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">0.4 miles</p>
                       </div>
                    </div>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-64 opacity-30">
                   <LayoutGrid size={64} />
                   <p className="mt-4 font-black uppercase tracking-widest text-xs">Start searching local stocks</p>
                </div>
              )}
           </div>
           <Navigation currentView={view} setView={setView} role={role} />
        </div>
      )}

      {view === 'VISIT_LIST' && (
        <>
          <VisitList 
            items={visitList}
            shops={shops}
            products={products}
            onRemoveItem={handleRemoveFromVisitList}
            onVisitShop={(shop) => handleOpenShop(shop)}
            onExplore={() => setView('HOME')}
          />
          <Navigation currentView={view} setView={setView} role={role} />
        </>
      )}

      {view === 'SHOP_DETAIL' && activeShop && (
        <ShopDetail 
          shop={activeShop} 
          onBack={() => setView('HOME')} 
          onStartChat={handleStartChat} 
          onPlanVisit={handleAddToVisitList}
        />
      )}

      {view === 'CHAT' && activeShop && (
        <ChatRoom 
          shop={activeShop} 
          onBack={() => setView('SHOP_DETAIL')} 
        />
      )}

      {view === 'SELLER_HUB' && (
        <>
          <SellerHub 
            shop={myShop} 
            onEditShop={() => setView('MANAGE_SHOP')} 
            onAddStock={() => setView('MANAGE_INVENTORY')} 
          />
          <Navigation currentView={view} setView={setView} role={role} />
        </>
      )}

      {view === 'MANAGE_INVENTORY' && (
        <ManageInventory 
          shopId={myShop.id}
          products={products}
          setProducts={setProducts}
          onBack={() => setView('SELLER_HUB')}
        />
      )}

      {view === 'MANAGE_SHOP' && (
        <ManageShop 
          shop={myShop} 
          onSave={(updated) => { updateShop(updated); setView('SELLER_HUB'); }}
          onBack={() => setView('SELLER_HUB')} 
        />
      )}

      {view === 'PROFILE' && (
        <>
          <Profile 
            role={role} 
            onLogout={handleLogout} 
            onNavigateToSellerHub={() => setView('SELLER_HUB')}
            onToggleRole={toggleRole}
            onResetDB={handleClearDatabase}
          />
          <Navigation currentView={view} setView={setView} role={role} />
        </>
      )}

      {isMapView && (
        <div className="fixed inset-0 z-[100] bg-white animate-in slide-in-from-bottom duration-300">
          <header className="px-6 pt-12 pb-4 flex justify-between items-center border-b">
            <h2 className="text-xl font-black text-slate-900">Area Radar</h2>
            <button onClick={() => setIsMapView(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"><Plus size={20} className="rotate-45" /></button>
          </header>
          <div className="h-full pb-20">
            <MapPreview shops={shops} onShopClick={handleOpenShop} />
          </div>
        </div>
      )}
    </div>
  );
};

interface ChatRoomProps {
  shop: Shop;
  onBack: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ shop, onBack }) => {
  const [messages, setMessages] = useState<{ id: string; text: string; sender: 'user' | 'merchant'; time: string }[]>([
    { id: '1', text: `Hello! Welcome to ${shop.name}. How can we help you today?`, sender: 'merchant', time: '10:00 AM' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { 
      id: Date.now().toString(), 
      text: input, 
      sender: 'user' as const, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "Yes, we have that in stock!",
        "Let me check our storage for you.",
        "We're open until 9 PM today.",
        "That item is one of our best sellers!"
      ];
      const merchantMsg = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'merchant' as const,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, merchantMsg]);
    }, 1500);
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col animate-in slide-in-from-right duration-300">
      <header className="px-6 pt-12 pb-4 bg-white border-b flex items-center gap-4 z-10 shadow-sm">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-900 transition-colors"><ArrowLeft size={24} /></button>
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-slate-100">
           <img src={shop.imageUrl} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h2 className="font-black text-slate-900 leading-tight">{shop.name}</h2>
          <div className="flex items-center gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Now</span>
          </div>
        </div>
        <button className="p-2 text-slate-400"><MoreVertical size={20} /></button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
             <div className={`max-w-[80%] p-4 rounded-[24px] shadow-sm ${
               m.sender === 'user' 
               ? 'bg-emerald-600 text-white rounded-tr-none' 
               : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
             }`}>
                <p className="text-sm font-medium leading-relaxed">{m.text}</p>
                <div className={`flex items-center gap-1 mt-1 opacity-50 justify-end`}>
                   <span className="text-[9px] font-bold">{m.time}</span>
                   {m.sender === 'user' && <CheckCheck size={10} />}
                </div>
             </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 flex gap-1 shadow-sm">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t pb-8">
        <div className="bg-slate-100 rounded-[24px] p-2 flex items-center gap-2 border border-slate-200 focus-within:bg-white focus-within:border-emerald-500 transition-all">
           <input 
             type="text" 
             value={input}
             onChange={e => setInput(e.target.value)}
             onKeyDown={e => e.key === 'Enter' && handleSend()}
             placeholder="Ask about items or hours..."
             className="flex-1 bg-transparent border-none outline-none px-4 py-2 font-bold text-slate-900 placeholder:text-slate-400 text-sm"
           />
           <button 
             onClick={handleSend}
             className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-50"
             disabled={!input.trim()}
           >
             <Send size={18} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default App;
