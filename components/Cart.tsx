import React, { useState } from 'react';
import { CartItem, Discount, Customer } from '../types';
import { Trash2, User, PauseCircle, Tag, Send, ShoppingBag, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { DiscountModal } from './DiscountModal';

interface CartProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onCheckout: () => void;
  onHold: () => void;
  discount: Discount;
  onSetDiscount: (discount: Discount) => void;
  userRole: 'manager' | 'staff' | 'customer';
  currentCustomer: Customer | null;
}

export const Cart: React.FC<CartProps> = ({ items, onRemove, onCheckout, onHold, discount, onSetDiscount, userRole, currentCustomer }) => {
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const isCustomerMode = userRole === 'customer';

  const subtotal = items.reduce((sum, item) => {
    const modsPrice = item.selectedModifiers.reduce((mSum, mod) => mSum + mod.price, 0);
    return sum + item.price + modsPrice;
  }, 0);

  let discountAmount = 0;
  if (discount.type === 'percentage') {
    discountAmount = subtotal * (discount.value / 100);
  } else {
    discountAmount = discount.value;
  }
  discountAmount = Math.min(discountAmount, subtotal);

  const total = subtotal - discountAmount;

  return (
    <div className="flex flex-col h-full glass-panel rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 relative">
      
      {/* Header */}
      <div className="p-8 pb-4 z-10 relative">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white to-slate-200 flex items-center justify-center text-black shadow-lg">
                    <ShoppingBag size={20} strokeWidth={2.5} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-white tracking-tight leading-none">Current Order</h2>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Order #{(Math.random() * 1000).toFixed(0)}
                    </span>
                </div>
            </div>
            <div className="px-4 py-1.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/20 shadow-inner">
                {items.length} Items
            </div>
        </div>

        {/* Customer Selector Card */}
        {!isCustomerMode ? (
          <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl text-sm font-bold text-slate-300 hover:bg-white/10 transition-all group hover:shadow-lg hover:border-orange-500/30">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-orange-500 transition-all duration-300">
                    <User size={18} />
                 </div>
                 <div className="text-left">
                     <span className="block text-xs text-slate-500 uppercase tracking-wider mb-0.5">Customer</span>
                     <span className="block text-base">{currentCustomer ? currentCustomer.name : 'Guest Customer'}</span>
                 </div>
              </div>
              <ChevronDown size={16} className="text-slate-500 group-hover:text-orange-400 transition-colors"/>
          </button>
        ) : (
            currentCustomer && (
                <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-white flex items-center justify-center font-bold shadow-lg shadow-green-500/30 text-lg">
                        {currentCustomer.name.charAt(0)}
                    </div>
                    <div>
                        <div className="text-base font-bold text-white flex items-center gap-2">
                            {currentCustomer.name}
                            <Sparkles size={14} className="text-amber-500" fill="currentColor"/>
                        </div>
                        <div className="text-xs font-bold text-green-400 bg-green-900/40 px-2 py-0.5 rounded-full inline-block mt-1 border border-green-800">
                            {currentCustomer.points} Loyalty Points
                        </div>
                    </div>
                </div>
            )
        )}
      </div>

      {/* Scrollable Items List */}
      <div className="flex-1 overflow-y-auto px-6 py-2 space-y-3 custom-scrollbar">
        {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/5">
                    <ShoppingBag size={32} className="opacity-40" />
                </div>
                <p className="font-bold text-lg">Basket is empty</p>
                <p className="text-xs mt-1 max-w-[180px] text-center">Start adding products from the menu to the left</p>
            </div>
        ) : (
            items.map((item, idx) => (
            <div 
                key={item.cartItemId} 
                className="relative group flex flex-col p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-orange-500/5 hover:border-orange-500/20 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
            >
                <div className="flex justify-between items-start">
                    <div className="pr-8">
                        <h4 className="font-bold text-slate-100 text-base group-hover:text-white transition-colors">{item.name}</h4>
                        <div className="text-[11px] text-slate-400 mt-2 flex flex-wrap gap-1.5">
                            {item.selectedModifiers.map(mod => (
                                <span key={mod.id} className="px-2 py-1 rounded-md bg-white/5 border border-white/5 font-medium text-slate-300">
                                    {mod.name}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                         <span className="font-black text-lg text-white group-hover:text-orange-400 transition-colors">
                            ${(item.price + item.selectedModifiers.reduce((a, b) => a + b.price, 0)).toFixed(2)}
                        </span>
                    </div>
                </div>
                
                <button 
                    onClick={() => onRemove(item.cartItemId)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                >
                    <Trash2 size={16} />
                </button>
            </div>
            ))
        )}
      </div>

      {/* Footer / Totals */}
      <div className="p-8 bg-slate-900/80 backdrop-blur-2xl border-t border-white/5 z-20 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        <div className="space-y-3 mb-8">
            <div className="flex justify-between text-sm font-semibold text-slate-400">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm font-semibold text-orange-400">
                {isCustomerMode ? (
                    <div className="flex items-center gap-2">
                         <div className="p-1 bg-orange-900/30 rounded">
                             <Tag size={12} />
                         </div>
                         <span>Discount</span>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsDiscountModalOpen(true)}
                        className="flex items-center gap-2 hover:bg-orange-900/20 px-2 -ml-2 py-1 rounded-lg transition-colors group"
                    >
                         <div className="p-1 bg-orange-900/30 rounded text-orange-500 group-hover:text-orange-400">
                             <Tag size={12} />
                         </div>
                        <span className="underline decoration-dotted group-hover:text-orange-300">Discount {discount.value > 0 ? `(${discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`})` : ''}</span>
                    </button>
                )}
                <span>-${discountAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-end pt-5 border-t border-dashed border-slate-700/50">
                <span className="text-slate-400 font-black text-xs uppercase tracking-widest">Total Amount</span>
                <span className="text-4xl font-black text-white tracking-tighter leading-none">${total.toFixed(2)}</span>
            </div>
        </div>
        
        <div className="flex gap-4 h-16">
            {!isCustomerMode && (
                <button
                    disabled={items.length === 0}
                    onClick={onHold}
                    className="aspect-square h-full rounded-2xl bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-lg border border-white/5"
                    title="Hold Order"
                >
                    <PauseCircle size={26} />
                </button>
            )}
            <button 
                disabled={items.length === 0}
                onClick={onCheckout}
                className={`flex-1 rounded-2xl font-bold text-xl text-white shadow-xl shadow-orange-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none
                    ${isCustomerMode 
                        ? 'bg-gradient-to-r from-slate-700 to-slate-600' 
                        : 'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400'
                    }
                `}
            >
                {/* Shiny glass effect on button */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
                
                {isCustomerMode ? (
                    <>
                        <span>Place Order</span>
                        <Send size={22} className="group-hover:translate-x-1 transition-transform"/>
                    </>
                ) : (
                    <>
                        <span>Checkout</span>
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform"/>
                    </>
                )}
            </button>
        </div>
      </div>

      {isDiscountModalOpen && !isCustomerMode && (
        <DiscountModal
            initialDiscount={discount}
            onApply={onSetDiscount}
            onClose={() => setIsDiscountModalOpen(false)}
        />
      )}
    </div>
  );
};