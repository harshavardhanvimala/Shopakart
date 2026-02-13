
import React, { useState, useMemo } from 'react';
import { 
  BarChart3, Store, Settings, ToggleLeft, 
  ToggleRight, Eye, TrendingUp, Plus, 
  ChevronRight, QrCode, Package, AlertCircle, 
  Sparkles, X, Copy, Loader2, Percent, Map, Star,
  LayoutDashboard
} from 'lucide-react';
import { Shop } from '../types';
import QRCodeModal from '../components/QRCodeModal';
import { GoogleGenAI } from "@google/genai";

interface SellerHubProps {
  shop: Shop;
  onEditShop: () => void;
  onAddStock: () => void;
  onViewDeals?: () => void;
  onViewStores?: () => void;
  onViewPlus?: () => void;
  t: (key: string) => string;
}

const SellerHub: React.FC<SellerHubProps> = ({ 
  shop, 
  onEditShop, 
  onAddStock, 
  onViewDeals,
  onViewStores,
  onViewPlus,
  t 
}) => {
  const [isOpen, setIsOpen] = useState(shop.isOpen);
  const [showQR, setShowQR] = useState(false);
  const [showMarketing, setShowMarketing] = useState(false);

  const products = JSON.parse(localStorage.getItem('sk_products') || '[]');
  const lowStockProducts = useMemo(() => 
    products.filter((p: any) => p.shopId === shop.id && p.stock < 10),
  [products, shop.id]);

  return (
    <div className="min-h-screen bg-[#f1f3f6] dark:bg-obsidian pb-32 animate-in fade-in transition-colors">
      <header className="px-6 pt-14 pb-6 bg-emerald-600 text-white shadow-lg shadow-emerald-600/10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <span className="text-white font-black italic text-2xl leading-none tracking-tighter">Shopakart</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-emerald-100 text-[9px] font-black italic tracking-widest uppercase">Merchant Portal</span>
              <div className="w-1 h-1 bg-emerald-300 rounded-full" />
              <span className="text-emerald-300 text-[9px] font-black uppercase tracking-widest">{shop.name}</span>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
              isOpen ? 'bg-white text-emerald-600 border-white shadow-md' : 'bg-emerald-700/50 text-emerald-200 border-emerald-500/30'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-300/30'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest">{isOpen ? 'Live' : 'Hidden'}</span>
          </button>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <p className="text-[10px] font-black text-emerald-100/60 uppercase tracking-widest mb-1">Today's Reach</p>
            <p className="text-2xl font-black text-white">{shop.viewsToday}</p>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <p className="text-[10px] font-black text-emerald-100/60 uppercase tracking-widest mb-1">Weekly Growth</p>
            <div className="flex items-center gap-1 text-emerald-200">
              <TrendingUp size={14} />
              <p className="text-2xl font-black">+14%</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 mt-6 space-y-6">
        {lowStockProducts.length > 0 && (
          <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle size={18} className="text-rose-500 dark:text-rose-400" />
              <p className="text-xs font-bold text-rose-700 dark:text-rose-300">{lowStockProducts.length} items low in stock</p>
            </div>
            <button onClick={onAddStock} className="text-[10px] font-black text-rose-900 dark:text-rose-300 uppercase underline">Fix Now</button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'stock', label: 'Inventory', icon: <Package />, action: onAddStock, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
            { id: 'marketing', label: 'AI Marketing', icon: <Sparkles />, action: () => setShowMarketing(true), color: 'text-indigo-500 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
            { id: 'deals', label: 'Promotions', icon: <Percent />, action: onViewDeals, color: 'text-pink-500 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-500/10' },
            { id: 'locations', label: 'Branches', icon: <Map />, action: onViewStores, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={item.action}
              className="bg-white dark:bg-white/5 p-5 rounded-3xl border border-slate-100 dark:border-white/10 flex flex-col gap-4 text-left active:scale-95 transition-all group shadow-sm hover:border-slate-200 dark:hover:border-white/20"
            >
              <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {React.cloneElement(item.icon as React.ReactElement<any>, { size: 20 })}
              </div>
              <span className="font-black text-slate-800 dark:text-white text-[11px] uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>

        <section className="bg-white dark:bg-white/5 p-6 rounded-[32px] border border-slate-100 dark:border-white/10 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">Growth Analytics</h3>
            <BarChart3 size={16} className="text-emerald-500 dark:text-emerald-400" />
          </div>
          <div className="flex items-end justify-between h-24 gap-2">
            {[40, 70, 45, 90, 65, 30, 85].map((h, i) => (
              <div key={i} className="flex-1 bg-slate-50 dark:bg-white/5 rounded-t-lg relative h-full">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-emerald-500 dark:bg-emerald-400 rounded-t-lg transition-all duration-1000" 
                  style={{ height: `${h}%` }} 
                />
              </div>
            ))}
          </div>
        </section>

        <button 
          onClick={onEditShop}
          className="w-full p-5 bg-slate-900 dark:bg-white/10 text-white rounded-3xl flex items-center justify-between group active:scale-95 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Settings size={20} />
            </div>
            <div className="text-left">
              <p className="font-bold text-sm">Store Settings</p>
              <p className="text-[10px] opacity-40 uppercase tracking-widest">Profile & Branding</p>
            </div>
          </div>
          <ChevronRight size={18} className="opacity-20" />
        </button>
      </main>

      <button 
        onClick={onAddStock}
        className="fixed bottom-32 right-8 w-14 h-14 bg-emerald-600 text-white rounded-[24px] shadow-2xl flex items-center justify-center active:scale-95 transition-all z-40 hover:bg-emerald-500"
      >
        <Plus size={24} strokeWidth={3} />
      </button>

      {showQR && <QRCodeModal shopId={shop.id} shopName={shop.name} onClose={() => setShowQR(false)} />}
      {showMarketing && <MarketingHub shop={shop} onClose={() => setShowMarketing(false)} onOpenQR={() => setShowQR(true)} />}
    </div>
  );
};

interface MarketingHubProps {
  shop: Shop;
  onClose: () => void;
  onOpenQR: () => void;
}

const MarketingHub: React.FC<MarketingHubProps> = ({ shop, onClose, onOpenQR }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [caption, setCaption] = useState('');

  const generateCaption = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Write a professional Instagram caption for a local shop named "${shop.name}" which is a "${shop.category}". Focus on quality and community. Keep it short.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setCaption(response.text);
    } catch (e) {
      setCaption("Visit our store for the best local products! #SupportLocal");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
       <div className="relative w-full max-w-md bg-white dark:bg-obsidian rounded-t-[44px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="flex justify-between items-center mb-8">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                 <Sparkles size={20} />
               </div>
               <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">AI Lab</h3>
             </div>
             <button onClick={onClose} className="p-1"><X size={24} className="text-slate-400" /></button>
          </div>

          <div className="space-y-4">
             <button 
                onClick={onOpenQR}
                className="w-full p-5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10 flex items-center gap-4 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
             >
                <div className="w-12 h-12 bg-white dark:bg-white/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center shadow-sm"><QrCode size={24} /></div>
                <div className="text-left">
                   <p className="font-bold text-sm text-slate-900 dark:text-white">Store QR Code</p>
                   <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Download for Print</p>
                </div>
             </button>

             <div className="p-6 bg-violet-50 dark:bg-violet-500/10 rounded-[32px] border border-violet-100 dark:border-violet-500/20">
                <div className="flex justify-between items-center mb-4">
                   <span className="text-[10px] font-black text-violet-700 dark:text-violet-300 uppercase tracking-widest">AI Content Studio</span>
                   <button 
                      onClick={generateCaption} 
                      disabled={isGenerating}
                      className="text-[10px] font-black uppercase text-violet-600 dark:text-violet-400 underline decoration-2 underline-offset-4"
                   >
                      {isGenerating ? 'Drafting...' : 'Generate'}
                   </button>
                </div>
                
                <div className="min-h-[100px] bg-white/50 dark:bg-white/5 rounded-2xl p-4 text-sm font-medium text-slate-600 dark:text-white/80 italic leading-relaxed border border-violet-50 dark:border-white/5">
                   {isGenerating ? (
                      <div className="flex items-center justify-center h-full py-4"><Loader2 size={24} className="animate-spin text-violet-400" /></div>
                   ) : caption || "Tap generate for high-converting AI captions."}
                </div>
                {caption && (
                  <button 
                    onClick={() => { navigator.clipboard.writeText(caption); alert("Copied to clipboard!"); }}
                    className="mt-4 flex items-center gap-2 text-violet-600 dark:text-violet-400 font-black text-[10px] uppercase tracking-widest"
                  >
                    <Copy size={12} /> Copy Text
                  </button>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

export default SellerHub;
