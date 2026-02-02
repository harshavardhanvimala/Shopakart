
import React from 'react';
import { ArrowLeft, Clock, MapPin, ChevronRight, Store } from 'lucide-react';
import { Shop } from '../types';

interface ShopperHistoryProps {
  shops: Shop[];
  onBack: () => void;
  onOpenShop: (shop: Shop) => void;
}

const ShopperHistory: React.FC<ShopperHistoryProps> = ({ shops, onBack, onOpenShop }) => {
  const history = shops.map((s, i) => ({
    shop: s,
    time: i === 0 ? '30m ago' : i === 1 ? '3h ago' : 'Yesterday'
  }));

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-obsidian pb-32 animate-in slide-in-from-right transition-colors">
      <header className="px-8 pt-16 pb-8 bg-white dark:bg-white/5 border-b border-slate-100 dark:border-white/10 rounded-b-[40px] shadow-sm">
        <div className="flex items-center gap-5">
          <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/10 flex items-center justify-center text-slate-900 dark:text-white active:scale-95 transition-all">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">History</h2>
        </div>
      </header>

      <main className="px-6 mt-8">
        <div className="relative border-l-2 border-slate-100 dark:border-white/5 ml-4 space-y-10 pl-8 pb-12">
          {history.map((item, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[41px] top-4 w-5 h-5 bg-emerald-500 border-4 border-white dark:border-obsidian rounded-full shadow-md" />
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{item.time}</div>
              
              <div 
                onClick={() => onOpenShop(item.shop)}
                className="bg-white dark:bg-white/5 p-4 rounded-[28px] border border-slate-100 dark:border-white/10 flex items-center gap-4 shadow-sm active:scale-[0.98] transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-50 dark:border-white/10">
                  <img src={item.shop.imageUrl} className="w-full h-full object-cover" alt={item.shop.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{item.shop.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <MapPin size={10} /> {item.shop.category}
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-200" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center pb-12 opacity-30">
          <Store size={24} className="mx-auto mb-2 text-slate-400" />
          <p className="text-[8px] font-black uppercase tracking-[0.3em]">End of recent history</p>
        </div>
      </main>
    </div>
  );
};

export default ShopperHistory;
