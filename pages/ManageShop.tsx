
import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, Camera, MapPin, Sparkles, Loader2, 
  Save, X, Plus
} from 'lucide-react';
import { CATEGORIES } from '../constants';
import { generateShopDescription } from '../services/geminiService';
import { LocationState, ShopStory, Shop } from '../types';

interface ManageShopProps {
  shop: Shop;
  onSave: (updatedShop: Shop) => void;
  onBack: () => void;
}

const ManageShop: React.FC<ManageShopProps> = ({ shop, onSave, onBack }) => {
  const [name, setName] = useState(shop.name);
  const [category, setCategory] = useState(shop.category);
  const [description, setDescription] = useState(shop.description);
  const [address, setAddress] = useState(shop.address);
  const [isGenerating, setIsGenerating] = useState(false);
  const [image, setImage] = useState<string | null>(shop.imageUrl);
  const [stories, setStories] = useState<ShopStory[]>(shop.stories || []);
  const [location, setLocation] = useState<LocationState>({
    lat: shop.coordinates.lat,
    lng: shop.coordinates.lng,
    address: shop.address,
    loading: false,
    error: null
  });

  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleAI协助 = async () => {
    if (!name) return;
    setIsGenerating(true);
    const desc = await generateShopDescription(name, category);
    setDescription(desc);
    setIsGenerating(false);
  };

  const handleSave = () => {
    onSave({
      ...shop,
      name, category, description, address,
      imageUrl: image || shop.imageUrl,
      stories,
      coordinates: { lat: location.lat || shop.coordinates.lat, lng: location.lng || shop.coordinates.lng }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-obsidian pb-24">
      <header className="sticky top-0 bg-white dark:bg-obsidian z-40 border-b border-slate-100 dark:border-white/10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1"><ArrowLeft size={20} className="text-slate-900 dark:text-white" /></button>
          <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Store Setup</h1>
        </div>
        <button onClick={handleSave} className="text-emerald-600 font-bold px-3 py-1">Save</button>
      </header>

      <div className="p-6 max-w-2xl mx-auto space-y-8">
        <section>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Store Cover</p>
          <div 
            onClick={() => bannerInputRef.current?.click()}
            className="relative h-40 w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden flex flex-col items-center justify-center cursor-pointer"
          >
            {image ? (
              <img src={image} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <Camera size={24} />
                <p className="text-[10px] font-black uppercase">Upload Banner</p>
              </div>
            )}
            <input type="file" ref={bannerInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          </div>
        </section>

        <section className="space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Details</p>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="w-full px-4 py-4 bg-slate-50 dark:bg-white/5 rounded-xl border-none outline-none font-bold text-sm" 
            placeholder="Shop Name" 
          />
          
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.slice(0, 4).map(cat => (
              <button 
                key={cat.id} 
                onClick={() => setCategory(cat.name)} 
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                  category === cat.name ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="relative">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bio</span>
              <button onClick={handleAI协助} className="text-[10px] font-black text-violet-600 uppercase flex items-center gap-1">
                {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                AI Generate
              </button>
            </div>
            <textarea 
              rows={3} 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              className="w-full px-4 py-4 bg-slate-50 dark:bg-white/5 rounded-xl border-none outline-none font-medium text-sm resize-none" 
              placeholder="Store description..." 
            />
          </div>
        </section>

        <section className="space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address</p>
          <div className="relative">
            <input 
              type="text" 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              placeholder="Street Address" 
              className="w-full px-4 py-4 bg-slate-50 dark:bg-white/5 rounded-xl border-none outline-none font-bold text-sm" 
            />
            <MapPin size={16} className="absolute right-4 top-4 text-slate-300" />
          </div>
        </section>

        <button 
          onClick={handleSave} 
          className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest shadow-lg shadow-emerald-100 active:scale-95 transition-all"
        >
          Update Storefront
        </button>
      </div>
    </div>
  );
};

export default ManageShop;
