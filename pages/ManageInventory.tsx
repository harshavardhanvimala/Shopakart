
import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Edit2, Save, X, Package, Tag, Layers, Check } from 'lucide-react';
import { Product } from '../types';

interface ManageInventoryProps {
  shopId: string;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onBack: () => void;
}

const ManageInventory: React.FC<ManageInventoryProps> = ({ shopId, products, setProducts, onBack }) => {
  const shopProducts = products.filter(p => p.shopId === shopId);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    stock: 0,
    category: 'Retail',
    unit: 'pcs',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400'
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '', price: 0, stock: 0, category: 'Retail', unit: 'pcs',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400'
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
    setIsFormOpen(true);
  };

  const handleSaveProduct = () => {
    if (!formData.name || formData.price === undefined) return;
    
    if (editingId) {
      setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...formData } as Product : p));
    } else {
      const product: Product = {
        id: Math.random().toString(36).substr(2, 9),
        shopId,
        name: formData.name!,
        price: Number(formData.price),
        stock: Number(formData.stock) || 0,
        imageUrl: formData.imageUrl!,
        category: formData.category!,
        unit: formData.unit!
      };
      setProducts(prev => [...prev, product]);
    }
    setIsFormOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Delete this item from your catalog?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 animate-in slide-in-from-right">
      <header className="sticky top-0 bg-white/90 backdrop-blur-md z-40 border-b p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-900 transition-colors" aria-label="Go back">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-black text-slate-900 tracking-tighter">Live Inventory</h1>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg active:scale-90 transition-all hover:bg-emerald-700"
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="p-6 space-y-4">
        {isFormOpen && (
          <div className="bg-white p-6 rounded-[32px] border-2 border-emerald-500 shadow-xl space-y-4 animate-in zoom-in duration-200">
             <div className="flex justify-between items-center mb-2">
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">
                  {editingId ? 'Edit Product' : 'New Product'}
                </h3>
                <button onClick={() => setIsFormOpen(false)} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
             </div>
             <div className="space-y-3">
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Product Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Arabica Roast" 
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 transition-all"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
               </div>
               <div className="grid grid-cols-2 gap-3">
                 <div className="relative">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Price ($)</label>
                   <div className="relative">
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        className="w-full p-4 pl-10 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 transition-all"
                        value={formData.price || ''}
                        onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                      />
                      <Tag className="absolute left-4 top-4 text-slate-400" size={18} />
                   </div>
                 </div>
                 <div className="relative">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Units in Stock</label>
                   <div className="relative">
                      <input 
                        type="number" 
                        placeholder="0" 
                        className="w-full p-4 pl-10 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 transition-all"
                        value={formData.stock || ''}
                        onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                      />
                      <Package className="absolute left-4 top-4 text-slate-400" size={18} />
                   </div>
                 </div>
               </div>
             </div>
             <button 
               onClick={handleSaveProduct}
               className="w-full py-4 bg-emerald-600 text-white rounded-[20px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200 active:scale-95 transition-all hover:bg-emerald-700 flex items-center justify-center gap-2"
             >
               <Save size={18} />
               {editingId ? 'Update Item' : 'Add to Catalog'}
             </button>
          </div>
        )}

        <div className="space-y-3">
           {shopProducts.map(p => (
             <div key={p.id} className="bg-white p-4 rounded-[28px] border border-slate-100 flex items-center gap-4 group hover:border-emerald-200 transition-colors shadow-sm">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-inner flex-shrink-0 border border-slate-50">
                  <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-800 leading-tight">{p.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                     <span className={`text-[10px] font-black px-2 py-0.5 rounded shadow-sm ${p.stock < 10 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'}`}>
                        {p.stock} {p.unit}
                     </span>
                     <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tight">${p.price.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenEdit(p)}
                    className="p-3 text-emerald-600 bg-emerald-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all active:scale-90 hover:bg-emerald-100"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(p.id)}
                    className="p-3 text-rose-500 bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all active:scale-90 hover:bg-rose-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
             </div>
           ))}
           {shopProducts.length === 0 && !isFormOpen && (
             <div className="py-32 flex flex-col items-center justify-center text-slate-300">
                <div className="p-6 bg-slate-100 rounded-full mb-4">
                  <Layers size={64} strokeWidth={1} />
                </div>
                <p className="font-black uppercase tracking-widest text-xs">Catalog is empty</p>
                <button onClick={handleOpenAdd} className="mt-4 text-emerald-600 font-bold text-sm underline underline-offset-4 decoration-2">Add your first item</button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ManageInventory;
