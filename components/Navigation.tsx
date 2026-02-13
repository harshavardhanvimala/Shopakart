
import React from 'react';
import { Compass, User, ClipboardList, Search, LayoutDashboard, Package, Settings } from 'lucide-react';
import { AppView, Role } from '../types';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  role: Role;
  t: (key: string) => string;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, role, t }) => {
  const buyerNavItems = [
    { id: 'HOME' as AppView, label: t('explore'), icon: <Compass /> },
    { id: 'PRICE_COMPARE' as AppView, label: t('search'), icon: <Search /> },
    { id: 'VISIT_LIST' as AppView, label: t('catalog'), icon: <ClipboardList /> },
    { id: 'PROFILE' as AppView, label: t('profile'), icon: <User /> },
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
      <nav className="glass-dark px-6 py-5 rounded-[44px] flex justify-between items-center shadow-[0_25px_60px_-10px_rgba(0,0,0,0.6)] border border-white/10 bg-[#0f172a]/90 backdrop-blur-xl">
        {navItems.map((item, idx) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={idx}
              onClick={() => setView(item.id)}
              className="flex flex-col items-center gap-2 group relative outline-none flex-1 transition-all"
            >
              <div className={`h-12 w-12 rounded-[22px] flex items-center justify-center transition-all duration-300 relative ${
                isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-110' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}>
                {React.cloneElement(item.icon as React.ReactElement<any>, {
                  size: 22,
                  strokeWidth: isActive ? 2.5 : 2
                })}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${
                isActive ? 'text-emerald-400' : 'text-slate-500'
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
