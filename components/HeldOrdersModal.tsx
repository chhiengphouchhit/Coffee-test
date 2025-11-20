
import React from 'react';
import { HeldOrder } from '../types';
import { X, Clock, ArrowRight, Trash2, ShoppingBag, PauseCircle } from 'lucide-react';

interface HeldOrdersModalProps {
  heldOrders: HeldOrder[];
  onClose: () => void;
  onResume: (order: HeldOrder) => void;
  onDelete: (orderId: string) => void;
}

export const HeldOrdersModal: React.FC<HeldOrdersModalProps> = ({ heldOrders, onClose, onResume, onDelete }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-700 dark:text-blue-400">
                    <Clock size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">ការកម្ម៉ង់ដែលទុក</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        {heldOrders.length} orders currently on hold
                    </p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
                <X size={24} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900/30">
            {heldOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-500">
                    <ShoppingBag size={48} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium">មិនមានការកម្ម៉ង់ដែលទុក</p>
                    <p className="text-sm">ការកម្ម៉ង់ដែលទុកនឹងបង្ហាញនៅទីនេះ</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {heldOrders.map(order => (
                        <div key={order.id} className="bg-white dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono font-bold text-slate-700 dark:text-slate-200">#{order.id}</span>
                                        
                                        {/* Status Tag: ON HOLD */}
                                        <span className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full font-bold uppercase tracking-wider border border-orange-200 dark:border-orange-800">
                                            <PauseCircle size={10} className="stroke-[3px]" />
                                            ON HOLD
                                        </span>

                                        <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-600 text-slate-500 dark:text-slate-300 rounded-full flex items-center gap-1">
                                            <Clock size={10} />
                                            {new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {order.items.length} items • Total: <span className="font-bold text-slate-900 dark:text-white">${order.total.toFixed(2)}</span>
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => onDelete(order.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="លុបការកម្ម៉ង់"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                {order.items.slice(0, 3).map((item, idx) => (
                                    <div key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex justify-between">
                                        <span>{item.name}</span>
                                    </div>
                                ))}
                                {order.items.length > 3 && (
                                    <div className="text-xs text-slate-400 italic">
                                        + {order.items.length - 3} more items...
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={() => onResume(order)}
                                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                            >
                                បន្តការកម្ម៉ង់
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
