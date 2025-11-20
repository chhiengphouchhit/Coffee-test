import React, { useState, useEffect } from 'react';
import { POSView } from './POSView';
import { AdminView } from './AdminView';
import { Sidebar } from './Sidebar';
import { SettingsModal } from './SettingsModal';
import { AdminAuthModal } from './AdminAuthModal';
import { CustomerAuthModal } from './CustomerAuthModal';
import { AdminUser, Customer, ShopInfo, HeldOrder } from '../types';
import { MOCK_CUSTOMERS } from '../constants';

// Mock Initial Admins (Fallback if storage is empty)
const INITIAL_ADMINS: AdminUser[] = [
  { id: '1', username: 'admin', name: 'Super Admin', pin: '1234', role: 'manager' },
  { id: '2', username: 'staff', name: 'Staff Member', pin: '0000', role: 'staff' }
];

const App: React.FC = () => {
  // --- PERSISTENCE & STATE INITIALIZATION ---

  // 1. Theme Persistence (Default to dark for this specific design request)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pos_theme');
      return saved ? saved === 'dark' : true; 
    }
    return true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pos_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pos_theme', 'light');
    }
  }, [isDarkMode]);

  // 2. Shop Info Persistence
  const [shopInfo, setShopInfo] = useState<ShopInfo>(() => {
    try {
      const saved = localStorage.getItem('pos_shop_info');
      return saved ? JSON.parse(saved) : {
        name: 'NEAKMADAY',
        address: '1234 Espresso Lane, Phnom Penh',
        phone: '(855) 012-345-678',
        wifi: 'coffee123'
      };
    } catch {
      return {
        name: 'NEAKMADAY',
        address: '1234 Espresso Lane, Phnom Penh',
        phone: '(855) 012-345-678',
        wifi: 'coffee123'
      };
    }
  });

  useEffect(() => {
    localStorage.setItem('pos_shop_info', JSON.stringify(shopInfo));
  }, [shopInfo]);

  // 3. Admin Users Persistence
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem('pos_users_admin');
      return saved ? JSON.parse(saved) : INITIAL_ADMINS;
    } catch { return INITIAL_ADMINS; }
  });

  useEffect(() => {
    localStorage.setItem('pos_users_admin', JSON.stringify(adminUsers));
  }, [adminUsers]);

  // 4. Customers Persistence
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem('pos_users_customer');
      return saved ? JSON.parse(saved) : MOCK_CUSTOMERS;
    } catch { return MOCK_CUSTOMERS; }
  });

  useEffect(() => {
    localStorage.setItem('pos_users_customer', JSON.stringify(customers));
  }, [customers]);


  // --- APP STATE ---

  const [currentView, setCurrentView] = useState<'pos' | 'admin'>('pos');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [orders, setOrders] = useState<HeldOrder[]>([]); // Orders are ephemeral for this demo, but could be persisted too
  
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);

  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);

  // --- SESSION RESTORATION ---
  
  useEffect(() => {
    const savedSession = localStorage.getItem('pos_session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        
        if (session.type === 'admin') {
          const user = adminUsers.find(u => u.id === session.id);
          if (user) {
            setCurrentUser(user);
            setCurrentView(user.role === 'manager' ? 'admin' : 'pos');
          }
        } else if (session.type === 'customer') {
          const customer = customers.find(c => c.id === session.id);
          if (customer) {
            setCurrentCustomer(customer);
            setCurrentView('pos');
          }
        }
      } catch (e) {
        console.error("Failed to restore session", e);
        localStorage.removeItem('pos_session');
      }
    }
  }, []); // Run once on mount

  // --- HANDLERS ---

  const handleAdminLogin = (user: AdminUser) => {
    setCurrentUser(user);
    setCurrentCustomer(null); // Ensure only one type of user is logged in
    setIsAdminAuthOpen(false);
    setCurrentView(user.role === 'manager' ? 'admin' : 'pos');
    
    // Save Session
    localStorage.setItem('pos_session', JSON.stringify({ type: 'admin', id: user.id }));
  };

  const handleRegisterAdmin = (newUser: AdminUser) => {
    setAdminUsers(prev => [...prev, newUser]);
  };

  const handleCustomerLogin = (customer: Customer) => {
    setCurrentCustomer(customer);
    setCurrentUser(null); // Ensure only one type of user is logged in
    setIsCustomerAuthOpen(false);
    setCurrentView('pos'); // Customers always go to POS

    // Save Session
    localStorage.setItem('pos_session', JSON.stringify({ type: 'customer', id: customer.id }));
  };

  const handleRegisterCustomer = (newCustomer: Customer) => {
    setCustomers(prev => [...prev, newCustomer]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentCustomer(null);
    setCurrentView('pos');
    
    // Clear Session
    localStorage.removeItem('pos_session');
  };

  const handleNavigate = (view: 'pos' | 'admin') => {
    if (view === 'admin') {
        if (currentUser?.role === 'manager') {
             setCurrentView(view);
        } else if (!currentUser && !currentCustomer) {
             setIsAdminAuthOpen(true);
        }
        return;
    }
    setCurrentView(view);
  };

  // Determine role to pass to POS
  let posUserRole: 'manager' | 'staff' | 'customer' = 'staff';
  if (currentCustomer) {
    posUserRole = 'customer';
  } else if (currentUser) {
    posUserRole = currentUser.role;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden p-4 md:p-6 gap-6">
      <Sidebar 
        activeView={currentView} 
        onNavigate={handleNavigate} 
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        currentUser={currentUser}
        currentCustomer={currentCustomer}
        onLogout={handleLogout}
        onAdminLoginRequest={() => setIsAdminAuthOpen(true)}
        onCustomerLoginRequest={() => setIsCustomerAuthOpen(true)}
      />
      
      <main className="flex-1 h-full relative overflow-hidden flex flex-col">
        {currentView === 'pos' ? (
            <POSView 
                userRole={posUserRole} 
                currentCustomer={currentCustomer}
                shopInfo={shopInfo}
                orders={orders}
                onUpdateOrders={setOrders}
            /> 
        ) : (
            <AdminView isDarkMode={isDarkMode} />
        )}
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        shopInfo={shopInfo}
        onUpdateShopInfo={setShopInfo}
      />

      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onLogin={handleAdminLogin}
        onRegister={handleRegisterAdmin}
        users={adminUsers}
      />

      <CustomerAuthModal
        isOpen={isCustomerAuthOpen}
        onClose={() => setIsCustomerAuthOpen(false)}
        onLogin={handleCustomerLogin}
        onRegister={handleRegisterCustomer}
        customers={customers}
      />
    </div>
  );
};

export default App;