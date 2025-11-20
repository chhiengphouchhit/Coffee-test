
import React from 'react';
import { CheckCircle, ArrowLeft } from 'lucide-react';

interface OrderSuccessModalProps {
  onClose: () => void;
  orderNumber: string;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ onClose, orderNumber }) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-6 animate-in fade-in zoom-in duration-300">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center text-center p-8">
        
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-6 animate-bounce">
            <CheckCircle size={48} strokeWidth={3} />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
            ការកម្ម៉ង់ទទួលបានជោគជ័យ!
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
            Order placed successfully
        </p>

        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6 w-full mb-8 border border-slate-100 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">លេខរៀងរបស់អ្នក / YOUR ORDER #</p>
            <div className="text-5xl font-black text-slate-900 dark:text-white font-mono">
                {orderNumber}
            </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 mb-8">
            សូមរង់ចាំនៅកន្លែងទទួលការកម្ម៉ង់។ បុគ្គលិករបស់យើងនឹងហៅលេខរបស់អ្នកនៅពេលរួចរាល់។
            <br/>
            <span className="opacity-75 text-xs block mt-2">Please wait at the counter. We will call your number when ready.</span>
        </p>

        <button 
            onClick={onClose}
            className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-lg shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
        >
            <ArrowLeft size={20} />
            ត្រឡប់ទៅទំព័រដើម
        </button>

      </div>
    </div>
  );
};
