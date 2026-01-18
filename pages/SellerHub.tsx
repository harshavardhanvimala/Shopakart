
import React, { useState } from 'react';
import { 
  BarChart3, Store, Settings, ToggleLeft, 
  ToggleRight, Eye, Users, Plus, 
  ChevronRight, Camera, QrCode, ArrowUpRight
} from 'lucide-react';
import { Shop } from '../types';
import QRCodeModal from '../components/QRCodeModal';

interface SellerHubProps {
  shop: Shop;
  onEditShop: () => void;
  onAddStock: () => void;
}

const SellerHub: React.FC<SellerHubProps> = ({ shop, onEditShop, onAddStock }) => {
  const [isOpen, setIsOpen] = useState(shop.isOpen);
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* M3 Large Top App Bar */}
      <header className="px-6 pt-12 pb-6 flex justify-between items-start sticky top-0 bg-white/90 backdrop-blur-md z-40">
        <div>
          <h1 className="text-3xl font-medium text-slate-900 leading-tight">Business Hub</h1>
          <p className="text-sm font-medium text-emerald-600">{shop.name}</p>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 p-1 pl-4 rounded-full border transition-all ${
            isOpen ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-wide">{isOpen ? 'Live' : 'Closed'}</span>
          <div className="bg-white rounded-full p-1 shadow-sm">
            {isOpen ? <ToggleRight size={24} className="text-emerald-600" /> : <ToggleLeft size={24} />}
          </div>
        </button>
      </header>

      <main className="px-4 space-y-4">
        {/* Android Style Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-50 p-6 rounded-[28px] flex flex-col justify-between h-40">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
              <Eye size={22} />
            </div>
            <div>
              <p className="text-3xl font-medium text-emerald-900">{shop.viewsToday}</p>
              <p className="text-xs font-medium text-emerald-700/70">Shop views</p>
            </div>
          </div>
          <div className="bg-slate-50 p-6 rounded-[28px] flex flex-col justify-between h-40">
            <div className="w-10 h-10 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center">
              <Users size={22} />
            </div>
            <div>
              <p className="text-3xl font-medium text-slate-900">42</p>
              <p className="text-xs font-medium text-slate-500">New followers</p>
            </div>
          </div>
        </div>

        {/* Action List Section */}
        <div className="bg-slate-50 rounded-[32px] p-2 space-y-1">
          <button 
            onClick={() => setShowQR(true)}
            className="w-full flex items-center justify-between p-5 bg-white rounded-[24px] hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center">
                <QrCode size={20} />
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-900">Share QR Code</p>
                <p className="text-xs text-slate-500">For physical marketing</p>
              </div>
            </div>
            <ArrowUpRight size={20} className="text-slate-300" />
          </button>
          
          <button 
            onClick={onEditShop}
            className="w-full flex items-center justify-between p-5 bg-white rounded-[24px] hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center">
                <Settings size={20} />
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-900">Store Settings</p>
                <p className="text-xs text-slate-500">Edit address & details</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>
        </div>

        {/* M3 Style Sales Card */}
        <div className="bg-slate-900 text-white p-6 rounded-[32px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-medium">Performance</h3>
            <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold">Week</div>
          </div>
          <div className="flex items-end justify-between h-24 gap-3">
            {[40, 70, 45, 90, 65, 30, 85].map((h, i) => (
              <div key={i} className="flex-1 bg-white/10 rounded-full overflow-hidden relative">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-emerald-400" 
                  style={{ height: `${h}%` }} 
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Android FAB (Floating Action Button) */}
      <button 
        onClick={onAddStock}
        className="fixed bottom-24 right-6 w-16 h-16 bg-emerald-200 text-emerald-900 rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40"
      >
        <Plus size={32} />
      </button>

      {showQR && (
        <QRCodeModal 
          shopId={shop.id} 
          shopName={shop.name} 
          onClose={() => setShowQR(false)} 
        />
      )}
    </div>
  );
};

export default SellerHub;
