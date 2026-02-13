
import React from 'react';
import { ArrowLeft, Star, Zap, ShoppingBag, ShieldCheck, Heart, ChevronRight, Sparkles } from 'lucide-react';

interface ShopperPlusProps {
  onBack: () => void;
}

const ShopperPlus: React.FC<ShopperPlusProps> = ({ onBack }) => {
  const benefits = [
    { title: 'Zero Service Fees', desc: 'No hidden costs on all local reservations', icon: <ShoppingBag className="text-amber-500" />, bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { title: 'VIP Discovery', desc: 'Get deal alerts 2 hours before everyone else', icon: <Zap className="text-amber-500" />, bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { title: 'Local Insurance', desc: 'Guaranteed local support for all purchases', icon: <ShieldCheck className="text-amber-500" />, bg: 'bg-amber-50 dark:bg-amber-500/10' }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-obsidian pb-32 animate-in slide-in-from-right transition-colors">
      <header className="px-6 pt-16 pb-12 bg-slate-900 rounded-b-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-500/20 to-transparent" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-400/10 rounded-full blur-[80px]" />
        
        <button onClick={onBack} className="relative z-10 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white mb-10">
          <ArrowLeft size={20} />
        </button>

        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-lg shadow-amber-500/20">
            <Star size={12} fill="white" /> Plus Member
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter italic mb-2">Shopa<span className="text-amber-400">Plus</span></h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em]">The Ultimate Local Experience</p>
        </div>
      </header>

      <main className="px-6 -mt-8 relative z-10 space-y-4">
        <div className="bg-white dark:bg-white/5 p-8 rounded-[40px] border border-slate-100 dark:border-white/10 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <div>
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Premium Pass</p>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">$4.99<span className="text-sm opacity-20">/mo</span></h2>
            </div>
            <button className="bg-slate-900 dark:bg-amber-500 text-white px-8 py-4 rounded-[22px] font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">
              Activate
            </button>
          </div>

          <div className="space-y-6">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-5 group">
                <div className={`w-12 h-12 ${benefit.bg} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
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

        <div className="p-8 bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-100 dark:border-emerald-500/20 rounded-[40px] flex items-center gap-5">
          <div className="w-16 h-16 bg-emerald-600 text-white rounded-[24px] flex items-center justify-center shadow-lg shadow-emerald-200 dark:shadow-none">
            <Sparkles size={32} />
          </div>
          <div>
            <h4 className="font-black text-emerald-900 dark:text-emerald-400 text-sm">Join the Community</h4>
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-500/60 leading-tight">Support 120+ local shops and get exclusive rewards.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShopperPlus;
