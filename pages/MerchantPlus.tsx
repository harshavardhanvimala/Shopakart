
import React from 'react';
import { ArrowLeft, Star, Sparkles, TrendingUp, ShieldCheck, Zap, ChevronRight, Lock } from 'lucide-react';

interface MerchantPlusProps {
  onBack: () => void;
}

const MerchantPlus: React.FC<MerchantPlusProps> = ({ onBack }) => {
  const benefits = [
    { title: 'AI Prediction', desc: 'Forecast stock needs 7 days ahead', icon: <TrendingUp className="text-amber-500" />, bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { title: 'Plus Discover', desc: 'Appear 3x more in buyer searches', icon: <Zap className="text-amber-500" />, bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { title: 'Merchant Trust', desc: 'Exclusive Gold Verification badge', icon: <ShieldCheck className="text-amber-500" />, bg: 'bg-amber-50 dark:bg-amber-500/10' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-obsidian pb-32 animate-in slide-in-from-right transition-colors">
      <header className="px-6 pt-16 pb-12 bg-slate-900 dark:bg-white/5 border-b border-white/5 rounded-b-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-amber-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-center gap-4 mb-10 relative z-10">
          <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest">Premium Tier</span>
          </div>
        </div>

        <div className="relative z-10 text-center">
           <h1 className="text-5xl font-black text-white tracking-tighter mb-2 italic">Plus<span className="text-amber-400">Merchant</span></h1>
           <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em]">The Ultimate Business Engine</p>
        </div>
      </header>

      <main className="px-6 -mt-8 relative z-10 space-y-4">
        <div className="bg-white dark:bg-white/5 p-8 rounded-[40px] shadow-2xl border border-slate-100 dark:border-white/10">
           <div className="flex justify-between items-center mb-10">
              <div>
                 <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Annual Access</p>
                 <h2 className="text-3xl font-black text-slate-900 dark:text-white">$12.99<span className="text-sm opacity-20">/mo</span></h2>
              </div>
              <button className="bg-amber-500 text-white px-8 py-4 rounded-[22px] font-black uppercase text-[10px] tracking-widest shadow-lg shadow-amber-200 dark:shadow-none active:scale-95 transition-all">
                 Join Pro
              </button>
           </div>

           <div className="space-y-6">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-5">
                   <div className={`w-12 h-12 ${benefit.bg} rounded-2xl flex items-center justify-center shrink-0`}>
                      {benefit.icon}
                   </div>
                   <div className="flex-1">
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">{benefit.title}</h4>
                      <p className="text-xs text-slate-400 dark:text-white/20 font-medium">{benefit.desc}</p>
                   </div>
                   <ChevronRight size={16} className="text-slate-200" />
                </div>
              ))}
           </div>
        </div>

        <div className="p-8 bg-slate-900/5 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10 rounded-[40px] text-center">
           <Lock size={32} className="text-slate-300 dark:text-white/10 mx-auto mb-4" />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
              Unlock the full potential of your business.<br/>Upgrade to Shopakart Plus today.
           </p>
        </div>
      </main>
    </div>
  );
};

export default MerchantPlus;
