
import React from 'react';
import { ArrowLeft, Sparkles, Percent, Tag, ChevronRight, Store } from 'lucide-react';
import { Shop } from '../types';

interface ShopperDealsProps {
  shops: Shop[];
  onBack: () => void;
  onOpenShop: (shop: Shop) => void;
}

const ShopperDeals: React.FC<ShopperDealsProps> = ({ shops, onBack, onOpenShop }) => {
  // Mocking some deals based on existing shops
  const deals = shops.map(shop => ({
    id: shop.id,
    shop: shop,
    title: `${shop.category} Weekend Sale`,
    discount: "20% OFF",
    code: "NEIGHBOR20",
    expiresIn: "4h 20m"
  }));

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-obsidian pb-32 animate-in slide-in-from-right transition-colors">
      <header className="px-6 pt-16 pb-8 bg-pink-500 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <button onClick={onBack} className="relative z-10 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-6">
          <ArrowLeft size={20} />
        </button>
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic">Flash<span className="text-pink-200">Pulse</span></h1>
          <p className="text-pink-100 text-[10px] font-black uppercase tracking-[0.4em]">Neighborhood Exclusive Deals</p>
        </div>
      </header>

      <main className="px-6 mt-8 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-pink-500" />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Promotions</h3>
        </div>

        {deals.map(deal => (
          <div key={deal.id} onClick={() => onOpenShop(deal.shop)} className="bg-white dark:bg-white/5 p-6 rounded-[32px] border border-slate-100 dark:border-white/10 shadow-sm group active:scale-[0.98] transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 dark:bg-pink-500/20 text-pink-500 rounded-xl flex items-center justify-center">
                  <Percent size={20} strokeWidth={3} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{deal.title}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{deal.shop.name}</p>
                </div>
              </div>
              <div className="bg-pink-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                {deal.discount}
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-white/5">
              <div className="flex items-center gap-2 text-slate-400">
                <Tag size={12} />
                <span className="text-[10px] font-black uppercase tracking-widest font-mono">{deal.code}</span>
              </div>
              <div className="flex items-center gap-1.5 text-pink-500">
                <span className="text-[9px] font-black uppercase tracking-widest">Expires: {deal.expiresIn}</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default ShopperDeals;
