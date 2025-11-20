
import React from 'react';
import { HeldOrder } from '../types';
import { X, Bell, ArrowRight, ShoppingBag, Radio, User } from 'lucide-react';

interface IncomingOrdersModalProps {
  orders: HeldOrder[];
  onClose: () => void;
  onProcess: (order: HeldOrder) => void;
}

export const IncomingOrdersModal: React.FC<IncomingOrdersModalProps> = ({ orders, onClose, onProcess }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg text-amber-700 dark:text-amber-400 animate-pulse">
                    <Bell size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">ការកម្ម៉ង់ថ្មីពីអតិថិជន</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        {orders.length} incoming orders
                    </p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
                <X size={24} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900/30">
            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-500">
                    <ShoppingBag size={48} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium">មិនមានការកម្ម៉ង់ថ្មីទេ</p>
                    <p className="text-sm">ការកម្ម៉ង់ពីអតិថិជននឹងបង្ហាញនៅទីនេះ</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-amber-500">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono font-bold text-slate-700 dark:text-slate-200">Order #{order.id}</span>
                                        
                                        {/* Status Tag: INCOMING */}
                                        <span className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-bold uppercase tracking-wider border border-green-200 dark:border-green-800 animate-pulse">
                                            <Radio size={10} className="stroke-[3px]" />
                                            INCOMING
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                         <span className="font-bold flex items-center gap-1">
                                            <User size={14} />
                                            {order.customerName || 'Guest'}
                                         </span>
                                         <span className="text-slate-400">•</span>
                                         <span>{new Date(order.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-slate-900 dark:text-white">${order.total.toFixed(2)}</div>
                                    <div className="text-xs text-slate-500">{order.items.length} items</div>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="text-sm text-slate-700 dark:text-slate-200 flex justify-between">
                                        <div className="flex gap-2">
                                            <span className="font-mono text-slate-400">1x</span>
                                            <span>{item.name}</span>
                                        </div>
                                        {item.selectedModifiers.length > 0 && (
                                            <span className="text-xs text-slate-400 italic">
                                                ({item.selectedModifiers.map(m => m.name).join(', ')})
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={() => onProcess(order)}
                                className="w-full py-3 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                            >
                                <span>ទទួលយក និង គិតលុយ</span>
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
