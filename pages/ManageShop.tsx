
import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Camera, MapPin, Sparkles, Loader2, 
  Check, Save, Trash2, Image as ImageIcon, Plus,
  Film, Play, X
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
  const storyInputRef = useRef<HTMLInputElement>(null);

  const handleAI协助 = async () => {
    if (!name) {
      alert("Please enter a shop name first");
      return;
    }
    setIsGenerating(true);
    const desc = await generateShopDescription(name, category);
    setDescription(desc);
    setIsGenerating(false);
  };

  const handleSave = () => {
    onSave({
      ...shop,
      name,
      category,
      description,
      address,
      imageUrl: image || shop.imageUrl,
      stories,
      coordinates: {
        lat: location.lat || shop.coordinates.lat,
        lng: location.lng || shop.coordinates.lng
      }
    });
  };

  const handleUseCurrentLocation = () => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));
    if (!navigator.geolocation) {
      setLocation(prev => ({ ...prev, loading: false, error: 'Geolocation not supported' }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({
          lat: latitude,
          lng: longitude,
          address: 'Fetching address...',
          loading: false,
          error: null
        });
        setTimeout(() => {
          const mockAddr = `${Math.floor(Math.random() * 500)} Random St, Near Tech Park`;
          setAddress(mockAddr);
          setLocation(prev => ({ ...prev, address: mockAddr }));
        }, 1500);
      },
      (err) => {
        setLocation(prev => ({ ...prev, loading: false, error: 'Permission denied' }));
      }
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStoryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newStory: ShopStory = {
          id: Math.random().toString(36).substr(2, 9),
          imageUrl: event.target?.result as string,
          timestamp: 'Just now'
        };
        setStories(prev => [newStory, ...prev]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeStory = (id: string) => {
    setStories(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <header className="sticky top-0 bg-white z-40 border-b p-4 flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-50" aria-label="Go back">
          <ArrowLeft size={24} className="text-slate-900" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Store Setup</h1>
        <button onClick={handleSave} className="text-emerald-600 font-bold px-3 py-1 hover:bg-emerald-50 rounded-lg">
          Save
        </button>
      </header>

      <div className="p-6 max-w-2xl mx-auto space-y-8">
        <section>
          <label className="block text-sm font-bold text-slate-700 mb-3">Shop Banner</label>
          <div 
            onClick={() => bannerInputRef.current?.click()}
            className="relative h-48 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors"
          >
            {image ? (
              <>
                <img src={image} className="w-full h-full object-cover" alt="Preview" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                   <div className="bg-white p-2 rounded-full text-slate-900"><Camera size={24} /></div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <div className="p-4 bg-white rounded-full shadow-sm text-slate-500">
                  <Camera size={32} />
                </div>
                <p className="text-sm font-medium text-slate-600">Click to upload banner</p>
              </div>
            )}
            <input type="file" ref={bannerInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          </div>
        </section>

        <section className="bg-emerald-50/30 p-5 rounded-[32px] border border-emerald-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">Daily Stories</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Showcase today's specials or updates</p>
            </div>
            <button onClick={() => storyInputRef.current?.click()} className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-100 active:scale-90 transition-all">
              <Plus size={20} />
            </button>
            <input type="file" ref={storyInputRef} onChange={handleStoryUpload} className="hidden" accept="image/*,video/*" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            <div onClick={() => storyInputRef.current?.click()} className="flex-shrink-0 w-28 h-40 bg-white border-2 border-dashed border-emerald-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-emerald-600 cursor-pointer active:bg-emerald-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center"><Plus size={18} /></div>
              <span className="text-[10px] font-black uppercase tracking-wider">Add New</span>
            </div>
            {stories.map(story => (
              <div key={story.id} className="flex-shrink-0 relative w-28 h-40 rounded-2xl overflow-hidden shadow-sm group border border-slate-200">
                <img src={story.imageUrl} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <button onClick={() => removeStory(story.id)} className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <X size={12} strokeWidth={3} />
                </button>
                <span className="absolute bottom-2 left-2 text-[8px] font-black text-white uppercase tracking-widest bg-black/40 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                  {story.timestamp}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Shop Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder:text-slate-500 font-medium" placeholder="e.g. Blue Bottle Coffee" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setCategory(cat.name)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${category === cat.name ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-sm font-bold text-slate-700">Description</label>
              <button onClick={handleAI协助} disabled={isGenerating} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 rounded-lg text-xs font-bold hover:bg-violet-100 disabled:opacity-50 transition-all border border-violet-100">
                {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {isGenerating ? 'Generating...' : 'AI Generate'}
              </button>
            </div>
            <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder:text-slate-500 font-medium resize-none" placeholder="Describe your products..." />
          </div>
        </section>

        <section className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-md"><MapPin size={24} /></div>
              <div>
                <h3 className="font-bold text-slate-900">Store Location</h3>
                <p className="text-xs text-slate-500 font-medium">GPS ensures customers find you</p>
              </div>
            </div>
            <button onClick={handleUseCurrentLocation} disabled={location.loading} className="px-4 py-2 bg-white text-emerald-600 text-sm font-bold rounded-xl border border-emerald-200 shadow-sm hover:shadow-md active:scale-95 transition-all disabled:opacity-50">
              {location.loading ? 'Locating...' : 'Use GPS'}
            </button>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Full street address" className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder:text-slate-500 font-medium" />
              <MapPin size={18} className="absolute left-3 top-3.5 text-slate-400" />
            </div>
          </div>
        </section>

        <div className="pt-6">
          <button onClick={handleSave} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
            <Save size={20} />
            Update Storefront
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageShop;
