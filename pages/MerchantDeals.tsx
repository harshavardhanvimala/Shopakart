
import React, { useState } from 'react';
import { ArrowLeft, Percent, Plus, Sparkles, Trash2, Loader2 } from 'lucide-react';
import { Shop } from '../types';
import { GoogleGenAI } from "@google/genai";

interface MerchantDealsProps {
  shop: Shop;
  onBack: () => void;
}

const MerchantDeals: React.FC<MerchantDealsProps> = ({ shop, onBack }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [deals, setDeals] = useState([
    { id: '1', name: 'Summer Fresh Blast', discount: '20%', type: 'Flash Sale', status: 'Active' },
    { id: '2', name: 'Loyalty Treat', discount: '10%', type: 'Standard', status: 'Draft' }
  ]);

  const generateDeal = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Suggest a catchy promotion name for a ${shop.category} shop named "${shop.name}". Return one line.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      const newDeal = {
        id: Math.random().toString(36).substr(2, 9),
        name: response.text.trim(),
        discount: '15%',
        type: 'AI Campaign',
        status: 'Draft'
      };
      setDeals([newDeal, ...deals]);
    } catch (e) {} finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-obsidian pb-32 animate-in slide-in-from-right">
      <header className="px-6 pt-16 pb-6 bg-white dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="p-1"><ArrowLeft size={20} className="text-slate-900 dark:text-white" /></button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Promotions</h1>
        </div>
        
        <button 
          onClick={generateDeal}
          disabled={isGenerating}
          className="w-full p-5 bg-slate-900 dark:bg-white/10 text-white rounded-2xl flex items-center justify-between active:scale-95 transition-all"
        >
          <div className="flex items-center gap-3">
            {isGenerating ? <Loader2 size={18} className="animate-spin text-emerald-400" /> : <Sparkles size={18} className="text-emerald-400" />}
            <span className="text-[10px] font-black uppercase tracking-widest">AI Deal Draft</span>
          </div>
          <Plus size={18} />
        </button>
      </header>

      <main className="px-6 mt-6 space-y-3">
        {deals.map(deal => (
          <div key={deal.id} className="bg-white dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/10 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-black text-xs ${
              deal.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
            }`}>
              {deal.discount}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{deal.name}</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{deal.status}</p>
            </div>
            <button className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
          </div>
        ))}
      </main>
    </div>
  );
};

export default MerchantDeals;
