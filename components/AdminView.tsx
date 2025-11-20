
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { MOCK_SALES_DATA, TOP_SELLING_ITEMS } from '../constants';
import { TrendingUp, DollarSign, ShoppingBag, AlertCircle, Download, Search } from 'lucide-react';

interface AdminViewProps {
  isDarkMode: boolean;
}

export const AdminView: React.FC<AdminViewProps> = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = TOP_SELLING_ITEMS.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate totals dynamically from the sales data
  const stats = useMemo(() => {
    return MOCK_SALES_DATA.reduce((acc, curr) => ({
      sales: acc.sales + curr.sales,
      orders: acc.orders + curr.orders
    }), { sales: 0, orders: 0 });
  }, []);

  const chartTextColor = isDarkMode ? '#94a3b8' : '#64748b'; // slate-400 vs slate-500
  const chartLineColor = isDarkMode ? '#f1f5f9' : '#0f172a'; // slate-100 vs slate-900
  const chartGridColor = isDarkMode ? '#334155' : '#e2e8f0'; // slate-700 vs slate-200
  const tooltipBg = isDarkMode ? '#1e293b' : '#ffffff'; // slate-800 vs white
  const tooltipText = isDarkMode ? '#f1f5f9' : '#0f172a';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8 overflow-y-auto transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">ផ្ទាំងគ្រប់គ្រង</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">ទិដ្ឋភាពទូទៅនៃដំណើរការហាង • ថ្ងៃនេះ</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <Download size={16} />
                ទាញយករបាយការណ៍
            </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
                        <DollarSign size={24} />
                    </div>
                    <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">+12% vs last week</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">ការលក់សរុប</p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">${stats.sales.toFixed(2)}</h3>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                        <ShoppingBag size={24} />
                    </div>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">+5% vs last week</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">ការកម្ម៉ង់សរុប</p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats.orders}</h3>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
                        <AlertCircle size={24} />
                    </div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded">Needs Attention</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">ការជូនដំណឹងពីស្តុកទាប</p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">3 Items</h3>
            </div>
        </div>

        {/* Charts Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Chart - Hourly Sales */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">ដំណើរការលក់តាមម៉ោង</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={MOCK_SALES_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: chartTextColor, fontSize: 12}} dy={10}/>
                            <YAxis axisLine={false} tickLine={false} tick={{fill: chartTextColor, fontSize: 12}} />
                            <Tooltip 
                                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: tooltipBg, color: tooltipText}}
                                itemStyle={{ color: tooltipText }}
                                cursor={{stroke: '#cbd5e1'}}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="sales" 
                                stroke={chartLineColor} 
                                strokeWidth={3} 
                                dot={{r: 4, fill: chartLineColor}}
                                activeDot={{r: 6, fill: '#d97706'}} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Products */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col transition-colors">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">ទំនិញលក់ដាច់បំផុត</h3>
                
                {/* Search Filter */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="ត្រងទំនិញ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-500 focus:bg-white dark:focus:bg-slate-600 transition-all"
                    />
                </div>

                <div className="space-y-6 flex-1">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/50 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                                        {idx + 1}
                                    </div>
                                    <span className="font-medium text-slate-700 dark:text-slate-200">{item.name}</span>
                                </div>
                                <span className="font-mono font-bold text-slate-900 dark:text-white">{item.quantity}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-slate-400 text-sm">
                            មិនមានទំនិញ "{searchTerm}"
                        </div>
                    )}
                </div>
                
                <button className="w-full mt-8 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shrink-0">
                    មើលរបាយការណ៍ស្តុកពេញ
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
