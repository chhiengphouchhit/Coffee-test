
import React, { useRef } from 'react';
import { CartItem, Discount, PaymentDetails, ShopInfo } from '../types';
import { Printer, Check, Wifi } from 'lucide-react';

interface ReceiptModalProps {
  items: CartItem[];
  onClose: () => void;
  discount: Discount;
  paymentDetails: PaymentDetails | null;
  shopInfo: ShopInfo;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ items, onClose, discount, paymentDetails, shopInfo }) => {
  // Calculate totals
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
  
  // Generate static order details for this session
  const orderId = useRef(Math.floor(Math.random() * 90000) + 10000);
  const date = useRef(new Date().toLocaleString('en-US', { 
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="flex flex-col items-center gap-6 max-h-[90vh]">
        
        {/* Receipt Paper - Always White (Realism) */}
        <div className="bg-white w-80 sm:w-96 shadow-2xl overflow-hidden relative flex flex-col max-h-full">
            
            {/* Receipt content */}
            <div className="p-6 pt-8 flex-1 overflow-y-auto custom-scrollbar bg-white text-slate-900">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-wider uppercase mb-1">{shopInfo.name}</h1>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Premium Coffee & Bakery</p>
                    <div className="mt-4 text-xs font-mono text-slate-600 space-y-1">
                        <p>{shopInfo.address}</p>
                        <p>{shopInfo.phone}</p>
                        {shopInfo.wifi && (
                             <p className="flex items-center justify-center gap-1 mt-1">
                                <Wifi size={10}/> {shopInfo.wifi}
                             </p>
                        )}
                    </div>
                </div>

                <div className="border-t border-b border-dashed border-slate-300 py-3 mb-4 text-xs font-mono text-slate-600">
                    <div className="flex justify-between mb-1">
                        <span>លេខរៀង #:</span>
                        <span className="font-bold text-slate-900">{orderId.current}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>កាលបរិច្ឆេទ:</span>
                        <span>{date.current}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span>អ្នកគិតលុយ:</span>
                        <span>Alex D.</span>
                    </div>
                </div>

                {/* Items List */}
                <div className="space-y-3 mb-6 min-h-[100px]">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2">
                        <span>QTY ITEM</span>
                        <span>AMT</span>
                    </div>
                    {items.map((item, idx) => (
                        <div key={`${item.cartItemId}-${idx}`} className="text-xs font-mono">
                            <div className="flex justify-between items-start text-slate-800 font-bold mb-0.5">
                                <div className="flex gap-2">
                                    <span>1</span>
                                    <span>{item.name}</span>
                                </div>
                                <span>${(item.price + item.selectedModifiers.reduce((a, b) => a + b.price, 0)).toFixed(2)}</span>
                            </div>
                            {/* Modifiers */}
                            {item.selectedModifiers.map(mod => (
                                <div key={mod.id} className="flex justify-between pl-4 text-slate-500 text-[10px] mb-0.5">
                                    <span>+ {mod.name}</span>
                                    {mod.price > 0 && <span>{mod.price.toFixed(2)}</span>}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="border-t-2 border-slate-800 pt-4 space-y-2 font-mono text-xs text-slate-700">
                    <div className="flex justify-between">
                        <span>សរុប</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    {discount.value > 0 && (
                        <div className="flex justify-between text-slate-900 font-bold">
                            <span>ការបញ្ចុះតម្លៃ ({discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`})</span>
                            <span>-${discountAmount.toFixed(2)}</span>
                        </div>
                    )}

                    <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 mt-2 border-t border-dashed border-slate-300">
                        <span>សរុបទាំងអស់</span>
                        <span>${total.toFixed(2)}</span>
                    </div>

                    {paymentDetails && (
                        <div className="pt-4 space-y-2">
                             <div className="flex justify-between text-slate-500">
                                <span>ប្រាក់ទទួល ($)</span>
                                <span>${paymentDetails.receivedUSD.toFixed(2)}</span>
                            </div>
                            {paymentDetails.receivedKHR > 0 && (
                                <div className="flex justify-between text-slate-500">
                                    <span>ប្រាក់ទទួល (៛)</span>
                                    <span>៛ {paymentDetails.receivedKHR.toLocaleString()}</span>
                                </div>
                            )}
                            
                            <div className="border-t border-dashed border-slate-300 my-2"></div>

                            <div className="flex justify-between text-slate-900 font-bold">
                                <span>ប្រាក់អាប់ ($)</span>
                                <span>${paymentDetails.changeUSD.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-900 font-bold">
                                <span>ប្រាក់អាប់ (៛)</span>
                                <span>៛ {paymentDetails.changeKHR.toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center space-y-2">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">
                        អរគុណសម្រាប់ការគាំទ្រ!
                    </div>
                    <div className="flex justify-center pt-2 opacity-50">
                        {/* Barcode Simulation */}
                        <div className="h-8 flex items-end gap-0.5">
                            {[...Array(40)].map((_, i) => (
                                <div key={i} className={`w-0.5 bg-slate-900 h-${Math.random() > 0.5 ? 'full' : '1/2'}`}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Bottom jagged edge effect using gradient */}
            <div className="h-4 w-full relative bg-white" 
                 style={{
                   backgroundImage: 'linear-gradient(45deg, transparent 33.333%, #ffffff 33.333%, #ffffff 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, #ffffff 33.333%, #ffffff 66.667%, transparent 66.667%)',
                   backgroundSize: '10px 20px',
                   backgroundPosition: '0 10px',
                   backgroundRepeat: 'repeat-x',
                   marginTop: '-10px'
                 }}>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
             <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-transform active:scale-95"
            >
                <Printer size={20} />
                <span>បោះពុម្ពវិក្កយបត្រ</span>
            </button>
            <button 
                onClick={onClose}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 text-white font-bold shadow-lg shadow-amber-600/30 dark:shadow-amber-900/50 hover:bg-amber-700 transition-transform active:scale-95"
            >
                <Check size={20} />
                <span>ការកម្ម៉ង់ថ្មី</span>
            </button>
        </div>
      </div>
    </div>
  );
};
