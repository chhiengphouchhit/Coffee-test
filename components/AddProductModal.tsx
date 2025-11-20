
import React, { useState, useEffect } from 'react';
import { Category, Product } from '../types';
import { X, Plus, Tag, DollarSign, Image as ImageIcon, Save } from 'lucide-react';

interface AddProductModalProps {
  onClose: () => void;
  onSave: (product: Product) => void;
  categories: string[];
  initialProduct?: Product | null;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ onClose, onSave, categories, initialProduct }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState<Category>(categories[0] as Category);

  // Initialize form if editing
  useEffect(() => {
    if (initialProduct) {
        setName(initialProduct.name);
        setPrice(initialProduct.price.toString());
        setImage(initialProduct.image || '');
        setCategory(initialProduct.category);
    }
  }, [initialProduct]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const productToSave: Product = {
      id: initialProduct?.id || Math.random().toString(36).substring(2, 9),
      name,
      price: parseFloat(price),
      category,
      image: image.trim() || undefined,
      allowsModifiers: initialProduct ? initialProduct.allowsModifiers : true,
    };

    onSave(productToSave);
    onClose();
  };

  const isEditing = !!initialProduct;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200 transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200">
                    {isEditing ? <Save size={20} /> : <Plus size={20} />}
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                    {isEditing ? 'កែប្រែទំនិញ' : 'បន្ថែមទំនិញថ្មី'}
                </h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
                <X size={24} />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="space-y-1">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">ឈ្មោះទំនិញ</label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Tag size={18} />
                    </div>
                    <input 
                        type="text" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all"
                        placeholder="ឧ. Iced Matcha Latte"
                        required
                        autoFocus
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">តម្លៃ</label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <DollarSign size={18} />
                    </div>
                    <input 
                        type="number" 
                        step="0.01"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all"
                        placeholder="0.00"
                        required
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">តំណភ្ជាប់រូបភាព (Optional)</label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <ImageIcon size={18} />
                    </div>
                    <input 
                        type="url" 
                        value={image}
                        onChange={e => setImage(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">ប្រភេទ</label>
                <select 
                    value={category}
                    onChange={e => setCategory(e.target.value as Category)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all cursor-pointer"
                >
                    {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            <div className="pt-4">
                <button 
                    type="submit"
                    className="w-full py-3.5 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-200 dark:shadow-amber-900/50 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    {isEditing ? <Save size={20} /> : <Plus size={20} />}
                    {isEditing ? 'រក្សាទុកការផ្លាស់ប្តូរ' : 'បន្ថែមទៅម៉ឺនុយ'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};