
import React, { useState } from 'react';
import { X, Settings, Store, Printer, Moon, Sun, Globe, Save, Wifi } from 'lucide-react';
import { ShopInfo } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  shopInfo: ShopInfo;
  onUpdateShopInfo: (info: ShopInfo) => void;
}

type Tab = 'general' | 'shop' | 'hardware';

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  isDarkMode, 
  toggleDarkMode,
  shopInfo,
  onUpdateShopInfo
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  
  // Local state for Shop Info form
  const [localShopInfo, setLocalShopInfo] = useState<ShopInfo>(shopInfo);
  const [autoPrint, setAutoPrint] = useState(false);

  if (!isOpen) return null;

  const handleSaveShopInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateShopInfo(localShopInfo);
    // Optional: Show success message
  };

  const renderSidebarItem = (id: Tab, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
        activeTab === id 
          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
          : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-4xl h-[600px] rounded-2xl shadow-2xl overflow-hidden flex transition-colors">
        
        {/* Sidebar */}
        <div className="w-64 bg-slate-50 dark:bg-slate-900/50 border-r border-slate-100 dark:border-slate-700 p-4 flex flex-col">
            <div className="mb-8 px-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Settings className="text-amber-600" />
                    ការកំណត់
                </h2>
            </div>
            
            <div className="space-y-2 flex-1">
                {renderSidebarItem('general', <Globe size={18} />, 'ទូទៅ (General)')}
                {renderSidebarItem('shop', <Store size={18} />, 'ព័ត៌មានហាង (Shop)')}
                {renderSidebarItem('hardware', <Printer size={18} />, 'ឧបករណ៍ (Hardware)')}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <button onClick={onClose} className="w-full py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    បិទ
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                    {activeTab === 'general' && 'ការកំណត់ទូទៅ'}
                    {activeTab === 'shop' && 'កែប្រែព័ត៌មានហាង'}
                    {activeTab === 'hardware' && 'ការកំណត់ម៉ាស៊ីនបោះពុម្ព'}
                </h3>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400">
                    <X size={24} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
                
                {/* GENERAL TAB */}
                {activeTab === 'general' && (
                    <div className="space-y-8 max-w-lg">
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg">
                                    {isDarkMode ? <Moon size={24} /> : <Sun size={24} />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-white">Dark Mode</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Switch between light and dark themes</p>
                                </div>
                            </div>
                            <button 
                                onClick={toggleDarkMode}
                                className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${isDarkMode ? 'left-8' : 'left-1'}`}></div>
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
                                    <Globe size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-white">ភាសា / Language</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">System default language</p>
                                </div>
                            </div>
                            <select className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-white rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500">
                                <option>ខ្មែរ (Khmer)</option>
                                <option>English</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* SHOP TAB */}
                {activeTab === 'shop' && (
                    <form onSubmit={handleSaveShopInfo} className="space-y-6 max-w-lg">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">ឈ្មោះហាង (Shop Name)</label>
                            <div className="relative">
                                <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    value={localShopInfo.name}
                                    onChange={e => setLocalShopInfo({...localShopInfo, name: e.target.value})}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">អាសយដ្ឋាន (Address)</label>
                            <input 
                                type="text" 
                                value={localShopInfo.address}
                                onChange={e => setLocalShopInfo({...localShopInfo, address: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">លេខទូរស័ព្ទ (Phone)</label>
                            <input 
                                type="text" 
                                value={localShopInfo.phone}
                                onChange={e => setLocalShopInfo({...localShopInfo, phone: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Wifi Password</label>
                            <div className="relative">
                                <Wifi className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    value={localShopInfo.wifi || ''}
                                    onChange={e => setLocalShopInfo({...localShopInfo, wifi: e.target.value})}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                                    placeholder="Optional"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-lg shadow-amber-600/20 transition-all flex items-center gap-2">
                                <Save size={20} />
                                រក្សាទុកព័ត៌មាន
                            </button>
                        </div>
                    </form>
                )}

                {/* HARDWARE TAB */}
                {activeTab === 'hardware' && (
                    <div className="space-y-8 max-w-lg">
                         <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                    <Printer size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-white">Auto Print Receipt</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Print immediately after payment</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setAutoPrint(!autoPrint)}
                                className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${autoPrint ? 'bg-blue-600' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${autoPrint ? 'left-8' : 'left-1'}`}></div>
                            </button>
                        </div>

                        <div className="space-y-4 p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                             <h4 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wide">Printer Configuration</h4>
                             
                             <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500">IP Address</label>
                                    <input type="text" defaultValue="192.168.1.100" className="w-full p-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"/>
                                 </div>
                                 <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500">Paper Width</label>
                                    <select className="w-full p-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm">
                                        <option>80mm</option>
                                        <option>58mm</option>
                                    </select>
                                 </div>
                             </div>
                             
                             <button className="w-full py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                                 Test Print
                             </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
};
