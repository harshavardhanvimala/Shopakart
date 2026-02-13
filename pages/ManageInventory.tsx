
import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Edit2, Save, X, Package, Tag, Layers } from 'lucide-react';
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
    if (confirm("Delete this item?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-obsidian pb-32 animate-in slide-in-from-right">
      <header className="px-6 pt-16 pb-4 bg-white dark:bg-white/5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1"><ArrowLeft size={20} className="text-slate-900 dark:text-white" /></button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Stock List</h1>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1"
        >
          <Plus size={16} /> Add Item
        </button>
      </header>

      <main className="p-6 space-y-3">
        {shopProducts.map(p => (
          <div key={p.id} className="bg-white dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/10 flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
              <img src={p.imageUrl} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{p.name}</h4>
              <div className="flex items-center gap-3 mt-1">
                <span className={`text-[10px] font-black uppercase ${p.stock < 10 ? 'text-rose-500' : 'text-slate-400'}`}>
                  {p.stock} {p.unit}
                </span>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">${p.price.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => handleOpenEdit(p)} className="p-2 text-slate-300 hover:text-emerald-500 transition-colors"><Edit2 size={16} /></button>
              <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}

        {shopProducts.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-300 opacity-50">
            <Package size={48} strokeWidth={1} />
            <p className="text-[10px] font-black uppercase tracking-widest mt-2">No items listed</p>
          </div>
        )}
      </main>

      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-obsidian rounded-2xl p-6 shadow-2xl animate-in zoom-in duration-200">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-slate-900 dark:text-white uppercase text-xs">{editingId ? 'Edit Product' : 'New Product'}</h3>
                <button onClick={() => setIsFormOpen(false)}><X size={20} className="text-slate-400" /></button>
             </div>
             <div className="space-y-4">
               <input 
                 type="text" 
                 placeholder="Product Name" 
                 className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-xl border-none outline-none font-bold text-sm"
                 value={formData.name}
                 onChange={e => setFormData({...formData, name: e.target.value})}
               />
               <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="number" 
                    placeholder="Price ($)" 
                    className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-xl border-none outline-none font-bold text-sm"
                    value={formData.price || ''}
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                  />
                  <input 
                    type="number" 
                    placeholder="Stock" 
                    className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-xl border-none outline-none font-bold text-sm"
                    value={formData.stock || ''}
                    onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                  />
               </div>
               <button 
                 onClick={handleSaveProduct}
                 className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2"
               >
                 <Save size={18} /> Save Item
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageInventory;
