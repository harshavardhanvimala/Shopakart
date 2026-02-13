
import React, { useState } from 'react';
import { 
  Mail, Lock, ArrowRight, ShieldCheck, ArrowLeft, Loader2
} from 'lucide-react';
import { Role } from '../types';

interface SignInProps {
  onSuccess: () => void;
  onBack: () => void;
  onSignUp: () => void;
  targetRole: Role;
  t: (key: string) => string;
}

const SignIn: React.FC<SignInProps> = ({ onSuccess, onBack, onSignUp, targetRole, t }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-obsidian flex flex-col items-center justify-center p-8 overflow-hidden animate-in fade-in duration-500">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-emerald-600/5 rounded-full blur-[120px] animate-aura-pulse" />

      <div className="absolute top-16 left-8 right-8 flex justify-between items-center z-10">
        <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors active:scale-95">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
          <ShieldCheck size={12} className="text-emerald-400" />
          <span className="text-[8px] font-black text-white/60 uppercase tracking-[0.3em]">Secure Session</span>
        </div>
      </div>

      <div className="w-full max-w-sm relative z-10 pb-12 flex flex-col h-full justify-center">
        <header className="mb-10 text-center animate-in slide-in-from-bottom duration-700">
          <h2 className="text-5xl font-black text-white tracking-tighter mb-3 leading-none italic">
            Welcome Back
          </h2>
          <p className="text-white/40 text-sm font-medium tracking-tight">
            Log in to your {targetRole === 'SELLER' ? 'Merchant Console' : 'Shopakart Account'}
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
            <div className="flex justify-end">
              <button className="text-[10px] font-bold text-white/40 hover:text-emerald-400 transition-colors uppercase tracking-widest">
                Forgot Password?
              </button>
            </div>
          </div>

          <button 
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-5 bg-emerald-500 text-white rounded-xl font-black text-lg flex items-center justify-center gap-4 active:scale-95 transition-all shadow-2xl shadow-emerald-500/20 mt-4 disabled:opacity-70 disabled:pointer-events-none"
          >
            {isLoading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <>
                {t('authenticate')}
                <ArrowRight size={22} />
              </>
            )}
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-obsidian text-white/20 text-[10px] font-black uppercase tracking-widest">New to Shopakart?</span>
            </div>
          </div>

          <button 
            onClick={onSignUp}
            className="w-full py-4 bg-white/5 text-white border border-white/10 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-white/10"
          >
            Create an Account
          </button>
        </div>
      </div>

      <footer className="absolute bottom-8 text-center animate-in slide-in-from-bottom duration-700 delay-300">
        <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.5em]">Verdant Secure v4.5</p>
      </footer>
    </div>
  );
};

export default SignIn;
