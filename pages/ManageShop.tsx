
import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, Camera, MapPin, Sparkles, Loader2, 
  Check, Save, Trash2, Image as ImageIcon, Plus 
} from 'lucide-react';
import { CATEGORIES } from '../constants';
import { generateShopDescription } from '../services/geminiService';
import { LocationState } from '../types';

interface ManageShopProps {
  onBack: () => void;
}

const ManageShop: React.FC<ManageShopProps> = ({ onBack }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('retail');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationState>({
    lat: null,
    lng: null,
    address: '',
    loading: false,
    error: null
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

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
        
        // Mock reverse geocoding
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

  return (
    <div className="min-h-screen bg-white pb-24">
      <header className="sticky top-0 bg-white z-40 border-b p-4 flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-50">
          <ArrowLeft size={24} className="text-slate-700" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Register New Shop</h1>
        <button className="text-emerald-600 font-bold px-3 py-1 hover:bg-emerald-50 rounded-lg">
          Save
        </button>
      </header>

      <div className="p-6 max-w-2xl mx-auto space-y-8">
        {/* Image Picker */}
        <section>
          <label className="block text-sm font-bold text-slate-700 mb-3">Shop Banner</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="relative h-48 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors"
          >
            {image ? (
              <>
                <img src={image} className="w-full h-full object-cover" alt="Preview" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                   <div className="bg-white p-2 rounded-full"><Camera size={24} /></div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <div className="p-4 bg-white rounded-full shadow-sm">
                  <Camera size={32} />
                </div>
                <p className="text-sm font-medium">Click to upload photo</p>
                <p className="text-xs">Supports JPG, PNG (Max 5MB)</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              className="hidden" 
              accept="image/*" 
            />
          </div>
        </section>

        {/* Basic Info */}
        <section className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Shop Name</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              placeholder="e.g. Blue Bottle Coffee"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    category === cat.id 
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {cat.icon}
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-sm font-bold text-slate-700">Description</label>
              <button 
                onClick={handleAI协助}
                disabled={isGenerating}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 rounded-lg text-xs font-bold hover:bg-violet-100 disabled:opacity-50 transition-all border border-violet-100"
              >
                {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {isGenerating ? 'Generating...' : 'AI Generate'}
              </button>
            </div>
            <textarea 
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none"
              placeholder="Describe your products, story, and specialties..."
            />
          </div>
        </section>

        {/* Location Services */}
        <section className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Store Location</h3>
                <p className="text-xs text-slate-500 font-medium">GPS ensures customers find you</p>
              </div>
            </div>
            <button 
              onClick={handleUseCurrentLocation}
              disabled={location.loading}
              className="px-4 py-2 bg-white text-emerald-600 text-sm font-bold rounded-xl border border-emerald-200 shadow-sm hover:shadow-md active:scale-95 transition-all disabled:opacity-50"
            >
              {location.loading ? 'Locating...' : 'Use GPS'}
            </button>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <input 
                type="text" 
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Full street address"
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <MapPin size={18} className="absolute left-3 top-3.5 text-slate-400" />
            </div>
            
            {location.lat && (
              <div className="flex items-center gap-2 p-3 bg-white/60 rounded-lg border border-emerald-200/50 animate-in fade-in slide-in-from-top-2">
                <Check size={16} className="text-emerald-600" />
                <p className="text-xs font-mono text-slate-600">
                  Confirmed: {location.lat.toFixed(4)}, {location.lng?.toFixed(4)}
                </p>
              </div>
            )}
            
            {location.error && (
              <p className="text-xs text-rose-500 font-medium px-1">{location.error}</p>
            )}
          </div>
        </section>

        {/* Confirm */}
        <div className="pt-6">
          <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
            <Save size={20} />
            Launch My Shop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageShop;
