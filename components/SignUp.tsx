
import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, User, Mail, Lock, 
  ShieldCheck, Loader2, Store, ShoppingBag, 
  CheckCircle, Smartphone
} from 'lucide-react';
import { Role } from '../types';

interface SignUpProps {
  role: Role;
  setRole: (role: Role) => void;
  onSuccess: () => void;
  onLogin: () => void;
  onBack: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ role, setRole, onSuccess, onLogin, onBack }) => {
  const [step, setStep] = useState<'DETAILS' | 'VERIFY'>('DETAILS');
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    password: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleDetailsSubmit = () => {
    if (!formData.name || !formData.contact || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    // Simulate network check
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('VERIFY');
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < 4) return;
    
    setIsLoading(true);
    setTimeout(() => {
      // Mock verification success
      setIsLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-obsidian flex flex-col items-center justify-center p-8 overflow-hidden animate-in fade-in duration-500">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-indigo-600/5 rounded-full blur-[120px]" />

      <div className="absolute top-16 left-8 right-8 flex justify-between items-center z-10">
        <button onClick={step === 'VERIFY' ? () => setStep('DETAILS') : onBack} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors active:scale-95">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
          <ShieldCheck size={12} className="text-indigo-400" />
          <span className="text-[8px] font-black text-white/60 uppercase tracking-[0.3em]">New Account</span>
        </div>
      </div>

      <div className="w-full max-w-sm relative z-10 pb-12 flex flex-col h-full justify-center">
        {step === 'DETAILS' && (
          <div className="animate-in slide-in-from-right duration-500">
            <header className="mb-8 text-center">
              <h2 className="text-4xl font-black text-white tracking-tighter mb-2 italic">
                Join Shopakart
              </h2>
              <p className="text-white/40 text-sm font-medium tracking-tight">
                Create your profile to start {role === 'SELLER' ? 'selling' : 'shopping'} locally.
              </p>
            </header>

            {/* Role Toggle */}
            <div className="bg-white/5 p-1 rounded-xl flex mb-8 border border-white/10">
              <button 
                onClick={() => setRole('BUYER')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${role === 'BUYER' ? 'bg-emerald-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
              >
                <ShoppingBag size={14} /> Shopper
              </button>
              <button 
                onClick={() => setRole('SELLER')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${role === 'SELLER' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
              >
                <Store size={14} /> Merchant
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-400 transition-colors">
                  <User size={20} />
                </div>
                <input 
                  type="text" 
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-5 pl-16 pr-8 text-white font-bold placeholder:text-white/20 outline-none focus:ring-4 focus:ring-emerald-400/5 focus:border-emerald-400/40 transition-all"
                />
              </div>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-400 transition-colors">
                  <Mail size={20} />
                </div>
                <input 
                  type="text" 
                  placeholder="Email or Phone Number"
                  value={formData.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-5 pl-16 pr-8 text-white font-bold placeholder:text-white/20 outline-none focus:ring-4 focus:ring-emerald-400/5 focus:border-emerald-400/40 transition-all"
                />
              </div>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-400 transition-colors">
                  <Lock size={20} />
                </div>
                <input 
                  type="password" 
                  placeholder="Create Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-5 pl-16 pr-8 text-white font-bold placeholder:text-white/20 outline-none focus:ring-4 focus:ring-emerald-400/5 focus:border-emerald-400/40 transition-all"
                />
              </div>
            </div>

            {error && <p className="text-rose-500 text-xs font-bold text-center mt-4 bg-rose-500/10 py-2 rounded-lg">{error}</p>}

            <button 
              onClick={handleDetailsSubmit}
              disabled={isLoading}
              className="w-full py-5 bg-white text-obsidian rounded-xl font-black text-lg flex items-center justify-center gap-4 active:scale-95 transition-all shadow-xl shadow-white/5 mt-8 hover:bg-slate-200"
            >
              {isLoading ? <Loader2 size={24} className="animate-spin" /> : <>Continue <ArrowRight size={22} /></>}
            </button>
            
            <button 
              onClick={onLogin}
              className="w-full mt-6 text-xs font-bold text-white/40 uppercase tracking-widest hover:text-white transition-colors"
            >
              Already a member? Log In
            </button>
          </div>
        )}

        {step === 'VERIFY' && (
          <div className="animate-in slide-in-from-right duration-500 text-center">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
               <Smartphone size={32} className="text-emerald-400" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Verify Contact</h2>
            <p className="text-white/40 text-sm font-medium mb-8">
              We sent a 4-digit code to <br/><span className="text-white font-bold">{formData.contact}</span>
            </p>
          

            <div className="flex gap-4 justify-center mb-8">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="tel"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-16 h-20 bg-white/5 border border-white/10 rounded-2xl text-center text-3xl font-black text-white focus:border-emerald-500 focus:bg-emerald-500/10 outline-none transition-all caret-transparent"
                />
              ))}
            </div>

            <button 
              onClick={handleVerify}
              disabled={otp.join('').length < 4 || isLoading}
              className="w-full py-5 bg-emerald-500 text-white rounded-xl font-black text-lg flex items-center justify-center gap-4 active:scale-95 transition-all shadow-2xl shadow-emerald-500/20 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? <Loader2 size={24} className="animate-spin" /> : <>Complete Setup <CheckCircle size={22} /></>}
            </button>
            
            <button 
               onClick={() => setStep('DETAILS')}
               className="mt-6 text-xs font-bold text-white/30 uppercase tracking-widest hover:text-white transition-colors"
            >
              Change Contact Info
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
