
import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Heart, Share2, MapPin, Phone, 
  MessageCircle, Star, Clock, ChevronRight, 
  QrCode, Plus, Check, Map, Play
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
    <div className="h-full bg-white animate-in slide-in-from-right duration-500 overflow-y-auto pb-32">
      {/* Immersive Android Header */}
      <div className="relative h-96 w-full overflow-hidden">
        {shop.imageUrl ? (
          <img src={shop.imageUrl} className="w-full h-full object-cover scale-105" alt={shop.name} />
        ) : (
          <div className="w-full h-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_left,_#10b981,_transparent)]" />
             <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_bottom_right,_#6366f1,_transparent)]" />
             <span className="text-[14rem] font-black text-white/10 italic leading-none select-none transform -rotate-12 translate-x-8 translate-y-4">
              {shop.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        <div className="absolute top-[calc(var(--android-safe-top)+1.5rem)] left-6 right-6 flex justify-between items-center z-20">
          <button onClick={onBack} className="w-12 h-12 rounded-[20px] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white active:scale-90 transition-all"><ArrowLeft size={24} strokeWidth={3} /></button>
          <div className="flex gap-3">
            <button onClick={() => setIsFavorite(!isFavorite)} className={`w-12 h-12 rounded-[20px] backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all ${isFavorite ? 'bg-rose-500 text-white' : 'bg-white/10 text-white'}`}><Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} /></button>
            <button onClick={() => setShowQR(true)} className="w-12 h-12 rounded-[20px] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white"><QrCode size={24} /></button>
          </div>
        </div>

        <div className="absolute bottom-10 left-8 right-8 text-white">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{shop.category}</span>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${shop.isOpen ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'}`}>
              <div className={`w-2 h-2 rounded-full ${shop.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              {shop.isOpen ? 'Live' : 'Closed'}
            </div>
          </div>
          <h1 className="text-5xl font-black mb-2 tracking-tighter leading-[0.9]">{shop.name}</h1>
          <div className="flex items-center gap-6 text-sm font-bold opacity-80">
            <div className="flex items-center gap-2"><Star size={16} fill="#fbbf24" className="text-amber-400" /> {shop.rating}</div>
            <div className="flex items-center gap-2"><MapPin size={16} className="text-emerald-400" /> 0.4 mi away</div>
          </div>
        </div>
      </div>

      <div className="px-8 pt-10">
        <p className="text-slate-700 leading-relaxed mb-10 font-medium italic border-l-8 border-emerald-50 pl-6 py-2 text-lg">"{shop.description}"</p>

        <div className="grid grid-cols-3 gap-4 mb-12">
           <button onClick={handleCall} className="flex flex-col items-center gap-2 p-6 bg-slate-50 border border-slate-100 rounded-[32px] active:scale-95 transition-all text-slate-900 group">
              <div className="w-12 h-12 bg-white text-blue-500 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><Phone size={24} /></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Call</span>
           </button>
           <button onClick={() => onStartChat(shop)} className="flex flex-col items-center gap-2 p-6 bg-slate-50 border border-slate-100 rounded-[32px] active:scale-95 transition-all text-slate-900 group">
              <div className="w-12 h-12 bg-white text-emerald-500 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><MessageCircle size={24} /></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Chat</span>
           </button>
           <button onClick={handleNavigate} className="flex flex-col items-center gap-2 p-6 bg-slate-50 border border-slate-100 rounded-[32px] active:scale-95 transition-all text-slate-900 group">
              <div className="w-12 h-12 bg-white text-indigo-500 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><Map size={24} /></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Map</span>
           </button>
        </div>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Daily Catalog</h3>
             <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
               <Clock size={12} strokeWidth={3} /> STOCK: LIVE
             </div>
          </div>
          <div className="space-y-6">
            {shop.products.map(p => {
              const isOutOfStock = p.stock === 0;
              const inputQty = inputQuantities[p.id] || 0;
              return (
                <div key={p.id} className="bg-white border border-slate-100 rounded-[40px] p-5 flex gap-6 shadow-sm group active:scale-[0.98] transition-all hover:border-emerald-200">
                  <div className="w-28 h-28 rounded-[32px] overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0 relative">
                    <img src={p.imageUrl} className={`w-full h-full object-cover transition-transform group-hover:scale-110 ${isOutOfStock ? 'opacity-30 grayscale' : ''}`} />
                    {isOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                        <span className="bg-slate-900 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-xl">Sold Out</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="font-black text-slate-900 text-xl leading-none mb-1">{p.name}</h4>
                    <p className="text-2xl font-black text-emerald-600 tracking-tighter mb-2">${p.price.toFixed(2)}</p>
                    <div className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider w-fit ${isOutOfStock ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-500'}`}>
                      {p.stock} {p.unit} Available
                    </div>
                  </div>
                  {!isOutOfStock && (
                    <div className="flex flex-col items-center gap-3 self-center bg-slate-50 p-2.5 rounded-[32px] border border-slate-100">
                      <input type="number" value={inputQty} onChange={(e) => handleQuantityChange(p.id, e.target.value)} className="w-12 h-12 bg-white border border-slate-200 rounded-2xl text-center font-black text-sm outline-none focus:ring-4 focus:ring-emerald-500/20" />
                      <button onClick={() => onPlanVisit(p.id, shop.id, inputQty)} className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center active:scale-90 transition-transform"><Plus size={24} strokeWidth={3} /></button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="fixed bottom-10 left-8 right-8 z-[100]">
        <button onClick={() => onStartChat(shop)} className="w-full py-5 bg-slate-900 text-white rounded-[28px] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 active:scale-95 transition-all shadow-2xl shadow-slate-900/40">
           <MessageCircle size={24} /> Contact Merchant
        </button>
      </div>

      {showQR && <QRCodeModal shopId={shop.id} shopName={shop.name} onClose={() => setShowQR(false)} />}
    </div>
  );
};

export default ShopDetail;
