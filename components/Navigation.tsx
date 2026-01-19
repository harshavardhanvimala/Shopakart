
import React from 'react';
import { Compass, User, Store, PlusCircle, Search, ClipboardList, Tag, LayoutDashboard, Package, Settings } from 'lucide-react';
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-100 px-2 pt-3 pb-6 flex justify-around items-center z-50">
      {navItems.map((item, idx) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={idx}
            onClick={() => setView(item.id)}
            className="flex flex-col items-center gap-1 group relative outline-none"
          >
            <div className={`m3-pill h-8 w-16 rounded-full flex items-center justify-center transition-all ${
              isActive ? 'bg-emerald-100 text-emerald-900' : 'text-slate-500 hover:bg-slate-50'
            }`}>
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
