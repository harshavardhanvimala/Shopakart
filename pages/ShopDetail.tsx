
import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Heart, Share2, MapPin, Phone, 
  MessageCircle, Star, Clock, ChevronRight, 
  QrCode, Plus, MoreHorizontal, ShoppingList, Check, Map, Play
} from 'lucide-react';
import { Shop } from '../types';
import QRCodeModal from '../components/QRCodeModal';

interface ShopDetailProps {
  shop: Shop;
  onBack: () => void;
  onStartChat: (shop: Shop) => void;
  onPlanVisit: (productId: string, shopId: string, quantity: number) => void;
}

const ShopDetail: React.FC<ShopDetailProps> = ({ shop, onBack, onStartChat, onPlanVisit }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isVisitListBouncing, setIsVisitListBouncing] = useState(false);
  
  const [animatingStockId, setAnimatingStockId] = useState<string | null>(null);
  const prevStocksRef = useRef<{ [id: string]: number }>({});

  useEffect(() => {
    shop.products.forEach(p => {
      const prev = prevStocksRef.current[p.id];
      if (prev !== undefined && prev !== p.stock) {
        setAnimatingStockId(p.id);
        const timer = setTimeout(() => setAnimatingStockId(null), 800);
        return () => clearTimeout(timer);
      }
      prevStocksRef.current[p.id] = p.stock;
    });
  }, [shop.products]);

  const [inputQuantities, setInputQuantities] = useState<{ [id: string]: number }>(
    shop.products.reduce((acc, p) => ({ ...acc, [p.id]: 1 }), {})
  );

  const [lastAdded, setLastAdded] = useState<{ id: string; qty: number } | null>(null);

  const handleCall = () => {
    window.location.href = `tel:${shop.phone.replace(/\s/g, '')}`;
  };

  const handleNavigate = () => {
    const query = encodeURIComponent(shop.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleQuantityChange = (productId: string, val: string) => {
    const qty = parseInt(val) || 0;
    const product = shop.products.find(p => p.id === productId);
    const stock = product?.stock || 0;
    const clampedQty = Math.max(0, Math.min(qty, stock));
    setInputQuantities(prev => ({ ...prev, [productId]: clampedQty }));
  };

  const handleAddToVisitList = (productId: string) => {
    const requestedQty = (inputQuantities[productId] as number) || 0;
    const product = shop.products.find(p => p.id === productId);
    const availableStock = product?.stock || 0;
    
    if (requestedQty > 0 && availableStock >= requestedQty) {
      onPlanVisit(productId, shop.id, requestedQty);
      setLastAdded({ id: productId, qty: requestedQty });
      setIsVisitListBouncing(true);
      setInputQuantities(prev => ({ ...prev, [productId]: 1 }));
      setTimeout(() => {
        setLastAdded(null);
        setIsVisitListBouncing(false);
      }, 1000);
    } else if (requestedQty > availableStock) {
      alert(`The shop only has ${availableStock} in stock right now.`);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24 animate-in slide-in-from-right duration-300">
      <div className="relative h-72 w-full overflow-hidden">
        {shop.imageUrl ? (
          <img src={shop.imageUrl} className="w-full h-full object-cover scale-105" alt={shop.name} />
        ) : (
          <div className="w-full h-full bg-emerald-600 flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            <span className="text-[12rem] font-black text-white/10 italic leading-none select-none transform -rotate-12 translate-x-8 translate-y-4">
              {shop.name.charAt(0)}
            </span>
            <div className="z-10 bg-white/10 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20 shadow-2xl">
              <span className="text-6xl font-black text-white italic drop-shadow-2xl">
                {shop.name.charAt(0)}
              </span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        
        <div className="absolute top-6 left-4 right-4 flex justify-between items-center z-20">
          <button 
            onClick={onBack} 
            className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-slate-900 transition-all active:scale-90 border border-slate-100"
            aria-label="Go back"
          >
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <div className="flex gap-2">
            <button onClick={() => setIsFavorite(!isFavorite)} className={`w-12 h-12 rounded-2xl backdrop-blur-xl flex items-center justify-center text-white transition-all border border-white/20 ${isFavorite ? 'bg-rose-500' : 'bg-white/10'}`}>
              <Heart size={24} fill={isFavorite ? 'white' : 'none'}/>
            </button>
            <div className="relative">
              <button className={`w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-xl transition-all active:scale-90 z-10 ${isVisitListBouncing ? 'scale-110 ring-4 ring-emerald-500/30' : 'scale-100'}`}>
                <Check size={24} className={isVisitListBouncing ? 'animate-bounce' : ''} />
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-black text-white uppercase tracking-wider shadow-sm">{shop.category}</span>
            <div className="flex items-center gap-1 text-yellow-400 drop-shadow-md"><Star size={12} fill="currentColor" /><span className="text-xs text-white font-bold">{shop.rating}</span></div>
          </div>
          <h1 className="text-3xl font-black text-white mb-1 drop-shadow-lg">{shop.name}</h1>
          <p className="text-white/80 text-sm font-medium flex items-center gap-1.5 drop-shadow-md"><MapPin size={14} className="text-emerald-400" /> {shop.address}</p>
        </div>
      </div>

      <div className="p-6">
        {/* Shop Stories Reel */}
        {shop.stories && shop.stories.length > 0 && (
          <section className="mb-8 overflow-hidden">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Daily Stories</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {shop.stories.map(story => (
                <div key={story.id} className="flex-shrink-0 w-20 h-28 rounded-2xl border-2 border-emerald-500 p-0.5 ring-2 ring-white ring-offset-1">
                   <div className="relative w-full h-full rounded-[14px] overflow-hidden group">
                      <img src={story.imageUrl} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Play size={16} fill="white" className="text-white" />
                      </div>
                      <span className="absolute bottom-1.5 left-1.5 text-[6px] font-black text-white bg-black/40 px-1 py-0.5 rounded-md backdrop-blur-sm uppercase">
                        {story.timestamp}
                      </span>
                   </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-3 mb-8">
           <div className={`p-4 rounded-[24px] border flex flex-col items-center gap-1.5 transition-colors ${shop.isOpen ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
             <div className={`w-2 h-2 rounded-full ${shop.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
             <span className={`text-[10px] font-black uppercase tracking-widest ${shop.isOpen ? 'text-emerald-700' : 'text-slate-500'}`}>
               {shop.isOpen ? 'Shop is Open' : 'Currently Closed'}
             </span>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">Last check: 10m ago</p>
           </div>
           <button onClick={() => setShowQR(true)} className="p-4 rounded-[24px] bg-slate-50 border border-slate-100 flex flex-col items-center gap-1.5 active:scale-95 transition-all group">
              <QrCode size={18} className="text-slate-900 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Digital Card</span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Tap to share</p>
           </button>
        </div>

        <p className="text-slate-600 leading-relaxed mb-8 font-medium italic border-l-4 border-emerald-100 pl-4 py-1">"{shop.description}"</p>

        <div className="grid grid-cols-3 gap-4 mb-10">
           <button onClick={handleCall} className="flex flex-col items-center gap-2 p-5 bg-white border border-slate-100 rounded-[28px] active:scale-95 transition-all shadow-sm text-slate-900 group">
              <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 transition-colors"><Phone size={20} /></div>
              <span className="text-[9px] font-black uppercase tracking-widest">Call Shop</span>
           </button>
           <button onClick={() => onStartChat(shop)} className="flex flex-col items-center gap-2 p-5 bg-white border border-slate-100 rounded-[28px] active:scale-95 transition-all shadow-sm text-slate-900 group">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors"><MessageCircle size={20} /></div>
              <span className="text-[9px] font-black uppercase tracking-widest">Live Chat</span>
           </button>
           <button onClick={handleNavigate} className="flex flex-col items-center gap-2 p-5 bg-white border border-slate-100 rounded-[28px] active:scale-95 transition-all shadow-sm text-slate-900 group">
              <div className="w-10 h-10 bg-violet-50 text-violet-500 rounded-2xl flex items-center justify-center group-hover:bg-violet-100 transition-colors"><Map size={20} /></div>
              <span className="text-[9px] font-black uppercase tracking-widest">Navigate</span>
           </button>
        </div>

        <section>
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Current Inventory</h3>
             <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
               <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
               <span className="text-[10px] font-black text-amber-700 uppercase">Live Stock</span>
             </div>
          </div>
          <div className="space-y-4">
            {shop.products.map(p => {
              const currentStock = p.stock || 0;
              const isOutOfStock = currentStock === 0;
              const isRecentlyAdded = lastAdded?.id === p.id;
              const isAnimating = animatingStockId === p.id;
              const inputQty = (inputQuantities[p.id] as number) || 0;
              return (
                <div key={p.id} className={`flex gap-4 p-4 bg-white border rounded-[32px] shadow-sm transition-all duration-300 ${isRecentlyAdded ? 'border-emerald-400 bg-emerald-50/20' : 'border-slate-100'}`}>
                  <div className="relative">
                    <img src={p.imageUrl} className={`w-24 h-24 rounded-[24px] object-cover transition-opacity duration-500 ${isOutOfStock ? 'opacity-30 grayscale' : 'opacity-100'}`} alt={p.name} />
                    {isOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-slate-900/90 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-lg shadow-lg backdrop-blur-sm">Empty</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h4 className={`font-black text-lg leading-tight transition-colors duration-500 ${isOutOfStock ? 'text-slate-400' : 'text-slate-800'}`}>{p.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md transition-all duration-300 transform ${
                          isAnimating ? 'scale-110 ring-2 ring-emerald-300 shadow-md' : 'scale-100'
                        } ${isOutOfStock ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-600'}`}>
                          {isOutOfStock ? 'Sold Out' : `${currentStock} in stock`}
                        </span>
                      </div>
                    </div>
                    <p className={`font-black text-xl transition-colors duration-500 ${isOutOfStock ? 'text-slate-300' : 'text-slate-900'}`}>${p.price.toFixed(2)}</p>
                  </div>
                  <div className="self-center flex flex-col items-center gap-3 relative pr-2">
                    {isRecentlyAdded && (
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 pointer-events-none z-20">
                        <span className="text-emerald-600 font-black text-2xl animate-out fade-out slide-out-to-top-12 duration-1000 fill-mode-forwards">
                          +{lastAdded?.qty}
                        </span>
                      </div>
                    )}
                    {!isOutOfStock && (
                      <div className="flex flex-col gap-2">
                        <input 
                          type="number"
                          min="1"
                          max={currentStock}
                          value={inputQty}
                          onChange={(e) => handleQuantityChange(p.id, e.target.value)}
                          className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-2xl text-center font-black text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all text-sm outline-none"
                        />
                        <button 
                          onClick={() => handleAddToVisitList(p.id)}
                          className={`p-3 rounded-2xl transition-all active:scale-90 flex items-center justify-center shadow-sm ${
                            isRecentlyAdded 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-slate-900 text-white'
                          }`}
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section onClick={handleNavigate} className="mt-12 bg-slate-50 p-6 rounded-[32px] border border-slate-100 group cursor-pointer hover:bg-slate-100 transition-colors">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Visit Today</h3>
           <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-emerald-600 shadow-sm transition-transform group-hover:scale-110">
                 <MapPin size={32} />
              </div>
              <div>
                 <p className="font-bold text-slate-900">Open until 9:00 PM</p>
                 <p className="text-xs text-slate-500 font-medium">Peak hour: 12 PM - 2 PM</p>
              </div>
              <div className="ml-auto">
                 <ChevronRight className="text-slate-300" />
              </div>
           </div>
        </section>
      </div>
      {showQR && <QRCodeModal shopId={shop.id} shopName={shop.name} onClose={() => setShowQR(false)} />}
    </div>
  );
};

export default ShopDetail;
