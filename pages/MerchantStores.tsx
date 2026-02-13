
import React from 'react';
import { ArrowLeft, MapPin, Plus, MoreVertical, Globe } from 'lucide-react';
import { Shop } from '../types';

interface MerchantStoresProps {
  shops: Shop[];
  onBack: () => void;
}

const MerchantStores: React.FC<MerchantStoresProps> = ({ shops, onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-obsidian pb-32 animate-in slide-in-from-right">
      <header className="px-6 pt-16 pb-6 bg-white dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="p-1"><ArrowLeft size={20} className="text-slate-900 dark:text-white" /></button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Branches</h1>
        </div>
        
        <div className="p-5 bg-emerald-600 text-white rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase opacity-60">Global Reach</p>
            <p className="text-2xl font-black">1.2 KM</p>
          </div>
          <Globe size={24} className="opacity-40 animate-pulse" />
        </div>
      </header>

      <main className="px-6 mt-6 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Nodes</h3>
          <button className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1">
            <Plus size={14} /> Add Branch
          </button>
        </div>

        {shops.slice(0, 1).map(shop => (
          <div key={shop.id} className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-white/10 flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
              <MapPin size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{shop.name} - HQ</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{shop.address}</p>
            </div>
            <button className="p-1 text-slate-300"><MoreVertical size={18} /></button>
          </div>
        ))}
      </main>
    </div>
  );
};

export default MerchantStores;
