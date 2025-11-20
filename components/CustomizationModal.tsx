
import React, { useState } from 'react';
import { Category, Modifier, Product } from '../types';
import { MODIFIERS } from '../constants';
import { Check, X, Coffee, Croissant } from 'lucide-react';

interface CustomizationModalProps {
  product: Product;
  onClose: () => void;
  onConfirm: (modifiers: Modifier[]) => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({ product, onClose, onConfirm }) => {
  const isBakery = product.category === Category.BAKERY;
  
  // Default selections based on category
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    isBakery 
        ? new Set([]) 
        : new Set(['sz2', 'm3']) // Default Medium, Whole Milk for drinks
  );

  const toggleModifier = (id: string, type: string) => {
    const newSet = new Set(selectedIds);
    
    // Logic: If type is size or milk, we only allow one. If others, allow multiple.
    if (type === 'size' || type === 'milk') {
        // Remove other items of this type
        MODIFIERS.filter(m => m.type === type).forEach(m => newSet.delete(m.id));
        newSet.add(id);
    } else {
        // Toggle
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleConfirm = () => {
    const selectedModifiers = MODIFIERS.filter(m => selectedIds.has(m.id));
    onConfirm(selectedModifiers);
  };

  const getModifierGroup = (type: string) => MODIFIERS.filter(m => m.type === type);

  const renderGroup = (title: string, type: string) => {
    const group = getModifierGroup(type);
    if (group.length === 0) return null;

    return (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{title}</h3>
          <div className="grid grid-cols-3 gap-3">
            {group.map(mod => {
                const isSelected = selectedIds.has(mod.id);
                return (
                    <button
                        key={mod.id}
                        onClick={() => toggleModifier(mod.id, mod.type)}
                        className={`
                            relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all
                            ${isSelected 
                                ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-500 text-amber-900 dark:text-amber-300 ring-1 ring-amber-500' 
                                : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500'
                            }
                        `}
                    >
                        <span className="font-medium">{mod.name}</span>
                        {mod.price > 0 && (
                            <span className="text-xs mt-1 opacity-75">+${mod.price.toFixed(2)}</span>
                        )}
                        {isSelected && (
                            <div className="absolute top-1 right-1 text-amber-600 dark:text-amber-400">
                                <Check size={14} strokeWidth={3} />
                            </div>
                        )}
                    </button>
                );
            })}
          </div>
        </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg text-amber-700 dark:text-amber-400">
                    {isBakery ? <Croissant size={24} /> : <Coffee size={24} />}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">កែប្រែ {product.name}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        {isBakery ? "ជ្រើសរើសជម្រើសនៃការរៀបចំ" : "ជ្រើសរើសទំហំ និងការបន្ថែម"}
                    </p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400">
                <X size={24} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
            {isBakery ? (
                <>
                    {renderGroup("ការរៀបចំ", "preparation")}
                </>
            ) : (
                <>
                    {renderGroup("ទំហំ", "size")}
                    {renderGroup("ជម្រើសទឹកដោះគោ", "milk")}
                    {renderGroup("ស៊ីរ៉ូ & រសជាតិ", "syrup")}
                    {renderGroup("កម្រិតកាហ្វេ", "shot")}
                </>
            )}
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-6 py-3 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
                បោះបង់
            </button>
            <button 
                onClick={handleConfirm}
                className="px-8 py-3 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-200 dark:shadow-amber-900/50 transition-colors flex items-center gap-2"
            >
                បញ្ចូលទៅការកម្ម៉ង់
            </button>
        </div>
      </div>
    </div>
  );
};