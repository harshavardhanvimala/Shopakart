
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Heart, Share2, MapPin, Phone, 
  MessageCircle, Star, Clock, ChevronRight, 
  QrCode, Plus, MoreHorizontal, ShoppingCart, Check
} from 'lucide-react';
import { Shop } from '../types';
import QRCodeModal from '../components/QRCodeModal';

interface ShopDetailProps {
  shop: Shop;
  onBack: () => void;
  onStartChat: (shop: Shop) => void;
}

const ShopDetail: React.FC<ShopDetailProps> = ({ shop, onBack, onStartChat }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  
  // Local state for stock management to demonstrate visual updates
  const [productStocks, setProductStocks] = useState<{ [id: string]: number }>(
    shop.products.reduce((acc, p) => ({ ...acc, [p.id]: p.stock }), {})
  );
  const [cartItems, setCartItems] = useState<{ [id: string]: number }>({});
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  const handleQuickAdd = (productId: string) => {
    if (productStocks[productId] > 0) {
      setProductStocks(prev => ({
        ...prev,
        [productId]: prev[productId] - 1
      }));
      setCartItems(prev => ({
        ...prev,
        [productId]: (prev[productId] || 0) + 1
      }));
      
      // Visual feedback for the button
      setLastAdded(productId);
      
      // Visual feedback for the header cart
      setIsCartBouncing(true);
      
      setTimeout(() => {
        setLastAdded(null);
        setIsCartBouncing(false);
      }, 800);
    }
  };

  const totalInCart = Object.values(cartItems).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-white pb-24 animate-in slide-in-from-right duration-300">
      {/* Header Sticky Action Bar */}
      <div className="relative h-64 w-full">
        <img src={shop.imageUrl} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-transform active:scale-90">
            <ArrowLeft size={20}/>
          </button>
          <div className="flex gap-2">
            <button onClick={() => setIsFavorite(!isFavorite)} className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center text-white transition-all ${isFavorite ? 'bg-rose-500' : 'bg-white/20'}`}>
              <Heart size={20} fill={isFavorite ? 'white' : 'none'}/>
            </button>
            <div className="relative">
              <button className={`w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg transition-all active:scale-90 ${isCartBouncing ? 'scale-125 ring-4 ring-emerald-500/30' : 'scale-100'}`}>
                <ShoppingCart size={20} className={isCartBouncing ? 'animate-bounce' : ''} />
                {totalInCart > 0 && (
                  <span key={totalInCart} className="absolute -top-1 -right-1 bg-white text-emerald-600 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-emerald-500 animate-in zoom-in">
                    {totalInCart}
                  </span>
                )}
              </button>
            </div>
            <button onClick={() => setShowQR(true)} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-transform active:scale-90">
              <QrCode size={20}/>
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 left-6">
          <h1 className="text-3xl font-black text-white">{shop.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-emerald-500 px-2 py-0.5 rounded text-[10px] font-black text-white uppercase">{shop.category}</span>
            <div className="flex items-center gap-1 text-yellow-400"><Star size={12} fill="currentColor" /><span className="text-xs text-white font-bold">{shop.rating}</span></div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stories Section */}
        {shop.stories.length > 0 && (
          <section className="mb-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Daily Specials</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar">
              {shop.stories.map(story => (
                <div key={story.id} className="flex-shrink-0 w-24 h-36 rounded-2xl border-2 border-emerald-500 p-0.5">
                   <img src={story.imageUrl} className="w-full h-full object-cover rounded-xl" />
                </div>
              ))}
              <div className="flex-shrink-0 w-24 h-36 rounded-2xl bg-slate-100 flex flex-col items-center justify-center text-slate-400 border border-slate-200 border-dashed">
                <Plus size={24} />
                <span className="text-[10px] font-bold mt-1">Suggest</span>
              </div>
            </div>
          </section>
        )}

        <div className="flex items-center justify-between mb-8">
           <div className={`px-3 py-1.5 rounded-full text-xs font-black uppercase flex items-center gap-1.5 ${shop.isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
             <Clock size={14} /> {shop.isOpen ? 'Open Now' : 'Closed'}
           </div>
           <p className="text-xs font-bold text-slate-400">Updates 10m ago</p>
        </div>

        <p className="text-slate-600 leading-relaxed mb-8">{shop.description}</p>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-4 mb-8">
           <button className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl active:scale-95 transition-all">
              <Phone className="text-blue-500" />
              <span className="text-[10px] font-black uppercase">Call</span>
           </button>
           <button onClick={() => onStartChat(shop)} className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl active:scale-95 transition-all">
              <MessageCircle className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase">Chat</span>
           </button>
           <button className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl active:scale-95 transition-all">
              <MapPin className="text-violet-500" />
              <span className="text-[10px] font-black uppercase">Locate</span>
           </button>
        </div>

        {/* Product Inventory */}
        <section>
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-black text-slate-900">Current Stock</h3>
             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               Live Stock
             </div>
          </div>
          <div className="space-y-4">
            {shop.products.map(p => {
              const currentStock = productStocks[p.id];
              const isOutOfStock = currentStock === 0;
              const isRecentlyAdded = lastAdded === p.id;

              return (
                <div key={p.id} className={`flex gap-4 p-3 bg-white border rounded-2xl shadow-sm transition-all duration-300 ${isRecentlyAdded ? 'border-emerald-400 bg-emerald-50/50 scale-[1.02]' : 'border-slate-100 scale-100'}`}>
                  <div className="relative">
                    <img src={p.imageUrl} className={`w-16 h-16 rounded-xl object-cover transition-opacity ${isOutOfStock ? 'opacity-40 grayscale' : 'opacity-100'}`} />
                    {isOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-slate-900/80 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded shadow-lg">Sold Out</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className={`font-bold transition-colors ${isOutOfStock ? 'text-slate-400' : 'text-slate-800'}`}>{p.name}</h4>
                      <p className={`text-[10px] font-bold uppercase transition-colors ${isOutOfStock ? 'text-rose-400' : 'text-slate-400'}`}>
                        {isOutOfStock ? 'Out of stock' : `${currentStock} in stock`}
                      </p>
                    </div>
                    <p className={`font-black transition-colors ${isOutOfStock ? 'text-slate-300' : 'text-emerald-600'}`}>${p.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="self-center flex flex-col items-center gap-1 relative">
                    {/* Floating +1 Animation */}
                    {isRecentlyAdded && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none">
                        <span className="text-emerald-600 font-black text-xl animate-out fade-out slide-out-to-top duration-700 fill-mode-forwards">
                          +1
                        </span>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => handleQuickAdd(p.id)}
                      disabled={isOutOfStock}
                      className={`group relative p-3 rounded-xl transition-all active:scale-95 flex items-center gap-2 min-w-[100px] justify-center overflow-hidden ${
                        isOutOfStock 
                        ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                        : isRecentlyAdded
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      {isRecentlyAdded ? (
                        <div className="flex items-center gap-2 animate-in zoom-in duration-200">
                          <Check size={18} strokeWidth={3} />
                          <span className="text-[10px] font-black uppercase tracking-tighter">Added!</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Plus size={18} />
                          <span className="text-[10px] font-black uppercase tracking-tighter">Quick Add</span>
                        </div>
                      )}
                    </button>
                    
                    {cartItems[p.id] > 0 && (
                      <span className="text-[9px] font-black text-slate-500 uppercase animate-in slide-in-from-top-1">
                        {cartItems[p.id]} in cart
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {showQR && <QRCodeModal shopId={shop.id} shopName={shop.name} onClose={() => setShowQR(false)} />}
    </div>
  );
};

export default ShopDetail;
