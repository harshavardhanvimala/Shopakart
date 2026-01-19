
import React, { useState, useMemo } from 'react';
import { 
  BarChart3, Store, Settings, ToggleLeft, 
  ToggleRight, Eye, Users, Plus, 
  ChevronRight, Camera, QrCode, ArrowUpRight,
  Package, AlertCircle, TrendingUp, Sparkles, X, Share2, Copy, Loader2
} from 'lucide-react';
import { Shop, Product } from '../types';
import QRCodeModal from '../components/QRCodeModal';
import { GoogleGenAI } from "@google/genai";

interface SellerHubProps {
  shop: Shop;
  onEditShop: () => void;
  onAddStock: () => void;
}

const SellerHub: React.FC<SellerHubProps> = ({ shop, onEditShop, onAddStock }) => {
  const [isOpen, setIsOpen] = useState(shop.isOpen);
  const [showQR, setShowQR] = useState(false);
  const [showMarketing, setShowMarketing] = useState(false);

  // Mocking low stock check
  const products = JSON.parse(localStorage.getItem('sk_products') || '[]');
  const lowStockProducts = useMemo(() => 
    products.filter((p: any) => p.shopId === shop.id && p.stock < 10),
  [products, shop.id]);

  return (
    <div className="min-h-screen bg-slate-50 pb-32 animate-in fade-in">
      <header className="px-6 pt-16 pb-8 bg-white border-b border-slate-100 rounded-b-[40px] shadow-sm">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Business</h1>
            <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">{shop.name}</p>
          </div>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-3 p-1.5 pl-4 rounded-full border transition-all shadow-sm ${
              isOpen ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest">{isOpen ? 'Live' : 'Closed'}</span>
            <div className={`rounded-full p-1.5 shadow-sm transition-all ${isOpen ? 'bg-emerald-600 text-white' : 'bg-white text-slate-300'}`}>
              {isOpen ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
            </div>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900 p-6 rounded-[32px] text-white flex flex-col justify-between h-40 shadow-xl shadow-slate-200 group cursor-default">
            <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><Eye size={20} /></div>
            <div>
              <p className="text-3xl font-black">{shop.viewsToday}</p>
              <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Views Today</p>
            </div>
          </div>
          <div className="bg-emerald-50 p-6 rounded-[32px] text-emerald-900 flex flex-col justify-between h-40 border border-emerald-100 group cursor-default">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><TrendingUp size={20} /></div>
            <div>
              <p className="text-3xl font-black">+14%</p>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Weekly Growth</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 mt-8 space-y-6">
        {lowStockProducts.length > 0 && (
          <section className="bg-rose-50 border-2 border-rose-100 p-5 rounded-[32px] flex items-center gap-4 animate-in slide-in-from-left">
             <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200"><AlertCircle size={24} /></div>
             <div className="flex-1">
                <h4 className="font-black text-rose-900 text-sm leading-tight">Stock Warning</h4>
                <p className="text-xs font-medium text-rose-700">{lowStockProducts.length} items running low</p>
             </div>
             <button onClick={onAddStock} className="text-xs font-black text-rose-900 uppercase underline decoration-2 underline-offset-4 hover:text-rose-600 transition-colors">Resolve</button>
          </section>
        )}

        <div className="grid grid-cols-2 gap-4">
           <button onClick={onAddStock} className="bg-white p-5 rounded-[32px] border border-slate-100 flex flex-col gap-3 shadow-sm active:scale-95 transition-all text-left group hover:border-emerald-200">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors"><Package size={20} /></div>
              <span className="font-black text-slate-800 text-[11px] uppercase tracking-widest leading-tight">Catalog & Stock</span>
           </button>
           <button onClick={() => setShowMarketing(true)} className="bg-white p-5 rounded-[32px] border border-slate-100 flex flex-col gap-3 shadow-sm active:scale-95 transition-all text-left group hover:border-indigo-200">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors"><Sparkles size={20} /></div>
              <span className="font-black text-slate-800 text-[11px] uppercase tracking-widest leading-tight">AI Marketing</span>
           </button>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Area Performance</h3>
              <BarChart3 size={18} className="text-slate-300" />
           </div>
           <div className="flex items-end justify-between h-32 gap-3">
              {[40, 70, 45, 90, 65, 30, 85].map((h, i) => (
                <div key={i} className="flex-1 bg-slate-50 rounded-full overflow-hidden relative h-full">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-emerald-500 rounded-full transition-all duration-1000 group-hover:opacity-80" 
                    style={{ height: `${h}%` }} 
                  />
                </div>
              ))}
           </div>
        </div>

        <button onClick={onEditShop} className="w-full p-6 bg-slate-900 text-white rounded-[32px] flex items-center justify-between group active:scale-95 transition-all shadow-xl shadow-slate-200">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors"><Settings size={22} /></div>
              <div className="text-left">
                 <p className="font-black text-sm">Storefront Hub</p>
                 <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Edit Details & Profile</p>
              </div>
           </div>
           <ChevronRight size={20} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
        </button>
      </main>

      <button 
        onClick={onAddStock}
        className="fixed bottom-24 right-8 w-16 h-16 bg-emerald-600 text-white rounded-[24px] shadow-2xl shadow-emerald-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40"
      >
        <Plus size={32} strokeWidth={3} />
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
      const prompt = `Write a viral Instagram caption for a local shop named "${shop.name}" which is a "${shop.category}". Focus on neighborhood vibes and quality. Include hashtags.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setCaption(response.text);
    } catch (e) {
      setCaption("Check out the best local shop in Indiranagar! Quality guaranteed. #LocalSupport");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center animate-in fade-in duration-300">
       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
       <div className="relative w-full max-w-md bg-white rounded-t-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-500">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
          <div className="flex justify-between items-start mb-6">
             <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Merchant Marketing</h3>
                <p className="text-sm font-medium text-slate-500">AI-powered social growth</p>
             </div>
             <button onClick={onClose} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 transition-colors"><X size={24} /></button>
          </div>

          <div className="space-y-4">
             <button 
                onClick={onOpenQR}
                className="w-full p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center gap-4 hover:bg-white hover:border-emerald-500 transition-all group"
             >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-600 group-hover:scale-110 transition-transform"><QrCode size={24} /></div>
                <div className="text-left">
                   <p className="font-black text-slate-900 text-sm">Printable QR Flyer</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase">Customers scan to follow</p>
                </div>
             </button>

             <div className="p-6 bg-violet-50 rounded-[32px] border border-violet-100">
                <div className="flex justify-between items-center mb-4">
                   <div className="flex items-center gap-2">
                      <Sparkles size={20} className="text-violet-600" />
                      <span className="text-[10px] font-black text-violet-700 uppercase tracking-widest">AI Content Lab</span>
                   </div>
                   <button 
                      onClick={generateCaption} 
                      disabled={isGenerating}
                      className="text-[10px] font-black uppercase text-violet-600 underline decoration-2 underline-offset-4"
                   >
                      {isGenerating ? 'Drafting...' : 'Generate New'}
                   </button>
                </div>
                
                <div className="min-h-[120px] bg-white/60 rounded-2xl p-4 text-sm font-medium text-slate-700 italic border border-violet-100/50">
                   {isGenerating ? (
                      <div className="flex flex-col items-center justify-center gap-2 h-full py-8 text-violet-400">
                         <Loader2 size={24} className="animate-spin" />
                         <p className="text-[10px] font-black uppercase">Thinking...</p>
                      </div>
                   ) : caption ? (
                      <div className="animate-in fade-in slide-in-from-bottom-2">
                        {caption}
                        <button 
                          onClick={() => { navigator.clipboard.writeText(caption); alert("Copied!"); }}
                          className="mt-4 flex items-center gap-2 text-violet-600 font-black text-[10px] uppercase bg-violet-100 px-3 py-1.5 rounded-lg"
                        >
                          <Copy size={12} /> Copy to Clipboard
                        </button>
                      </div>
                   ) : (
                      <div className="flex flex-col items-center justify-center py-8 opacity-40">
                         <p className="text-xs font-bold text-center">Tap "Generate New" to create an AI caption for your store.</p>
                      </div>
                   )}
                </div>
             </div>
          </div>
          
          <div className="mt-8 text-center">
             <button onClick={onClose} className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors">Done for now</button>
          </div>
       </div>
    </div>
  );
};

export default SellerHub;
