
import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, Search, Filter, Star, MapPin, ChevronRight } from 'lucide-react';
import { Shop } from '../types';

interface ShopperStoresProps {
  shops: Shop[];
  onBack: () => void;
  onOpenShop: (shop: Shop) => void;
}

const ShopperStores: React.FC<ShopperStoresProps> = ({ shops, onBack, onOpenShop }) => {
  const [search, setSearch] = useState("");

  const filteredShops = shops.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-obsidian pb-32 animate-in slide-in-from-right transition-colors">
      <header className="px-6 pt-16 pb-8 bg-emerald-600 rounded-b-[40px] shadow-lg">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
            <ArrowLeft size={20} />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
            <Filter size={20} />
          </div>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter mb-6">Store Directory</h1>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center px-4 py-3">
          <Search size={18} className="text-white/40 mr-3" />
          <input 
            type="text" 
            placeholder="Search merchants..." 
            className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/40 w-full font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <main className="px-6 mt-8 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.2em]">Nearby Merchants</h3>
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{filteredShops.length} Found</span>
        </div>

        {filteredShops.map(shop => (
          <div key={shop.id} onClick={() => onOpenShop(shop)} className="bg-white dark:bg-white/5 p-4 rounded-[32px] border border-slate-100 dark:border-white/10 flex items-center gap-5 shadow-sm active:scale-[0.98] transition-all cursor-pointer">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-slate-50 dark:border-white/10">
              <img src={shop.imageUrl} className="w-full h-full object-cover" alt={shop.name} />
            </div>
            <div className="flex-1">
              <h4 className="font-black text-slate-900 dark:text-white text-base leading-tight">{shop.name}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-wider">{shop.category}</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded text-emerald-600 text-[10px] font-black">
                  <Star size={10} fill="currentColor" /> {shop.rating}
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
                  <MapPin size={10} /> 0.4km
                </div>
              </div>
            </div>
            <ChevronRight className="text-slate-300" size={20} />
          </div>
        ))}
      </main>
    </div>
  );
};

export default ShopperStores;
