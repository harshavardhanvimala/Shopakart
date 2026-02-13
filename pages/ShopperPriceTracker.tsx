
import React, { useState } from 'react';
import { 
  ArrowLeft, Sparkles, TrendingDown, TrendingUp, Bell, 
  ChevronRight, Trash2, LineChart, AlertCircle, 
  BrainCircuit, Info, Zap
} from 'lucide-react';

interface TrackedItem {
  id: string;
  name: string;
  shopName: string;
  currentPrice: number;
  lastPrice: number;
  trend: 'up' | 'down' | 'stable';
  alertEnabled: boolean;
}

interface ShopperPriceTrackerProps {
  onBack: () => void;
}

const ShopperPriceTracker: React.FC<ShopperPriceTrackerProps> = ({ onBack }) => {
  const [trackedItems, setTrackedItems] = useState<TrackedItem[]>([
    { id: '1', name: 'Arabica Roast (250g)', shopName: 'The Daily Grind', currentPrice: 12.99, lastPrice: 14.50, trend: 'down', alertEnabled: true },
    { id: '2', name: 'Wireless Earbuds', shopName: 'Tech Haven', currentPrice: 129.99, lastPrice: 129.99, trend: 'stable', alertEnabled: false },
    { id: '3', name: 'Organic Honey', shopName: 'Local Grocer', currentPrice: 8.50, lastPrice: 7.00, trend: 'up', alertEnabled: true }
  ]);

  const [aiInsight, setAiInsight] = useState("Based on local trends, Coffee beans usually drop in price on Tuesdays at The Daily Grind. Consider waiting 2 days for your next purchase.");

  const toggleAlert = (id: string) => {
    setTrackedItems(prev => prev.map(item => 
      item.id === id ? { ...item, alertEnabled: !item.alertEnabled } : item
    ));
  };

  const removeItem = (id: string) => {
    setTrackedItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-obsidian pb-32 animate-in slide-in-from-right transition-colors">
      <header className="px-6 pt-16 pb-12 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <button onClick={onBack} className="relative z-10 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-6 active:scale-95 transition-all">
          <ArrowLeft size={20} />
        </button>
        <div className="relative z-10 flex items-center gap-3 mb-2">
          <BrainCircuit className="text-indigo-200" size={32} />
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter italic">AI Price Tracker</h1>
            <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.4em]">Intelligence Powered Commerce</p>
          </div>
        </div>
      </header>

      <main className="px-6 -mt-6 relative z-10 space-y-6">
        {/* AI Insight Card */}
        <div className="bg-white dark:bg-[#1e1b4b] p-6 rounded-[32px] border border-indigo-100 dark:border-indigo-500/20 shadow-xl shadow-indigo-500/5">
          <div className="flex items-center gap-2 mb-3">
             <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                <Sparkles size={16} />
             </div>
             <h3 className="text-xs font-black text-slate-400 dark:text-indigo-200 uppercase tracking-widest">Market Insight</h3>
          </div>
          <p className="text-xs font-medium text-slate-600 dark:text-indigo-100/80 leading-relaxed italic">
            "{aiInsight}"
          </p>
        </div>

        {/* Tracked Items List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.2em]">Monitoring {trackedItems.length} Products</h3>
            <button className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1">
               <Zap size={12} /> Live Sync
            </button>
          </div>

          {trackedItems.map(item => (
            <div key={item.id} className="bg-white dark:bg-white/5 p-5 rounded-[32px] border border-slate-100 dark:border-white/10 shadow-sm group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{item.name}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{item.shopName}</p>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  item.trend === 'down' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 
                  item.trend === 'up' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' : 
                  'bg-slate-50 text-slate-400 dark:bg-white/5 dark:text-white/40'
                }`}>
                  {item.trend === 'down' ? <TrendingDown size={12} /> : 
                   item.trend === 'up' ? <TrendingUp size={12} /> : 
                   <LineChart size={12} />}
                  {item.trend}
                </div>
              </div>

              <div className="flex items-end justify-between pt-4 border-t border-slate-50 dark:border-white/5">
                <div className="flex flex-col">
                   <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Current Price</p>
                   <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-slate-900 dark:text-white">${item.currentPrice}</span>
                      {item.trend !== 'stable' && (
                        <span className="text-[10px] font-bold text-slate-400 line-through">${item.lastPrice}</span>
                      )}
                   </div>
                </div>
                
                <div className="flex gap-2">
                   <button 
                     onClick={() => toggleAlert(item.id)}
                     className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                       item.alertEnabled 
                         ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' 
                         : 'bg-slate-50 dark:bg-white/5 text-slate-300'
                     }`}
                   >
                     <Bell size={20} fill={item.alertEnabled ? "currentColor" : "none"} />
                   </button>
                   <button 
                     onClick={() => removeItem(item.id)}
                     className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-300 hover:text-rose-500 transition-colors flex items-center justify-center"
                   >
                     <Trash2 size={20} />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 bg-slate-100 dark:bg-white/5 rounded-[40px] border border-dashed border-slate-200 dark:border-white/10 text-center">
           <AlertCircle size={32} className="text-slate-300 dark:text-white/10 mx-auto mb-4" />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
              Tracking data is updated every 4 hours.<br/>Add more items from the search portal.
           </p>
        </div>
      </main>
    </div>
  );
};

export default ShopperPriceTracker;
