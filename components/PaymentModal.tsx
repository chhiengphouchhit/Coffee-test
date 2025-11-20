
import React, { useState, useEffect } from 'react';
import { CartItem, Discount, PaymentDetails } from '../types';
import { EXCHANGE_RATE } from '../constants';
import { X, DollarSign, Calculator, ArrowRight } from 'lucide-react';

interface PaymentModalProps {
  items: CartItem[];
  discount: Discount;
  onClose: () => void;
  onConfirm: (details: PaymentDetails) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ items, discount, onClose, onConfirm }) => {
  // Calculate Total
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

  const totalUSD = subtotal - discountAmount;
  const totalKHR = Math.ceil((totalUSD * EXCHANGE_RATE) / 100) * 100; // Round to nearest 100 Riel

  // Input States
  const [receivedUSD, setReceivedUSD] = useState('');
  const [receivedKHR, setReceivedKHR] = useState('');

  // Calculated States
  const [changeUSD, setChangeUSD] = useState(0);
  const [changeKHR, setChangeKHR] = useState(0);
  const [remainingUSD, setRemainingUSD] = useState(0);

  useEffect(() => {
    const usdIn = parseFloat(receivedUSD) || 0;
    const khrIn = parseFloat(receivedKHR) || 0;
    
    // Convert all to USD for calculation
    const totalReceivedInUSD = usdIn + (khrIn / EXCHANGE_RATE);
    const diff = totalReceivedInUSD - totalUSD;

    if (diff >= -0.001) { // Floating point tolerance
      setChangeUSD(diff);
      setChangeKHR(Math.round(diff * EXCHANGE_RATE));
      setRemainingUSD(0);
    } else {
      setChangeUSD(0);
      setChangeKHR(0);
      setRemainingUSD(Math.abs(diff));
    }
  }, [receivedUSD, receivedKHR, totalUSD]);

  const handleConfirm = () => {
    if (remainingUSD > 0.001) return;

    onConfirm({
      receivedUSD: parseFloat(receivedUSD) || 0,
      receivedKHR: parseFloat(receivedKHR) || 0,
      changeUSD,
      changeKHR
    });
  };

  const handleQuickAmount = (amount: number, currency: 'USD' | 'KHR') => {
    if (currency === 'USD') {
        setReceivedUSD(amount.toString());
    } else {
        setReceivedKHR(amount.toString());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-colors">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg text-green-700 dark:text-green-400">
                    <DollarSign size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">ការទូទាត់ / Payment</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Exchange Rate: $1 = ៛{EXCHANGE_RATE.toLocaleString()}
                    </p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
                <X size={24} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto">
            {/* Total Display */}
            <div className="bg-slate-900 text-white p-8 text-center">
                <div className="text-sm font-medium text-slate-400 mb-1 uppercase tracking-widest">Total Due</div>
                <div className="text-5xl font-bold mb-2">${totalUSD.toFixed(2)}</div>
                <div className="text-2xl font-mono text-amber-400">៛ {totalKHR.toLocaleString()}</div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            Received USD ($)
                        </label>
                        <div className="relative">
                            <input 
                                type="number" 
                                step="0.01"
                                value={receivedUSD}
                                onChange={(e) => setReceivedUSD(e.target.value)}
                                className="w-full pl-4 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-600 text-2xl font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                placeholder="0.00"
                                autoFocus
                            />
                        </div>
                        <div className="flex gap-2 mt-2">
                            {[1, 5, 10, 20, 50, 100].map(amt => (
                                <button 
                                    key={amt}
                                    onClick={() => handleQuickAmount(amt, 'USD')}
                                    className="px-2 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-xs font-bold text-slate-600 dark:text-slate-300"
                                >
                                    ${amt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            Received Riel (៛)
                        </label>
                        <div className="relative">
                            <input 
                                type="number" 
                                step="100"
                                value={receivedKHR}
                                onChange={(e) => setReceivedKHR(e.target.value)}
                                className="w-full pl-4 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-600 text-2xl font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                placeholder="0"
                            />
                        </div>
                        <div className="flex gap-2 mt-2 flex-wrap">
                            {[1000, 5000, 10000, 20000, 50000].map(amt => (
                                <button 
                                    key={amt}
                                    onClick={() => handleQuickAmount(amt, 'KHR')}
                                    className="px-2 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-xs font-bold text-slate-600 dark:text-slate-300"
                                >
                                    {(amt / 1000)}k
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Result */}
                <div className="bg-slate-50 dark:bg-slate-700/30 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 flex flex-col justify-center">
                    {remainingUSD > 0.001 ? (
                        <div className="text-center text-red-500">
                            <div className="text-sm font-bold uppercase mb-1">Remaining Amount</div>
                            <div className="text-4xl font-bold">${remainingUSD.toFixed(2)}</div>
                            <div className="text-xl mt-2 opacity-75">
                                ៛ {(remainingUSD * EXCHANGE_RATE).toLocaleString()}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-green-600 dark:text-green-400">
                            <div className="text-sm font-bold uppercase mb-1">Change Due</div>
                            <div className="text-4xl font-bold mb-4">${changeUSD.toFixed(2)}</div>
                            <div className="border-t border-slate-200 dark:border-slate-600 my-4"></div>
                            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                                ៛ {changeKHR.toLocaleString()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex gap-4">
            <button 
                onClick={onClose}
                className="flex-1 py-4 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
                បោះបង់
            </button>
            <button 
                onClick={handleConfirm}
                disabled={remainingUSD > 0.001}
                className="flex-[2] py-4 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg shadow-green-200 dark:shadow-green-900/50 transition-all flex items-center justify-center gap-2"
            >
                <span>បញ្ជាក់ការទូទាត់</span>
                <ArrowRight size={20} />
            </button>
        </div>

      </div>
    </div>
  );
};
