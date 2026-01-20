
import React, { useState } from 'react';
import { 
  ArrowLeft, Heart, MapPin, Phone, 
  MessageCircle, Star, Clock, QrCode, Plus, Map
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
  const [inputQuantities, setInputQuantities] = useState<{ [id: string]: number }>(
    shop.products.reduce((acc, p) => ({ ...acc, [p.id]: 1 }), {})
  );

  const handleCall = () => window.location.href = `tel:${shop.phone.replace(/\s/g, '')}`;
  const handleNavigate = () => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address)}`, '_blank');

  const handleQuantityChange = (productId: string, val: string) => {
    const qty = Math.max(0, Math.min(parseInt(val) || 0, shop.products.find(p => p.id === productId)?.stock || 0));
    setInputQuantities(prev => ({ ...prev, [productId]: qty }));
  };

  return (
    <div className="bg-white dark:bg-indigo-950 animate-in slide-in-from-right duration-500 transition-colors">
      {/* Editorial Parallax Header */}
      <div className="relative h-[560px] w-full overflow-hidden">
        {shop.imageUrl ? (
          <img src={shop.imageUrl} className="w-full h-full object-cover" alt={shop.name} />
        ) : (
          <div className="w-full h-full bg-indigo-950 flex items-center justify-center relative">
             <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_left,_#4f46e5,_transparent)]" />
             <span className="text-[22rem] font-black text-white/5 italic select-none transform -rotate-12 translate-x-12 translate-y-12 leading-none">
              {shop.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-indigo-950 via-indigo-950/20 to-transparent" />
        
        <div className="absolute top-[calc(var(--android-safe-top)+2.5rem)] left-8 right-8 flex justify-between items-center z-20">
          <button onClick={onBack} className="w-14 h-14 rounded-[28px] glass flex items-center justify-center text-indigo-950 dark:text-white active:scale-90 transition-all shadow-2xl"><ArrowLeft size={28} strokeWidth={3} /></button>
          <div className="flex gap-4">
            <button onClick={() => setIsFavorite(!isFavorite)} className={`w-14 h-14 rounded-[28px] glass flex items-center justify-center transition-all ${isFavorite ? 'bg-rose-500 text-white border-rose-400' : 'text-indigo-950 dark:text-white'}`}><Heart size={28} fill={isFavorite ? 'currentColor' : 'none'} /></button>
            <button onClick={() => setShowQR(true)} className="w-14 h-14 rounded-[28px] glass flex items-center justify-center text-indigo-950 dark:text-white"><QrCode size={28} /></button>
          </div>
        </div>

        <div className="absolute bottom-16 left-10 right-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-indigo-950 dark:bg-amber-400 text-white dark:text-indigo-950 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.25em] shadow-2xl shadow-indigo-950/40 dark:shadow-amber-900/40">{shop.category}</span>
            <div className="flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest glass shadow-sm">
              <div className={`w-2.5 h-2.5 rounded-full ${shop.isOpen ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)] animate-pulse' : 'bg-slate-300 dark:bg-white/20'}`} />
              <span className="dark:text-white">{shop.isOpen ? 'Active Now' : 'Closed'}</span>
            </div>
          </div>
          <h1 className="text-7xl font-black text-indigo-950 dark:text-white mb-4 tracking-[calc(-0.06em)] leading-[0.75]">{shop.name}</h1>
          <div className="flex items-center gap-10 text-sm font-bold text-slate-400">
            <div className="flex items-center gap-2.5"><Star size={22} fill="#fbbf24" className="text-amber-400" /> <span className="text-indigo-950 dark:text-white text-lg">4.9</span></div>
            <div className="flex items-center gap-2.5"><MapPin size={22} className="text-indigo-400 dark:text-amber-400" /> <span className="text-indigo-950 dark:text-white text-lg">0.4 MI</span></div>
          </div>
        </div>
      </div>

      <div className="px-10 pt-10">
        <p className="text-slate-500 dark:text-white/40 leading-relaxed mb-16 font-medium italic border-l-[16px] border-amber-400/20 pl-10 py-6 text-3xl tracking-tighter">"{shop.description}"</p>

        <div className="grid grid-cols-3 gap-6 mb-20">
           <button onClick={handleCall} className="flex flex-col items-center gap-4 p-8 bg-indigo-50/50 dark:bg-white/5 border border-indigo-100/50 dark:border-white/10 rounded-[48px] active:scale-95 transition-all text-indigo-950 dark:text-white shadow-xl shadow-indigo-100/20 dark:shadow-none group">
              <div className="w-16 h-16 bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-300 rounded-[28px] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"><Phone size={32} /></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Voice</span>
           </button>
           <button onClick={() => onStartChat(shop)} className="flex flex-col items-center gap-4 p-8 bg-amber-50/50 dark:bg-amber-400/10 border border-amber-100/50 dark:border-amber-400/20 rounded-[48px] active:scale-95 transition-all text-indigo-950 dark:text-white shadow-xl shadow-amber-100/20 dark:shadow-none group">
              <div className="w-16 h-16 bg-white dark:bg-white/10 text-amber-500 rounded-[28px] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"><MessageCircle size={32} /></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Chat</span>
           </button>
           <button onClick={handleNavigate} className="flex flex-col items-center gap-4 p-8 bg-indigo-900 dark:bg-white/10 text-white rounded-[48px] active:scale-95 transition-all shadow-xl shadow-indigo-900/30 dark:shadow-none group border dark:border-white/10">
              <div className="w-16 h-16 bg-white/10 dark:bg-white/20 text-white rounded-[28px] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"><Map size={32} /></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Route</span>
           </button>
        </div>

        <section className="mb-20">
          <div className="flex justify-between items-end mb-12 px-2">
             <h3 className="text-xs font-black text-indigo-950/20 dark:text-white/10 uppercase tracking-[0.5em]">Live Catalog</h3>
             <div className="flex items-center gap-2.5 text-[10px] font-black text-amber-600 dark:text-amber-400 glass px-6 py-2.5 rounded-full border border-amber-100 dark:border-white/10 shadow-xl">
               <Clock size={14} strokeWidth={3} /> UPDATED REALTIME
             </div>
          </div>
          <div className="space-y-10">
            {shop.products.map(p => {
              const isOutOfStock = p.stock === 0;
              const inputQty = inputQuantities[p.id] || 0;
              return (
                <div key={p.id} className="bg-white dark:bg-white/5 border border-indigo-50 dark:border-white/10 rounded-[64px] p-8 flex gap-10 shadow-[0_25px_60px_-15px_rgba(30,27,75,0.08)] dark:shadow-none group active:scale-[0.99] transition-all">
                  <div className="w-44 h-44 rounded-[48px] overflow-hidden bg-slate-50 dark:bg-white/10 border border-indigo-50 dark:border-white/10 flex-shrink-0 relative shadow-2xl">
                    <img src={p.imageUrl} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? 'opacity-20 grayscale' : ''}`} />
                    {isOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center bg-indigo-950/5 dark:bg-white/5 backdrop-blur-[2px]">
                        <span className="bg-indigo-950 dark:bg-white text-white dark:text-indigo-950 text-[10px] font-black uppercase px-5 py-2.5 rounded-2xl shadow-2xl">SOLDOUT</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="font-black text-indigo-950 dark:text-white text-4xl tracking-tighter leading-none mb-3">{p.name}</h4>
                    <p className="text-5xl font-black text-amber-500 tracking-tighter mb-5">${p.price.toFixed(2)}</p>
                    <div className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] w-fit border ${isOutOfStock ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-100 dark:border-rose-500/20' : 'bg-indigo-50 dark:bg-white/10 text-indigo-500 dark:text-white/40 border-indigo-100 dark:border-white/10'}`}>
                      {p.stock} {p.unit} IN HOUSE
                    </div>
                  </div>
                  {!isOutOfStock && (
                    <div className="flex flex-col items-center gap-5 self-center glass p-4 rounded-[44px] border border-white dark:border-white/10 shadow-xl">
                      <input type="number" value={inputQty} onChange={(e) => handleQuantityChange(p.id, e.target.value)} className="w-16 h-16 bg-white dark:bg-white/10 border border-indigo-100 dark:border-white/20 rounded-3xl text-center font-black text-2xl dark:text-white outline-none focus:ring-4 focus:ring-amber-400/20 shadow-sm transition-all" />
                      <button onClick={() => onPlanVisit(p.id, shop.id, inputQty)} className="w-16 h-16 bg-indigo-950 dark:bg-amber-400 text-white dark:text-indigo-950 rounded-3xl flex items-center justify-center active:scale-90 transition-transform shadow-2xl shadow-indigo-950/40 dark:shadow-amber-900/40"><Plus size={36} strokeWidth={3} /></button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="fixed bottom-36 left-12 right-12 z-[100]">
        <button onClick={() => onStartChat(shop)} className="w-full py-8 bg-indigo-950 dark:bg-white text-white dark:text-indigo-950 rounded-[44px] font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-6 active:scale-95 transition-all shadow-[0_30px_70px_-10px_rgba(30,27,75,0.6)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
           <div className="w-8 h-8 bg-amber-400 dark:bg-indigo-950 rounded-xl flex items-center justify-center text-indigo-950 dark:text-amber-400 shadow-lg shadow-amber-400/30 dark:shadow-none"><MessageCircle size={20} strokeWidth={3} /></div>
           Reserve via Concierge
        </button>
      </div>

      {showQR && <QRCodeModal shopId={shop.id} shopName={shop.name} onClose={() => setShowQR(false)} />}
    </div>
  );
};

export default ShopDetail;
