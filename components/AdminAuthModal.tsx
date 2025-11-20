
import React, { useState } from 'react';
import { X, Lock, User, UserPlus, LogIn, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { AdminUser } from '../types';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: AdminUser) => void;
  onRegister: (user: AdminUser) => void;
  users: AdminUser[];
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose, onLogin, onRegister, users }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');

  // Login State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPin, setLoginPin] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPin, setRegPin] = useState('');
  const [regRole, setRegRole] = useState<'manager' | 'staff'>('manager');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === loginUsername && u.pin === loginPin);
    
    if (user) {
      onLogin(user);
      resetForm();
    } else {
      setError('ឈ្មោះអ្នកប្រើប្រាស់ ឬ លេខសម្ងាត់មិនត្រឹមត្រូវ');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (users.some(u => u.username === regUsername)) {
      setError('ឈ្មោះអ្នកប្រើប្រាស់មានរួចហើយ');
      return;
    }
    if (regPin.length < 4) {
        setError('លេខសម្ងាត់ត្រូវតែមានយ៉ាងតិច ៤ ខ្ទង់');
        return;
    }

    const newUser: AdminUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: regName,
      username: regUsername,
      pin: regPin,
      role: regRole
    };

    onRegister(newUser);
    // Auto login after register
    onLogin(newUser); 
    resetForm();
  };

  const resetForm = () => {
    setLoginUsername('');
    setLoginPin('');
    setRegName('');
    setRegUsername('');
    setRegPin('');
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
                    <ShieldCheck size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                        {mode === 'login' ? 'ចូលគណនីអ្នកគ្រប់គ្រង' : 'ចុះឈ្មោះអ្នកគ្រប់គ្រង'}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">POS Security Access</p>
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
                <LogIn size={16} /> Login
            </button>
            <button 
                onClick={() => { setMode('register'); setError(''); }}
                className={`flex-1 py-3 text-sm font-bold transition-colors flex items-center justify-center gap-2 ${mode === 'register' ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50/50 dark:bg-amber-900/10' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
            >
                <UserPlus size={16} /> Register
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
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                value={loginUsername}
                                onChange={e => setLoginUsername(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                                placeholder="Enter username"
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">PIN Code</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type={showPin ? "text" : "password"}
                                value={loginPin}
                                onChange={e => setLoginPin(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-mono"
                                placeholder="****"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPin(!showPin)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
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
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                        <input 
                            type="text" 
                            value={regName}
                            onChange={e => setRegName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Username</label>
                            <input 
                                type="text" 
                                value={regUsername}
                                onChange={e => setRegUsername(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                                placeholder="admin"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">PIN</label>
                            <input 
                                type="password" 
                                value={regPin}
                                onChange={e => setRegPin(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-mono"
                                placeholder="****"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                         <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Role</label>
                         <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setRegRole('manager')}
                                className={`flex-1 py-2 rounded-lg border ${regRole === 'manager' ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-500 text-amber-700 dark:text-amber-400' : 'border-slate-200 dark:border-slate-600 text-slate-500'}`}
                            >
                                Manager
                            </button>
                            <button
                                type="button"
                                onClick={() => setRegRole('staff')}
                                className={`flex-1 py-2 rounded-lg border ${regRole === 'staff' ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-500 text-amber-700 dark:text-amber-400' : 'border-slate-200 dark:border-slate-600 text-slate-500'}`}
                            >
                                Staff
                            </button>
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
