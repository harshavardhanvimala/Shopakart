
import React from 'react';
import { Globe, ShieldCheck, Zap } from 'lucide-react';

interface LanguagePopupProps {
  onSelect: (lang: string) => void;
}

const LanguagePopup: React.FC<LanguagePopupProps> = ({ onSelect }) => {
  const languages = [
    { id: 'en', label: 'English', sub: 'Standard Global', flag: '🇺🇸' },
    { id: 'hi', label: 'हिन्दी', sub: 'National Pulse', flag: '🇮🇳' },
    { id: 'kn', label: 'ಕನ್ನಡ', sub: 'Local Origin', flag: '🇮🇳' },
    { id: 'ta', label: 'தமிழ்', sub: 'Classical Core', flag: '🇮🇳' },
    { id: 'te', label: 'తెలుగు', sub: 'Deccan Link', flag: '🇮🇳' },
    { id: 'ml', label: 'മലയാളം', sub: 'Coastal Sync', flag: '🇮🇳' },
    { id: 'bn', label: 'বাংলা', sub: 'Eastern Flow', flag: '🇮🇳' },
    { id: 'mr', label: 'मराठी', sub: 'Western Node', flag: '🇮🇳' },
    { id: 'pa', label: 'ਪੰਜਾਬੀ', sub: 'Northern Power', flag: '🇮🇳' }
  ];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center px-8">
      {/* Immersive Backdrop */}
      <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-xl animate-in fade-in duration-700" />
      
      {/* Popup Container */}
      <div className="relative w-full max-w-sm bg-[#0a0a20]/90 backdrop-blur-3xl border border-white/10 rounded-[48px] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.8)] animate-in zoom-in slide-in-from-bottom-12 duration-500 ease-out overflow-hidden flex flex-col max-h-[85vh]">
        {/* Decorative Background Aura */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-lime-400/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />

        <header className="relative z-10 text-center mb-6 shrink-0">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-[22px] border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-4 shadow-inner">
            <Globe size={32} strokeWidth={2.5} className="animate-[spin_8s_linear_infinite]" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter mb-2 leading-none italic">
            Region <span className="text-emerald-400">Sync</span>
          </h2>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Select Interface Protocol</p>
        </header>

        {/* Scrollable Language List */}
        <div className="space-y-3 relative z-10 overflow-y-auto pr-2 no-scrollbar grow py-2">
          {languages.map((lang, idx) => (
            <button
              key={lang.id}
              onClick={() => onSelect(lang.id)}
              className="w-full p-4 bg-white/5 border border-white/10 rounded-[24px] flex items-center justify-between group active:scale-[0.98] hover:bg-white/10 hover:border-emerald-500/30 transition-all animate-in slide-in-from-bottom-4 fill-mode-both"
              style={{ animationDelay: `${idx * 60 + 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-lg shadow-inner group-hover:scale-110 transition-transform">
                  {lang.flag}
                </div>
                <div className="text-left">
                  <p className="font-black text-white group-hover:text-emerald-400 transition-colors tracking-tight text-base">{lang.label}</p>
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none mt-1">{lang.sub}</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
                <Zap size={14} className="text-white/10 group-hover:text-emerald-400 group-hover:fill-emerald-400 transition-all" />
              </div>
            </button>
          ))}
        </div>

        <footer className="mt-6 text-center relative z-10 shrink-0">
           <div className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/5 rounded-full border border-emerald-500/10 inline-flex">
              <ShieldCheck size={12} className="text-emerald-500" />
              <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Secured Locale Binding</span>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default LanguagePopup;
