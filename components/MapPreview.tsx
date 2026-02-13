
import React from 'react';
import { MapPin, Navigation2 } from 'lucide-react';
import { Shop } from '../types';

interface MapPreviewProps {
  shops: Shop[];
  onShopClick: (shop: Shop) => void;
}

const MapPreview: React.FC<MapPreviewProps> = ({ shops, onShopClick }) => {
  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden">
      {/* Mock Map Texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }} />
      
      {/* Grid Lines */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-8 opacity-10 pointer-events-none">
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-slate-400" />
        ))}
      </div>

      {/* Simulated Roads */}
      <div className="absolute top-1/4 left-0 w-full h-12 bg-white/50 -rotate-12 border-y border-slate-200" />
      <div className="absolute top-0 left-1/3 w-16 h-full bg-white/50 rotate-6 border-x border-slate-200" />

      {/* Shop Pins */}
      {shops.map((shop, idx) => (
        <button
          key={shop.id}
          onClick={() => onShopClick(shop)}
          className="absolute transform -translate-x-1/2 -translate-y-full hover:scale-110 transition-all duration-300 z-10"
          style={{
            top: `${20 + idx * 30}%`,
            left: `${30 + idx * 40}%`
          }}
        >
          <div className="relative">
            <div className={`p-2 rounded-2xl shadow-xl flex items-center justify-center border-2 border-white ${shop.isOpen ? 'bg-emerald-500' : 'bg-slate-500'} text-white`}>
              <MapPin size={24} />
            </div>
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded-lg shadow-lg border border-slate-100 whitespace-nowrap">
              <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">{shop.name}</span>
            </div>
            <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${shop.isOpen ? 'bg-emerald-500' : 'bg-slate-500'} border-r border-b border-white`} />
          </div>
        </button>
      ))}

      {/* User Location Pin */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="w-8 h-8 bg-blue-500/20 rounded-full animate-ping absolute inset-0" />
        <div className="w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white">
          <Navigation2 size={16} className="fill-current" />
        </div>
      </div>
    </div>
  );
};

export default MapPreview;
