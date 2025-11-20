
import React, { useState } from 'react';
import { X, Percent, DollarSign, Check } from 'lucide-react';
import { Discount } from '../types';

interface DiscountModalProps {
  onClose: () => void;
  onApply: (discount: Discount) => void;
  initialDiscount: Discount;
}

export const DiscountModal: React.FC<DiscountModalProps> = ({ onClose, onApply, initialDiscount }) => {
  const [type, setType] = useState<'percentage' | 'fixed'>(initialDiscount.type);
  const [value, setValue] = useState(initialDiscount.value.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      onApply({ type, value: numValue });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">ការបញ្ចុះតម្លៃ</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
                <X size={24} />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="flex p-1 bg-slate-100 dark:bg-slate-700 rounded-xl">
                <button
                    type="button"
                    onClick={() => setType('percentage')}
                    className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2
                        ${type === 'percentage' 
                            ? 'bg-white dark:bg-slate-600 text-amber-600 dark:text-amber-400 shadow-sm' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                >
                    <Percent size={16} />
                    ភាគរយ (%)
                </button>
                <button
                    type="button"
                    onClick={() => setType('fixed')}
                    className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2
                        ${type === 'fixed' 
                            ? 'bg-white dark:bg-slate-600 text-amber-600 dark:text-amber-400 shadow-sm' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                >
                    <DollarSign size={16} />
                    ចំនួនថេរ ($)
                </button>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                    {type === 'percentage' ? 'ចំនួនភាគរយ' : 'ចំនួនទឹកប្រាក់ ($)'}
                </label>
                <div className="relative">
                    <input 
                        type="number" 
                        min="0"
                        step={type === 'percentage' ? '1' : '0.01'}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all text-lg font-bold text-center"
                        placeholder="0"
                        autoFocus
                    />
                </div>
            </div>

            <button 
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-200 dark:shadow-amber-900/50 transition-all flex items-center justify-center gap-2"
            >
                <Check size={20} />
                អនុវត្តការបញ្ចុះតម្លៃ
            </button>
        </form>
      </div>
    </div>
  );
};
