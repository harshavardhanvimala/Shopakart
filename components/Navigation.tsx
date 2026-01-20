
import React from 'react';
import { Compass, User, ClipboardList, Search, LayoutDashboard, Package, Settings } from 'lucide-react';
import { AppView, Role } from '../types';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  role: Role;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, role }) => {
  const buyerNavItems = [
    { id: 'HOME' as AppView, label: 'Discover', icon: <Compass /> },
    { id: 'PRICE_COMPARE' as AppView, label: 'Search', icon: <Search /> },
    { id: 'VISIT_LIST' as AppView, label: 'Catalog', icon: <ClipboardList /> },
    { id: 'PROFILE' as AppView, label: 'Pulse', icon: <User /> },
  ];

  const sellerNavItems = [
    { id: 'SELLER_HUB' as AppView, label: 'Insights', icon: <LayoutDashboard /> },
    { id: 'MANAGE_INVENTORY' as AppView, label: 'Stock', icon: <Package /> },
    { id: 'MANAGE_SHOP' as AppView, label: 'Store', icon: <Settings /> },
    { id: 'PROFILE' as AppView, label: 'Me', icon: <User /> },
  ];

  const navItems = role === 'BUYER' ? buyerNavItems : sellerNavItems;

  return (
    <div className="fixed bottom-12 left-8 right-8 z-[80]">
      <nav className="glass-dark dark:glass px-6 py-5 rounded-[44px] flex justify-between items-center shadow-[0_20px_50px_-10px_rgba(30,27,75,0.4)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)]">
        {navItems.map((item, idx) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={idx}
              onClick={() => setView(item.id)}
              className="flex flex-col items-center gap-2 group relative outline-none flex-1 transition-all"
            >
              <div className={`h-12 w-12 rounded-[22px] flex items-center justify-center transition-all duration-300 relative ${
                isActive ? 'bg-amber-400 text-indigo-950 shadow-lg shadow-amber-400/20' : 'text-indigo-200/40 dark:text-white/20 hover:text-white'
              }`}>
                {React.cloneElement(item.icon as React.ReactElement<any>, {
                  size: 22,
                  strokeWidth: isActive ? 3 : 2
                })}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-[0.25em] transition-colors ${
                isActive ? 'text-amber-400' : 'text-indigo-200/20 dark:text-white/10'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Navigation;
