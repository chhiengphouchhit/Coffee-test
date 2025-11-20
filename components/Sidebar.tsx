import React from 'react';
import { LayoutDashboard, Coffee, Settings, LogOut, Moon, Sun, User, Lock, Users, Star } from 'lucide-react';
import { AdminUser, Customer } from '../types';

interface SidebarProps {
  activeView: 'pos' | 'admin';
  onNavigate: (view: 'pos' | 'admin') => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onOpenSettings: () => void;
  currentUser: AdminUser | null;
  currentCustomer: Customer | null;
  onLogout: () => void;
  onAdminLoginRequest: () => void;
  onCustomerLoginRequest: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  onNavigate, 
  isDarkMode, 
  toggleDarkMode, 
  onOpenSettings,
  currentUser,
  currentCustomer,
  onLogout,
  onAdminLoginRequest,
  onCustomerLoginRequest
}) => {
  
  const handleAdminClick = () => {
    if (currentUser) {
      onNavigate('admin');
    } else {
      onAdminLoginRequest();
    }
  };

  const isLoggedIn = currentUser || currentCustomer;
  const isManager = currentUser?.role === 'manager';

  return (
    <div className="h-full flex flex-col shrink-0 z-50">
      <div className="h-full w-[90px] glass-panel rounded-[2rem] flex flex-col items-center py-8 shadow-2xl border border-white/10 relative overflow-hidden transition-all duration-500">
        
        {/* Logo Area */}
        <div className="mb-10 relative group cursor-pointer">
            <div className="absolute inset-0 bg-orange-500 blur-xl opacity-20 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative p-3.5 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-lg shadow-orange-500/30 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ring-1 ring-white/20">
                <Coffee className="text-white" size={26} strokeWidth={2.5} />
            </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-6 w-full px-4 flex flex-col items-center">
            <SidebarButton 
                isActive={activeView === 'pos'} 
                onClick={() => onNavigate('pos')} 
                icon={<Coffee size={24} />} 
                label="POS"
            />
            
            {(!currentCustomer || isManager) && (
                <SidebarButton 
                    isActive={activeView === 'admin'} 
                    onClick={handleAdminClick} 
                    icon={isManager ? <LayoutDashboard size={24} /> : <Lock size={24} />} 
                    label="Admin"
                />
            )}
        </nav>

        {/* Footer Actions */}
        <div className="mt-auto w-full px-4 space-y-5 flex flex-col items-center">
            {currentUser && (
              <div className="flex flex-col items-center animate-fade-in">
                 <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold text-lg shadow-lg border border-white/10 ring-2 ring-white/10">
                   {currentUser.username.charAt(0).toUpperCase()}
                 </div>
                 <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-2 opacity-80">{currentUser.role}</span>
              </div>
            )}

            {currentCustomer && (
              <div className="flex flex-col items-center animate-fade-in">
                 <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-green-500/20 border border-white/10 ring-2 ring-white/10">
                   <Star size={20} fill="currentColor" />
                 </div>
                 <span className="text-[9px] text-slate-400 font-bold text-center leading-tight px-1 truncate w-full mt-2 opacity-80 max-w-[60px]">{currentCustomer.name}</span>
              </div>
            )}

            <div className="p-1.5 bg-white/5 rounded-2xl backdrop-blur-sm w-full border border-white/5">
                <button 
                    onClick={toggleDarkMode}
                    className="w-full p-3 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-white/10 hover:text-orange-400 transition-all duration-300"
                >
                    {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
                </button>
            </div>
            
            {!currentCustomer && (
                <button 
                    onClick={onOpenSettings}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all duration-300"
                >
                    <Settings size={24} />
                </button>
            )}
            
            {isLoggedIn ? (
              <button 
                onClick={onLogout}
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-red-400 hover:bg-red-500/20 hover:text-red-500 transition-all duration-300"
                title="Logout"
              >
                  <LogOut size={24} />
              </button>
            ) : (
              <div className="space-y-3 pt-4 border-t border-white/10 w-full">
                  <button 
                    onClick={onAdminLoginRequest}
                    className="w-full flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-all group"
                  >
                    <div className="p-2 rounded-xl bg-white/5 group-hover:bg-white/10 group-hover:scale-110 transition-transform">
                        <Lock size={18} />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Staff</span>
                  </button>
                  
                  <button 
                    onClick={onCustomerLoginRequest}
                    className="w-full flex flex-col items-center gap-1 text-green-400/70 hover:text-green-400 transition-all group"
                  >
                    <div className="p-2 rounded-xl bg-green-500/10 group-hover:bg-green-500/20 group-hover:scale-110 transition-transform">
                        <User size={18} />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Guest</span>
                  </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

const SidebarButton = ({ isActive, onClick, icon, label }: { isActive: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
    <button
        onClick={onClick}
        className={`relative w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-300 group overflow-hidden
            ${isActive 
                ? 'text-white shadow-lg shadow-orange-500/25 ring-1 ring-orange-400/50' 
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
    >
        {isActive && (
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-600 animate-fade-in"></div>
        )}
        
        <div className={`relative z-10 transform transition-all duration-300 ${isActive ? 'scale-110 -translate-y-1' : 'group-hover:scale-110 group-hover:-translate-y-1'}`}>
            {icon}
        </div>
        
        {isActive && <span className="relative z-10 text-[10px] font-bold absolute bottom-2 opacity-100 animate-fade-in">{label}</span>}
    </button>
);