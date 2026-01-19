
import React from 'react';
import { Compass, User, ClipboardList, Tag, LayoutDashboard, Package, Settings } from 'lucide-react';
import { AppView, Role } from '../types';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  role: Role;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, role }) => {
  const buyerNavItems = [
    { id: 'HOME' as AppView, label: 'Explore', icon: <Compass size={24} /> },
    { id: 'PRICE_COMPARE' as AppView, label: 'Compare', icon: <Tag size={24} /> },
    { id: 'VISIT_LIST' as AppView, label: 'My List', icon: <ClipboardList size={24} /> },
    { id: 'PROFILE' as AppView, label: 'Account', icon: <User size={24} /> },
  ];

  const sellerNavItems = [
    { id: 'SELLER_HUB' as AppView, label: 'Dashboard', icon: <LayoutDashboard size={24} /> },
    { id: 'MANAGE_INVENTORY' as AppView, label: 'Inventory', icon: <Package size={24} /> },
    { id: 'MANAGE_SHOP' as AppView, label: 'Setup', icon: <Settings size={24} /> },
    { id: 'PROFILE' as AppView, label: 'Account', icon: <User size={24} /> },
  ];

  const navItems = role === 'BUYER' ? buyerNavItems : sellerNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-2xl border-t border-slate-100 px-6 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] flex justify-between items-center z-[80]">
      {navItems.map((item, idx) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={idx}
            onClick={() => setView(item.id)}
            className="flex flex-col items-center gap-1 group relative outline-none flex-1"
          >
            <div className={`h-8 w-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              isActive ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-100'
            }`}>
              {React.cloneElement(item.icon as React.ReactElement<any>, {
                size: 24,
                strokeWidth: isActive ? 2.5 : 2
              })}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
              isActive ? 'text-emerald-700' : 'text-slate-400'
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
