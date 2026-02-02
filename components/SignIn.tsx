
import React from 'react';
import { 
  Mail, Lock, ArrowRight, ShieldCheck, ArrowLeft
} from 'lucide-react';
import { Role } from '../types';

interface SignInProps {
  onSuccess: () => void;
  onBack: () => void;
  targetRole: Role;
  t: (key: string) => string;
}

const SignIn: React.FC<SignInProps> = ({ onSuccess, onBack, targetRole, t }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-obsidian flex flex-col items-center justify-center p-8 overflow-hidden animate-in fade-in duration-500">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-emerald-600/5 rounded-full blur-[120px] animate-aura-pulse" />

      <div className="absolute top-16 left-8 right-8 flex justify-between items-center z-10">
        <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
          <ShieldCheck size={12} className="text-emerald-400" />
          <span className="text-[8px] font-black text-white/60 uppercase tracking-[0.3em]">Secure Session</span>
        </div>
      </div>

      <div className="w-full max-w-sm relative z-10 pb-24">
        <header className="mb-14 text-center animate-in slide-in-from-bottom duration-700">
          <h2 className="text-5xl font-black text-white tracking-tighter mb-3 leading-none italic">
            Login
          </h2>
          <p className="text-white/30 text-sm font-medium tracking-tight">
            Accessing {targetRole === 'SELLER' ? 'Merchant Console' : 'Shopakart Marketplace'}
          </p>
        </header>

        <div className="space-y-6 animate-in slide-in-from-bottom duration-700 delay-100">
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-400 transition-colors">
                <Mail size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Email or Phone"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-5 pl-16 pr-8 text-white font-bold placeholder:text-white/20 outline-none focus:ring-4 focus:ring-emerald-400/5 focus:border-emerald-400/40 transition-all"
              />
            </div>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-400 transition-colors">
                <Lock size={20} />
              </div>
              <input 
                type="password" 
                placeholder="Password"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-5 pl-16 pr-8 text-white font-bold placeholder:text-white/20 outline-none focus:ring-4 focus:ring-emerald-400/5 focus:border-emerald-400/40 transition-all"
              />
            </div>
          </div>

          <button 
            onClick={onSuccess}
            className="w-full py-5 bg-emerald-500 text-white rounded-xl font-black text-lg flex items-center justify-center gap-4 active:scale-95 transition-all shadow-2xl shadow-emerald-500/20 mt-4"
          >
            {t('authenticate')}
            <ArrowRight size={22} />
          </button>
        </div>

        <footer className="mt-16 text-center animate-in slide-in-from-bottom duration-700 delay-300">
          <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.5em]">Verdant Secure v4.5</p>
        </footer>
      </div>
    </div>
  );
};

export default SignIn;
