
import React, { useState } from 'react';
import { 
  ArrowLeft, Heart, MapPin, Phone, 
  MessageCircle, Star, Clock, QrCode, Plus, Map,
  Navigation2, Share2, Info, ArrowRight, ShieldCheck, 
  ChevronRight, Edit3, PackagePlus, Store, ExternalLink
} from 'lucide-react';
import { Shop, Role } from '../types';
import QRCodeModal from '../components/QRCodeModal';

interface ShopDetailProps {
  shop: Shop;
  role: Role;
  onBack: () => void;
  onStartChat: (shop: Shop) => void;
  onPlanVisit: (productId: string, shopId: string, quantity: number) => void;
  onEditShop?: () => void;
  onManageInventory?: () => void;
  onEditProduct?: (productId: string) => void;
  t: (key: string) => string;
}

const ShopDetail: React.FC<ShopDetailProps> = ({ 
  shop, 
  role,
  onBack, 
  onStartChat, 
  onPlanVisit, 
  onEditShop,
  onManageInventory,
  onEditProduct,
  t 
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const isSeller = role === 'SELLER';

  const handleCall = () => window.location.href = `tel:${shop.phone.replace(/\s/g, '')}`;
  const handleNavigate = () => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address)}`, '_blank');

  return (
    <div className="bg-[#f8fafc] dark:bg-obsidian min-h-screen animate-in slide-in-from-right duration-500 pb-44 relative overflow-x-hidden">
      {/* Immersive Header */}
      <div className="relative h-[45vh] w-full overflow-hidden">
        {/* Navigation Actions */}
        <div className="absolute top-12 left-6 z-20">
          <button onClick={onBack} className="w-11 h-11 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white active:scale-90 transition-all">
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>
        </div>
        <div className="absolute top-12 right-6 z-20 flex gap-3">
          <button onClick={() => setShowQR(true)} className="w-11 h-11 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white active:scale-90 transition-all">
            <QrCode size={20} />
          </button>
          {!isSeller && (
            <button onClick={() => setIsFavorite(!isFavorite)} className={`w-11 h-11 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all ${isFavorite ? 'text-rose-500' : 'text-white'}`}>
              <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {shop.imageUrl ? (
          <img src={shop.imageUrl} className="w-full h-full object-cover scale-105" alt={shop.name} />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-emerald-900 flex items-center justify-center">
            <span className="text-8xl font-black text-white/20">{shop.name.charAt(0)}</span>
          </div>
        )}
        
        {/* Bottom Fade Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] via-transparent to-black/40 dark:from-obsidian" />
        
        <div className="absolute bottom-8 left-6 right-6">
           <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${shop.isOpen ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'}`}>
                {shop.isOpen ? 'Active' : 'Offline'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest border border-white/10">
                {shop.category}
              </span>
           </div>
           <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{shop.name}</h1>
        </div>
      </div>

      <div className="px-6 space-y-8 -mt-2 relative z-10">
        {/* Verification Strip */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-600">
               <ShieldCheck size={20} />
             </div>
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</p>
               <p className="text-sm font-bold text-slate-700 dark:text-white">Shopakart Verified</p>
             </div>
           </div>
           <div className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-black shadow-lg shadow-emerald-200 dark:shadow-none">
              {shop.rating} <Star size={12} fill="white" />
           </div>
        </div>

        {/* Business Intelligence / Description */}
        <section className="space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">About Merchant</h3>
              <button className="text-[10px] font-black uppercase text-emerald-600 underline decoration-2 underline-offset-4">Read More</button>
           </div>
           <p className="text-slate-600 dark:text-white/60 text-sm leading-relaxed font-medium italic">
             "{shop.description}"
           </p>
        </section>

        {/* Action Cards Grid */}
        <section className="grid grid-cols-2 gap-4">
           <div className="p-5 bg-white dark:bg-white/5 rounded-[32px] border border-slate-100 dark:border-white/10">
              <MapPin size={20} className="text-emerald-500 mb-3" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Location</p>
              <p className="text-xs font-bold text-slate-700 dark:text-white leading-tight">{shop.address}</p>
           </div>
           <div className="p-5 bg-white dark:bg-white/5 rounded-[32px] border border-slate-100 dark:border-white/10">
              <Clock size={20} className="text-emerald-500 mb-3" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Distance</p>
              <p className="text-xs font-bold text-slate-700 dark:text-white leading-tight">0.4 KM Away</p>
           </div>
        </section>

        {/* Inventory Management Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Live Showcase</h3>
            {isSeller && (
              <button onClick={onManageInventory} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                <PackagePlus size={14} /> Add New
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {shop.products.map(p => (
              <div key={p.id} className="group relative bg-white dark:bg-white/5 rounded-[32px] p-4 flex gap-5 border border-slate-100 dark:border-white/10 shadow-sm transition-all hover:border-emerald-200">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-inner">
                  <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={p.name} />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="font-bold text-slate-800 dark:text-white text-base mb-1">{p.name}</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-slate-900 dark:text-white">${p.price}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">/ {p.unit}</span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">In Stock</span>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center gap-2">
                  {isSeller ? (
                    <button 
                      onClick={() => onEditProduct?.(p.id)}
                      className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center active:scale-90 transition-transform shadow-lg shadow-slate-200 dark:shadow-none"
                    >
                      <Edit3 size={18} />
                    </button>
                  ) : (
                    <button 
                      onClick={() => onPlanVisit(p.id, shop.id, 1)}
                      className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center active:scale-90 transition-transform shadow-lg shadow-emerald-200 dark:shadow-none"
                    >
                      <Plus size={24} strokeWidth={3} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Role-Based Sticky Bottom Buttons */}
      <div className="fixed bottom-8 left-8 right-8 z-[80]">
        <div className="glass-dark p-3 rounded-[36px] flex gap-3 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.6)] border border-white/5">
          {isSeller ? (
            <>
              <button 
                onClick={onEditShop}
                className="flex-1 py-5 bg-white/10 hover:bg-white/20 text-white rounded-[28px] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all"
              >
                <Store size={18} /> Edit Storefront
              </button>
              <button 
                onClick={onManageInventory}
                className="flex-1 py-5 bg-emerald-600 text-white rounded-[28px] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <Plus size={18} strokeWidth={3} /> Manage Stock
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleCall}
                className="flex-1 py-5 bg-white/10 hover:bg-white/20 text-white rounded-[28px] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all"
              >
                <Phone size={18} /> Contact
              </button>
              <button 
                onClick={handleNavigate}
                className="flex-1 py-5 bg-emerald-600 text-white rounded-[28px] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <Navigation2 size={18} className="fill-current" /> Go to Shop
              </button>
            </>
          )}
        </div>
      </div>

      {showQR && <QRCodeModal shopId={shop.id} shopName={shop.name} onClose={() => setShowQR(false)} />}
    </div>
  );
};

export default ShopDetail;
