
import React from 'react';
import { Compass, User, Store, PlusCircle, Search } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'HOME' as AppView, label: 'Explore', icon: <Compass size={24} /> },
    { id: 'SELLER_HUB' as AppView, label: 'Business', icon: <Store size={24} /> },
    { id: 'MANAGE_SHOP' as AppView, label: 'Register', icon: <PlusCircle size={24} /> },
    { id: 'PROFILE' as AppView, label: 'Profile', icon: <User size={24} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-100 px-2 pt-3 pb-6 flex justify-around items-center z-50">
      {navItems.map((item, idx) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={idx}
            onClick={() => setView(item.id)}
            className="flex flex-col items-center gap-1 group relative outline-none"
          >
            {/* M3 Active Indicator Pill */}
            <div className={`m3-pill h-8 w-16 rounded-full flex items-center justify-center transition-all ${
              isActive ? 'bg-emerald-100 text-emerald-900' : 'text-slate-500 hover:bg-slate-50'
            }`}>
              {/* Fix: Cast icon to React.ReactElement<any> to allow dynamic prop injection via cloneElement for lucide-react icons */}
              {React.cloneElement(item.icon as React.ReactElement<any>, {
                size: 24,
                strokeWidth: isActive ? 2.5 : 2
              })}
            </div>
            <span className={`text-[11px] font-medium transition-colors ${
              isActive ? 'text-emerald-900 font-bold' : 'text-slate-500'
            }`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;
