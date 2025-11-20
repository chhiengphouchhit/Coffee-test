
import React, { useState } from 'react';
import { X, Search, UserPlus, User, Smartphone, Star, ArrowLeft, Check } from 'lucide-react';
import { Customer } from '../types';

interface CustomerModalProps {
  customers: Customer[];
  onClose: () => void;
  onSelectCustomer: (customer: Customer) => void;
  onAddCustomer: (customer: Customer) => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({ customers, onClose, onSelectCustomer, onAddCustomer }) => {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery)
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const newCustomer: Customer = {
        id: Math.random().toString(36).substring(2, 9),
        name: newName,
        phone: newPhone,
        points: 0,
        visits: 1,
        lastVisit: Date.now()
    };

    onAddCustomer(newCustomer);
    onSelectCustomer(newCustomer);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
                 {view === 'create' ? (
                    <button onClick={() => setView('list')} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full -ml-2">
                        <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
                    </button>
                 ) : (
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg text-amber-700 dark:text-amber-400">
                        <User size={24} />
                    </div>
                 )}
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                        {view === 'list' ? 'អតិថិជន (Loyalty)' : 'ចុះឈ្មោះអតិថិជនថ្មី'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        {view === 'list' ? 'ជ្រើសរើស ឬ ស្វែងរកអតិថិជន' : 'បញ្ចូលព័ត៌មានអតិថិជន'}
                    </p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
                <X size={24} />
            </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
            {view === 'list' ? (
                <>
                     {/* Search Bar */}
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="ស្វែងរកតាមឈ្មោះ ឬ លេខទូរស័ព្ទ..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                                    autoFocus
                                />
                            </div>
                            <button 
                                onClick={() => setView('create')}
                                className="px-4 bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                            >
                                <UserPlus size={18} />
                                <span className="hidden sm:inline">ថ្មី</span>
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-2">
                        {filteredCustomers.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 py-8">
                                <p>មិនមានអតិថិជនឈ្មោះ "{searchQuery}"</p>
                                <button onClick={() => setView('create')} className="text-amber-600 hover:underline mt-2">បង្កើតថ្មី?</button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredCustomers.map(customer => (
                                    <button
                                        key={customer.id}
                                        onClick={() => onSelectCustomer(customer)}
                                        className="w-full flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-700/50 hover:bg-amber-50 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700 transition-all group text-left"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-300 font-bold text-lg group-hover:bg-amber-200 group-hover:text-amber-800">
                                                {customer.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 dark:text-slate-200">{customer.name}</h4>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                    <Smartphone size={12} />
                                                    <span>{customer.phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center justify-end gap-1">
                                                <Star size={14} fill="currentColor" />
                                                {customer.points} pts
                                            </div>
                                            <span className="text-xs text-slate-400">{customer.visits} visits</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <form onSubmit={handleCreate} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">ឈ្មោះអតិថិជន</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                                placeholder="ឈ្មោះ"
                                autoFocus
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">លេខទូរស័ព្ទ</label>
                        <div className="relative">
                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="tel" 
                                value={newPhone}
                                onChange={e => setNewPhone(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                                placeholder="012 345 678"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit"
                            className="w-full py-3.5 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-200 dark:shadow-amber-900/50 transition-all flex items-center justify-center gap-2"
                        >
                            <UserPlus size={20} />
                            <span>បង្កើតអតិថិជន</span>
                        </button>
                    </div>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};
