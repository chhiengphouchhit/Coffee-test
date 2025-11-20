
import React, { useState } from 'react';
import { X, User, Smartphone, UserPlus, LogIn, Star } from 'lucide-react';
import { Customer } from '../types';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (customer: Customer) => void;
  onRegister: (customer: Customer) => void;
  customers: Customer[];
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({ isOpen, onClose, onLogin, onRegister, customers }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');

  // Login State
  const [loginPhone, setLoginPhone] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.phone === loginPhone);
    
    if (customer) {
      onLogin(customer);
      resetForm();
    } else {
      setError('រកមិនឃើញលេខទូរស័ព្ទនេះទេ។ សូមចុះឈ្មោះ។');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (customers.some(c => c.phone === regPhone)) {
      setError('លេខទូរស័ព្ទនេះត្រូវបានប្រើរួចហើយ');
      return;
    }

    const newCustomer: Customer = {
      id: Math.random().toString(36).substring(2, 9),
      name: regName,
      phone: regPhone,
      points: 0,
      visits: 1,
      lastVisit: Date.now()
    };

    onRegister(newCustomer);
    onLogin(newCustomer); 
    resetForm();
  };

  const resetForm = () => {
    setLoginPhone('');
    setRegName('');
    setRegPhone('');
    setError('');
    setMode('login');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-colors">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg text-amber-700 dark:text-amber-400">
                    <Star size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                        {mode === 'login' ? 'អតិថិជនចូលប្រព័ន្ធ' : 'ចុះឈ្មោះអតិថិជន'}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Customer Loyalty Access</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-700">
            <button 
                onClick={() => { setMode('login'); setError(''); }}
                className={`flex-1 py-3 text-sm font-bold transition-colors flex items-center justify-center gap-2 ${mode === 'login' ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50/50 dark:bg-amber-900/10' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
            >
                <LogIn size={16} /> ចូលប្រព័ន្ធ
            </button>
            <button 
                onClick={() => { setMode('register'); setError(''); }}
                className={`flex-1 py-3 text-sm font-bold transition-colors flex items-center justify-center gap-2 ${mode === 'register' ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50/50 dark:bg-amber-900/10' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
            >
                <UserPlus size={16} /> ចុះឈ្មោះ
            </button>
        </div>

        <div className="p-6">
            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                    <span className="font-bold">Error:</span> {error}
                </div>
            )}

            {mode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">លេខទូរស័ព្ទ</label>
                        <div className="relative">
                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="tel" 
                                value={loginPhone}
                                onChange={e => setLoginPhone(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                                placeholder="012 345 678"
                                autoFocus
                            />
                        </div>
                    </div>
                    <button 
                        type="submit"
                        className="w-full py-3 mt-2 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-200 dark:shadow-amber-900/50 transition-all"
                    >
                        ចូលប្រព័ន្ធ / Login
                    </button>
                </form>
            ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                     <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">ឈ្មោះ</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                value={regName}
                                onChange={e => setRegName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                                placeholder="ឈ្មោះរបស់អ្នក"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">លេខទូរស័ព្ទ</label>
                        <div className="relative">
                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="tel" 
                                value={regPhone}
                                onChange={e => setRegPhone(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                                placeholder="012 345 678"
                                required
                            />
                        </div>
                    </div>
                    <button 
                        type="submit"
                        className="w-full py-3 mt-2 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-200 dark:shadow-amber-900/50 transition-all"
                    >
                        បង្កើតគណនី / Register
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};
