
import React from 'react';
import { ArrowLeft, Star, Award, TrendingUp, MessageCircle, ChevronRight, ShieldCheck } from 'lucide-react';

interface ShopperContributionsProps {
  onBack: () => void;
}

const ShopperContributions: React.FC<ShopperContributionsProps> = ({ onBack }) => {
  const stats = [
    { label: 'Reviews', val: '12', icon: <Star size={16} />, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { label: 'Impact', val: '450+', icon: <TrendingUp size={16} />, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Badges', val: '3', icon: <Award size={16} />, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-obsidian pb-32 animate-in slide-in-from-right transition-colors">
      <header className="px-8 pt-16 pb-12 bg-amber-500 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <button onClick={onBack} className="relative z-10 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-6">
          <ArrowLeft size={20} />
        </button>
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2 italic">Guide<span className="text-amber-200">Level</span></h2>
          <p className="text-amber-100 text-[10px] font-black uppercase tracking-[0.4em]">Local Guide Level 4</p>
        </div>
      </header>

      <main className="px-6 -mt-6 relative z-10 space-y-6">
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s, i) => (
            <div key={i} className="bg-white dark:bg-white/5 p-4 rounded-[28px] border border-slate-100 dark:border-white/10 shadow-sm text-center">
              <div className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                {s.icon}
              </div>
              <p className="text-lg font-black text-slate-900 dark:text-white leading-none">{s.val}</p>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-white/5 p-6 rounded-[32px] border border-slate-100 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Activity</h3>
            <ChevronRight size={16} className="text-slate-300" />
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-1 bg-amber-500 rounded-full" />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">Reviewed "The Daily Grind"</h4>
                  <div className="flex items-center gap-0.5 text-amber-500"><Star size={10} fill="currentColor" /> 5.0</div>
                </div>
                <p className="text-xs text-slate-500 dark:text-white/40 italic font-medium leading-relaxed">"Best cold brew in the neighborhood. Staff is super friendly!"</p>
                <div className="flex items-center gap-2 mt-3 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                  <ShieldCheck size={12} /> Verified Visit
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShopperContributions;
