
import React from 'react';
import { ArrowLeft, Heart, Star, MapPin, ChevronRight, ShoppingBag } from 'lucide-react';
import { Shop } from '../types';

interface ShopperFavoritesProps {
  shops: Shop[];
  // Added missing favorites state to match usage in App.tsx
  favorites: string[];
  setFavorites: React.Dispatch<React.SetStateAction<string[]>>;
  onBack: () => void;
  onOpenShop: (shop: Shop) => void;
}

const ShopperFavorites: React.FC<ShopperFavoritesProps> = ({ shops, favorites, setFavorites, onBack, onOpenShop }) => {
  // Filter shops based on the favorites array provided via props
  const favoriteShops = shops.filter(shop => favorites.includes(shop.id));

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-obsidian pb-32 animate-in slide-in-from-right transition-colors">
      <header className="px-8 pt-16 pb-8 bg-white dark:bg-white/5 border-b border-slate-100 dark:border-white/10 rounded-b-[40px] shadow-sm">
        <div className="flex items-center gap-5">
          <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/10 flex items-center justify-center text-slate-900 dark:text-white active:scale-95 transition-all">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Favorites</h2>
        </div>
      </header>

      <main className="px-6 mt-8 space-y-4">
        {favoriteShops.length > 0 ? (
          favoriteShops.map(shop => (
            <div key={shop.id} onClick={() => onOpenShop(shop)} className="bg-white dark:bg-white/5 p-4 rounded-[32px] border border-slate-100 dark:border-white/10 flex items-center gap-5 shadow-sm active:scale-[0.98] transition-all cursor-pointer group">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-slate-50 dark:border-white/10">
                <img src={shop.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={shop.name} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-black text-slate-900 dark:text-white text-base leading-tight">{shop.name}</h4>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setFavorites(prev => prev.filter(id => id !== shop.id));
                    }}
                  >
                    <Heart size={18} className="text-rose-500 fill-rose-500" />
                  </button>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-wider">{shop.category}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded text-emerald-600 text-[10px] font-black">
                    <Star size={10} fill="currentColor" /> {shop.rating}
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
                    <MapPin size={10} /> {shop.address.split(',')[0]}
                  </div>
                </div>
              </div>
              <ChevronRight className="text-slate-300" size={20} />
            </div>
          ))
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center opacity-40">
            <div className="w-24 h-24 bg-slate-100 dark:bg-white/10 rounded-[40px] flex items-center justify-center mb-6">
              <Heart size={40} className="text-slate-400" />
            </div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">No Favorites Yet</h4>
            <p className="text-xs font-medium text-slate-500 dark:text-white/40 max-w-[200px] mt-2">Love a local shop? Tap the heart icon to save it here for quick access.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ShopperFavorites;
