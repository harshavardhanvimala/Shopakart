
import React from 'react';
import { ShoppingBag, MapPin, ChevronRight, Navigation2, Trash2, LayoutList, Search, Compass, Store, Plus } from 'lucide-react';
import { VisitListItem, Shop, Product } from '../types';

interface VisitListProps {
  items: VisitListItem[];
  shops: Shop[];
  products: Product[];
  onRemoveItem: (productId: string) => void;
  onVisitShop: (shop: Shop) => void;
  onExplore?: () => void;
}

const VisitList: React.FC<VisitListProps> = ({ items, shops, products, onRemoveItem, onVisitShop, onExplore }) => {
  // Group items by shop
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.shopId]) acc[item.shopId] = [];
    acc[item.shopId].push(item);
    return acc;
  }, {} as Record<string, VisitListItem[]>);

  const shopIds = Object.keys(groupedItems);

  const handleNavigate = (shop: Shop) => {
    const query = encodeURIComponent(shop.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white pb-32 animate-in fade-in">
      <header className="px-6 pt-16 pb-6 bg-white border-b border-slate-50 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">My List</h1>
          <p className="text-sm font-medium text-slate-600 mt-1 italic">Physical shopping guide</p>
        </div>
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl italic shadow-lg shadow-emerald-100">S</div>
      </header>

      <div className="p-6">
        {shopIds.length > 0 ? (
          <div className="space-y-8">
            {shopIds.map(shopId => {
              const shop = shops.find(s => s.id === shopId);
              const shopItems = groupedItems[shopId];

              return (
                <div key={shopId} className="space-y-4 animate-in slide-in-from-bottom duration-500">
                  <div className="flex justify-between items-end">
                    <div onClick={() => shop && onVisitShop(shop)} className="cursor-pointer">
                      <h3 className="text-lg font-black text-slate-900">{shop?.name}</h3>
                      <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <MapPin size={10} /> {shop?.address}
                      </p>
                    </div>
                    <button 
                      onClick={() => shop && handleNavigate(shop)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 active:scale-90 transition-all"
                    >
                      <Navigation2 size={10} /> Directions
                    </button>
                  </div>

                  <div className="bg-slate-50 rounded-[32px] overflow-hidden border border-slate-100 shadow-sm">
                    {shopItems.map(item => {
                      const product = products.find(p => p.id === item.productId);
                      return (
                        <div key={item.productId} className="p-4 flex items-center gap-4 border-b border-slate-100 last:border-0 bg-white/50">
                          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                            <img src={product?.imageUrl} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-sm text-slate-800">{product?.name}</h4>
                            <p className="text-[10px] font-black text-emerald-600 uppercase">Planned: {item.quantity}</p>
                          </div>
                          <div className="text-right flex items-center gap-4">
                            <p className="font-black text-slate-900 text-sm">${((product?.price || 0) * item.quantity).toFixed(2)}</p>
                            <button 
                              onClick={() => onRemoveItem(item.productId)}
                              className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center animate-in zoom-in duration-700">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-emerald-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              <div className="relative w-32 h-32 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[3rem] flex items-center justify-center text-slate-200">
                 <ShoppingBag size={48} strokeWidth={1} />
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100 animate-bounce">
                 <Plus size={24} />
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-2">Ready to go?</h3>
            <p className="text-slate-600 font-medium max-w-[240px] mb-10 text-sm leading-relaxed">
              Your visit list is empty. Add items from local shops to plan your neighborhood trip and compare stocks.
            </p>
            
            <div className="grid grid-cols-1 w-full gap-3">
              <button 
                onClick={onExplore}
                className="flex items-center justify-center gap-3 w-full py-5 bg-emerald-600 text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-200 active:scale-95 transition-all"
              >
                <Compass size={20} /> Browse Shops Nearby
              </button>
              <button 
                onClick={onExplore}
                className="flex items-center justify-center gap-3 w-full py-5 bg-white text-slate-700 rounded-[24px] font-black text-sm uppercase tracking-widest border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all"
              >
                <Search size={20} className="text-slate-500" /> Search Local Stock
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitList;
