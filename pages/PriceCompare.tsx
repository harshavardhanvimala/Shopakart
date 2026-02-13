
import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Search, Tag, Store, 
  ChevronRight, Filter, ShoppingBag, 
  MapPin, Sparkles, AlertCircle 
} from 'lucide-react';
import { Product, Shop } from '../types';

interface PriceCompareProps {
  products: Product[];
  shops: Shop[];
  onBack: () => void;
  onOpenShop: (shop: Shop) => void;
  onNavigateToPriceTracker?: () => void;
  t: (key: string) => string;
}

const PriceCompare: React.FC<PriceCompareProps> = ({ products, shops, onBack, onOpenShop, onNavigateToPriceTracker, t }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredResults = useMemo(() => {
    let results = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (activeFilter !== 'All') {
      results = results.filter(p => p.category === activeFilter);
    }

    return results;
  }, [products, searchQuery, activeFilter]);

  const getShopForProduct = (shopId: string) => shops.find(s => s.id === shopId);

  const uniqueCategories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return ['All', ...cats];
  }, [products]);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-obsidian pb-44 animate-in slide-in-from-bottom duration-500 transition-colors">
      <header className="px-6 pt-16 pb-8 bg-white dark:bg-white/5 border-b border-slate-100 dark:border-white/10 rounded-b-[40px] shadow-sm sticky top-0 z-50 backdrop-blur-xl">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/10 flex items-center justify-center text-slate-900 dark:text-white active:scale-95 transition-all">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Market Search</h1>
        </div>

        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search products, brands, shops..."
            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white font-bold placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/40 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar mt-6 -mx-2 px-2">
          {uniqueCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeFilter === cat 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                  : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-white/40 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="px-6 mt-8 space-y-4">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.2em]">
            {searchQuery ? `Results for "${searchQuery}"` : 'Recommended Products'}
          </h3>
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{filteredResults.length} Items</span>
        </div>

        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredResults.map(product => {
              const shop = getShopForProduct(product.shopId);
              return (
                <div 
                  key={product.id} 
                  onClick={() => shop && onOpenShop(shop)}
                  className="bg-white dark:bg-white/5 p-4 rounded-[32px] border border-slate-100 dark:border-white/10 flex items-center gap-5 shadow-sm active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-slate-50 dark:border-white/10 shadow-inner">
                    <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={product.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[8px] font-black bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded uppercase tracking-widest">
                        {product.category}
                      </span>
                    </div>
                    <h4 className="font-black text-slate-900 dark:text-white text-base leading-tight truncate">{product.name}</h4>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <Store size={12} className="text-slate-400" />
                      <p className="text-[10px] font-bold text-slate-500 dark:text-white/40 truncate">Available at {shop?.name}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-slate-900 dark:text-white">${product.price}</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase">/{product.unit}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase">
                        View Shop <ChevronRight size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center opacity-40">
            <div className="w-20 h-20 bg-slate-100 dark:bg-white/10 rounded-[32px] flex items-center justify-center mb-4">
              <ShoppingBag size={40} strokeWidth={1.5} className="text-slate-400" />
            </div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">No Items Found</h4>
            <p className="text-xs font-medium text-slate-500 dark:text-white/40 max-w-[200px] mt-2">Try searching for a different product or browse by category.</p>
          </div>
        )}

        {/* Dynamic Suggestions Section */}
        {searchQuery === '' && filteredResults.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-white/10">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
               <Sparkles className="text-indigo-200 mb-4" size={32} />
               <h3 className="text-2xl font-black tracking-tighter leading-tight mb-2">AI Price Tracker</h3>
               <p className="text-indigo-100 text-xs font-medium opacity-80 leading-relaxed max-w-[240px]">We're monitoring local prices for you. Tap a product to see current stock levels and merchant updates.</p>
               <button 
                  onClick={onNavigateToPriceTracker}
                  className="mt-6 flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/20 active:scale-95 transition-all"
               >
                  Setup Alerts <ChevronRight size={14} />
               </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PriceCompare;
