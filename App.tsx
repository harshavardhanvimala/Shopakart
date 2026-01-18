
import React, { useState } from 'react';
import { AppView, Shop, Role } from './types';
import { MOCK_SHOPS, CATEGORIES, THEMED_TRAILS } from './constants';
import Navigation from './components/Navigation';
import ShopDetail from './pages/ShopDetail';
import ManageShop from './pages/ManageShop';
import SellerHub from './pages/SellerHub';
import MapPreview from './components/MapPreview';
import { 
  MapPin, Search, Bell, 
  Store, Plus, 
  Map as MapIcon, List as ListIcon, User, ShoppingBag, 
  Sparkles, Mic, ArrowRight, Star, ArrowLeft
} from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('ONBOARDING');
  const [role, setRole] = useState<Role>('BUYER');
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isMapView, setIsMapView] = useState(false);

  const handleOpenShop = (shop: Shop) => {
    setSelectedShop(shop);
    setView('SHOP_DETAIL');
  };

  if (view === 'ONBOARDING') {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center p-12 text-center">
        <div className="w-28 h-28 bg-emerald-600 rounded-[3rem] flex items-center justify-center text-white mb-12 shadow-2xl shadow-emerald-200">
          <Store size={56} />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Shopakart</h1>
        <p className="text-slate-500 mb-16 max-w-xs font-medium">Hyper-local commerce designed for your neighborhood.</p>
        
        <div className="w-full space-y-4 max-w-sm">
          <button 
            onClick={() => { setRole('BUYER'); setView('HOME'); }}
            className="w-full py-4 bg-emerald-600 text-white rounded-full font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-emerald-200 active:scale-95 transition-all"
          >
            I want to Buy
          </button>
          <button 
            onClick={() => { setRole('SELLER'); setView('SELLER_HUB'); }}
            className="w-full py-4 bg-white text-slate-900 border-2 border-slate-100 rounded-full font-bold text-lg flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            I'm a Seller
          </button>
        </div>
      </div>
    );
  }

  const renderHome = () => (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Android Search Header */}
      <header className="px-4 pt-4 pb-2 z-40 bg-white">
        <div className="bg-slate-50 rounded-full p-2 flex items-center gap-3 shadow-sm border border-slate-100 mb-4">
          <div className="p-2 text-slate-500"><Search size={22} /></div>
          <input 
            type="text" 
            placeholder="Search neighborhood..."
            className="flex-1 bg-transparent border-none outline-none text-slate-900 font-medium placeholder:text-slate-400"
          />
          <button className="p-2 text-emerald-600 bg-white rounded-full shadow-sm"><Mic size={20} /></button>
          <button 
            onClick={() => setView('ONBOARDING')}
            className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 overflow-hidden"
          >
            <User size={20} />
          </button>
        </div>

        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-full"><MapPin size={16} /></div>
            <span className="text-sm font-bold text-slate-700">Tech Park, Bengaluru</span>
          </div>
          <button 
            onClick={() => setIsMapView(!isMapView)}
            className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white rounded-full text-xs font-bold transition-all"
          >
            {isMapView ? <><ListIcon size={14} /> List</> : <><MapIcon size={14} /> Map</>}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-32 no-scrollbar px-4">
        {isMapView ? (
          <div className="h-full mt-4 rounded-[32px] overflow-hidden border border-slate-100 shadow-inner">
            <MapPreview shops={MOCK_SHOPS} onShopClick={handleOpenShop} />
          </div>
        ) : (
          <main className="space-y-8 mt-6">
            {/* Trail Chips */}
            <section>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {THEMED_TRAILS.map(trail => (
                  <div key={trail.id} className="flex-shrink-0 flex items-center gap-3 bg-slate-50 p-4 rounded-[24px] border border-slate-100 shadow-sm active:scale-95 transition-all">
                    <div className={`w-10 h-10 ${trail.color} rounded-2xl flex items-center justify-center text-white shadow-sm`}>
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{trail.name}</h4>
                      <p className="text-[10px] text-slate-500">Discover more</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* List of Shops - Native Style */}
            <section className="space-y-4">
              <h3 className="text-xl font-medium text-slate-900 px-1">Discover Local</h3>
              {MOCK_SHOPS.map(shop => (
                <div 
                  key={shop.id}
                  onClick={() => handleOpenShop(shop)}
                  className="bg-white p-4 rounded-[32px] border border-slate-100 flex gap-4 shadow-sm active:bg-slate-50 transition-all cursor-pointer"
                >
                  <div className="w-24 h-24 rounded-[24px] overflow-hidden relative flex-shrink-0">
                    <img src={shop.imageUrl} className="w-full h-full object-cover" />
                    {shop.isOpen && (
                      <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                        OPEN
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center gap-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-900 text-lg leading-tight">{shop.name}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="flex items-center gap-1 text-emerald-600 font-bold">
                        <Star size={12} fill="currentColor" /> {shop.rating}
                      </div>
                      <span>•</span>
                      <span>{shop.category}</span>
                      <span>•</span>
                      <span>0.8 mi</span>
                    </div>
                    <div className="flex gap-1 mt-1">
                      {shop.products.slice(0, 1).map(p => (
                        <div key={p.id} className="text-[10px] font-medium px-3 py-1 bg-slate-100 text-slate-700 rounded-full">{p.name} from ${p.price}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </main>
        )}
      </div>
      <Navigation currentView={view} setView={setView} />
    </div>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen relative bg-white overflow-hidden shadow-2xl selection:bg-emerald-100">
      {view === 'HOME' && renderHome()}
      {view === 'SHOP_DETAIL' && selectedShop && (
        <ShopDetail shop={selectedShop} onBack={() => setView('HOME')} onStartChat={() => setView('CHAT_DETAIL')} />
      )}
      {view === 'SELLER_HUB' && (
        <>
          <SellerHub shop={MOCK_SHOPS[0]} onEditShop={() => setView('MANAGE_SHOP')} onAddStock={() => {}} />
          <Navigation currentView={view} setView={setView} />
        </>
      )}
      {view === 'MANAGE_SHOP' && (
        <ManageShop onBack={() => setView('SELLER_HUB')} />
      )}
      {view === 'CHAT_DETAIL' && (
        <div className="h-screen flex flex-col bg-slate-50 animate-in slide-in-from-bottom duration-300">
           <header className="bg-white px-4 py-6 border-b flex items-center gap-4">
              <button onClick={() => setView('SHOP_DETAIL')} className="p-2 rounded-full hover:bg-slate-100 transition-colors"><ArrowLeft size={24}/></button>
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <img src={MOCK_SHOPS[0].imageUrl} className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-900">{MOCK_SHOPS[0].name}</h3>
                    <div className="flex items-center gap-1.5">
                       <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                       <p className="text-xs text-slate-500 font-medium">Online</p>
                    </div>
                 </div>
              </div>
           </header>
           <div className="flex-1 p-6 space-y-4">
              <div className="self-start max-w-[80%] bg-white p-4 rounded-[24px] rounded-tl-none shadow-sm text-sm text-slate-800">
                 Hello! Is the Avocado Toast available today?
              </div>
              <div className="self-end ml-auto max-w-[80%] bg-emerald-700 text-white p-4 rounded-[24px] rounded-tr-none shadow-md text-sm">
                 Yes, we just got a fresh batch of avocados!
              </div>
           </div>
           <div className="p-4 bg-white border-t flex gap-3 items-center pb-12">
              <div className="flex-1 bg-slate-50 rounded-full px-5 py-3 border border-slate-100">
                <input type="text" placeholder="Message shop..." className="w-full bg-transparent border-none outline-none text-sm font-medium" />
              </div>
              <button className="p-4 bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-200 active:scale-90 transition-all">
                <ArrowRight size={20} />
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
