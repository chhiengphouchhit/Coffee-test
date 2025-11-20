import React, { useState } from 'react';
import { Category, Product, CartItem, Modifier, HeldOrder, Discount, PaymentDetails, Customer, ShopInfo } from '../types';
import { PRODUCTS, CATEGORIES } from '../constants';
import { Cart } from './Cart';
import { CustomizationModal } from './CustomizationModal';
import { AddProductModal } from './AddProductModal';
import { ReceiptModal } from './ReceiptModal';
import { HeldOrdersModal } from './HeldOrdersModal';
import { IncomingOrdersModal } from './IncomingOrdersModal';
import { OrderSuccessModal } from './OrderSuccessModal';
import { PaymentModal } from './PaymentModal';
import { Search, Grid, Plus, Minus, Coffee, Pencil, Clock, Bell, ChevronRight, SlidersHorizontal } from 'lucide-react';

// Simulating simple UUID
const generateId = () => Math.random().toString(36).substring(2, 9);

interface POSViewProps {
  userRole: 'manager' | 'staff' | 'customer';
  currentCustomer: Customer | null;
  shopInfo: ShopInfo;
  orders: HeldOrder[];
  onUpdateOrders: (orders: HeldOrder[]) => void;
}

export const POSView: React.FC<POSViewProps> = ({ userRole, currentCustomer, shopInfo, orders, onUpdateOrders }) => {
  const isCustomerMode = userRole === 'customer';
  const canEditProducts = userRole === 'manager';

  // State to manage products dynamically
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  // State to track quantity for each product
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({});
  
  const [activeCategory, setActiveCategory] = useState<Category>(Category.HOT);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [modifyingProduct, setModifyingProduct] = useState<Product | null>(null);
  
  // Add/Edit Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [lastSubmittedOrderNum, setLastSubmittedOrderNum] = useState('');

  // Payment State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

  // Orders State
  const [isHeldOrdersModalOpen, setIsHeldOrdersModalOpen] = useState(false);
  const [isIncomingOrdersModalOpen, setIsIncomingOrdersModalOpen] = useState(false);

  // Discount State
  const [discount, setDiscount] = useState<Discount>({ type: 'percentage', value: 0 });

  // Filter Orders
  const heldOrders = orders.filter(o => o.status === 'held');
  const submittedOrders = orders.filter(o => o.status === 'submitted');

  const filteredProducts = products.filter(p => 
    p.category === activeCategory && 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getQuantity = (productId: string) => productQuantities[productId] || 1;

  const updateQuantity = (e: React.MouseEvent, productId: string, delta: number) => {
    e.stopPropagation();
    setProductQuantities(prev => {
        const current = prev[productId] || 1;
        const next = Math.max(1, current + delta);
        return { ...prev, [productId]: next };
    });
  };

  const handleProductClick = (product: Product) => {
    if (product.allowsModifiers) {
        setModifyingProduct(product);
    } else {
        addToCart(product, [], getQuantity(product.id));
    }
  };

  const addToCart = (product: Product, modifiers: Modifier[], quantity: number) => {
    const newItems: CartItem[] = [];
    for (let i = 0; i < quantity; i++) {
        newItems.push({
            ...product,
            cartItemId: generateId(),
            selectedModifiers: modifiers
        });
    }
    setCartItems(prev => [...prev, ...newItems]);
    setModifyingProduct(null);
    // Reset quantity back to 1 after adding
    setProductQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(cartItems.filter(item => item.cartItemId !== cartItemId));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    if (isCustomerMode) {
        // Customer submission flow
        handleCustomerSubmitOrder();
    } else {
        // Staff payment flow
        setIsPaymentModalOpen(true);
    }
  };

  const handleCustomerSubmitOrder = () => {
    const subtotal = cartItems.reduce((sum, item) => {
        const modsPrice = item.selectedModifiers.reduce((mSum, mod) => mSum + mod.price, 0);
        return sum + item.price + modsPrice;
    }, 0);
    
    const total = subtotal; 

    const newOrder: HeldOrder = {
        id: Math.floor(Math.random() * 900 + 100).toString(),
        items: [...cartItems],
        timestamp: Date.now(),
        total: total,
        discount: discount,
        customerName: currentCustomer?.name || 'Guest',
        status: 'submitted'
    };

    onUpdateOrders([...orders, newOrder]);
    setCartItems([]);
    setDiscount({ type: 'percentage', value: 0 });
    setLastSubmittedOrderNum(newOrder.id);
    setIsOrderSuccessOpen(true);
  };

  const handlePaymentConfirm = (details: PaymentDetails) => {
    setPaymentDetails(details);
    setIsPaymentModalOpen(false);
    setIsReceiptOpen(true);
  };

  const handleReceiptClose = () => {
    setIsReceiptOpen(false);
    setCartItems([]);
    setDiscount({ type: 'percentage', value: 0 }); // Reset discount
    setPaymentDetails(null);
  };

  const handleSaveProduct = (savedProduct: Product) => {
    if (editingProduct) {
        setProducts(products.map(p => p.id === savedProduct.id ? savedProduct : p));
    } else {
        setProducts([...products, savedProduct]);
        setActiveCategory(savedProduct.category);
    }
    setEditingProduct(null);
    setIsProductModalOpen(false);
  };

  const openEditModal = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleHoldOrder = () => {
    if (cartItems.length === 0) return;
    
    const subtotal = cartItems.reduce((sum, item) => {
        const modsPrice = item.selectedModifiers.reduce((mSum, mod) => mSum + mod.price, 0);
        return sum + item.price + modsPrice;
    }, 0);
    
    let discountAmount = 0;
    if (discount.type === 'percentage') {
      discountAmount = subtotal * (discount.value / 100);
    } else {
      discountAmount = discount.value;
    }
    discountAmount = Math.min(discountAmount, subtotal);
    const total = subtotal - discountAmount;

    const newOrder: HeldOrder = {
        id: Math.floor(Math.random() * 9000 + 1000).toString(),
        items: [...cartItems],
        timestamp: Date.now(),
        total: total,
        discount: discount,
        status: 'held'
    };

    onUpdateOrders([...orders, newOrder]);
    setCartItems([]);
    setDiscount({ type: 'percentage', value: 0 });
  };

  const handleResumeOrder = (order: HeldOrder) => {
    setCartItems(order.items);
    if (order.discount) {
        setDiscount(order.discount);
    } else {
        setDiscount({ type: 'percentage', value: 0 });
    }
    // Remove from global orders
    onUpdateOrders(orders.filter(o => o.id !== order.id));
    setIsHeldOrdersModalOpen(false);
    setIsIncomingOrdersModalOpen(false);
  };

  const handleDeleteOrder = (orderId: string) => {
    onUpdateOrders(orders.filter(o => o.id !== orderId));
  };

  return (
    <div className="flex h-full w-full overflow-hidden gap-6">
      {/* Main Content Area - Glass Panel */}
      <div className="flex-1 flex flex-col glass-panel rounded-[2rem] overflow-hidden border border-white/10 relative shadow-2xl">
        
        {/* Top Bar */}
        <div className="h-24 px-8 flex items-center justify-between shrink-0 bg-white/5 border-b border-white/5 z-20 backdrop-blur-xl">
            <div className="flex flex-col justify-center">
                <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2 font-sans">
                   {isCustomerMode ? 'KIOSK MODE' : shopInfo.name}
                   <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-lg shadow-orange-500/30 tracking-wider uppercase">
                        Premium
                   </span>
                </h1>
                <span className="text-sm font-medium text-slate-400 flex items-center gap-1 mt-1">
                    <Clock size={14} />
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
            </div>

            <div className="flex items-center gap-4">
                {/* Modern Search Bar */}
                <div className="relative w-72 xl:w-96 group">
                    <div className="relative flex items-center">
                        <Search className="absolute left-4 text-slate-400 group-focus-within:text-orange-400 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search for delicious items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900/50 border border-white/10 focus:border-orange-500/50 focus:bg-slate-900/80 text-white placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all font-medium shadow-inner"
                        />
                    </div>
                </div>
                
                {/* Staff Only Features */}
                {!isCustomerMode && (
                    <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
                        <button 
                            onClick={() => setIsIncomingOrdersModalOpen(true)}
                            className="relative p-3 text-slate-400 hover:bg-white/10 hover:text-orange-400 rounded-xl transition-all"
                            title="Incoming Orders"
                        >
                            <Bell size={22} className={submittedOrders.length > 0 ? "text-orange-500 animate-swing" : ""} />
                            {submittedOrders.length > 0 && (
                                <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse shadow-lg shadow-red-500/50"></span>
                            )}
                        </button>

                        <button 
                            onClick={() => setIsHeldOrdersModalOpen(true)}
                            className="relative p-3 text-slate-400 hover:bg-white/10 hover:text-blue-400 rounded-xl transition-all"
                            title="Held Orders"
                        >
                            <Clock size={22} />
                            {heldOrders.length > 0 && (
                                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></span>
                            )}
                        </button>

                        {canEditProducts && (
                            <div className="w-px h-8 bg-white/10 mx-1"></div>
                        )}

                        {canEditProducts && (
                            <button 
                                onClick={openAddModal}
                                className="p-3 bg-orange-500 text-white rounded-xl transition-all hover:shadow-lg hover:shadow-orange-500/20 hover:bg-orange-600 active:scale-95"
                                title="Add Product"
                            >
                                <Plus size={22} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* Category Tabs - Floating Pills */}
        <div className="px-8 py-6 shrink-0">
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 border
                            ${activeCategory === cat 
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400 shadow-lg shadow-orange-500/25 scale-105' 
                                : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:border-white/20 hover:text-white'
                            }
                        `}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-8 pt-2 custom-scrollbar">
            {filteredProducts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 animate-fade-in">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                        <Coffee size={48} strokeWidth={1.5} className="opacity-40" />
                    </div>
                    <p className="text-xl font-bold mb-2 text-slate-300">No items found</p>
                    <p className="text-sm opacity-70">Try selecting a different category</p>
                    {canEditProducts && (
                        <button onClick={openAddModal} className="mt-6 px-6 py-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl font-bold hover:bg-orange-500/20 transition-colors">
                            Add New Item
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-24">
                    {filteredProducts.map((product, index) => (
                        <button
                            key={product.id}
                            onClick={() => handleProductClick(product)}
                            className="group relative flex flex-col h-[260px] rounded-[1.5rem] glass-card transition-all duration-500 hover:-translate-y-2 hover:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-900/20 overflow-hidden text-left animate-fade-in"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Image Area with Gradient Overlay */}
                            <div className="h-[55%] w-full relative overflow-hidden p-2">
                                <div className="w-full h-full rounded-[1rem] overflow-hidden bg-slate-800 relative flex items-center justify-center shadow-inner border border-white/5 group-hover:border-orange-500/20 transition-colors">
                                     {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"/>
                                    ) : (
                                        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 group-hover:from-orange-900/20 group-hover:to-slate-900 transition-all duration-500">
                                            <Coffee size={40} className="text-slate-600 group-hover:text-orange-500 transition-colors duration-500" strokeWidth={1.5} />
                                        </div>
                                    )}
                                </div>

                                {/* Modifiers Badge */}
                                {product.allowsModifiers && (
                                    <div className="absolute bottom-4 left-4 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/10">
                                        <SlidersHorizontal size={10} />
                                        <span>CUSTOM</span>
                                    </div>
                                )}

                                {/* Edit Button */}
                                {canEditProducts && (
                                    <div 
                                        onClick={(e) => openEditModal(e, product)}
                                        className="absolute top-4 right-4 p-2 bg-slate-900/80 backdrop-blur-xl rounded-full shadow-lg text-slate-400 hover:text-white hover:bg-orange-500 transition-all opacity-0 group-hover:opacity-100 z-10 transform translate-y-2 group-hover:translate-y-0 duration-300"
                                    >
                                        <Pencil size={14} />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="px-5 pb-5 pt-1 flex flex-col justify-between flex-1">
                                <div>
                                    <h3 className="font-bold text-slate-200 text-base leading-tight line-clamp-2 group-hover:text-white transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1 font-medium group-hover:text-slate-400">{product.category}</p>
                                </div>
                                
                                <div className="flex items-end justify-between mt-2">
                                    <span className="text-lg font-black text-orange-400 tracking-tight group-hover:text-orange-300 transition-colors">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    
                                    {/* Interactive Quantity Control */}
                                    <div 
                                        onClick={e => e.stopPropagation()}
                                        className={`flex items-center bg-slate-800/80 rounded-xl p-1 shadow-lg border border-white/10 transition-all duration-300 backdrop-blur-sm
                                            ${getQuantity(product.id) > 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0'}
                                        `}
                                    >
                                        <button 
                                            onClick={(e) => updateQuantity(e, product.id, -1)}
                                            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-600 text-slate-400 transition-colors"
                                        >
                                            <Minus size={12} strokeWidth={3} />
                                        </button>
                                        <span className="w-5 text-center text-xs font-bold text-white tabular-nums">
                                            {getQuantity(product.id)}
                                        </span>
                                        <button 
                                            onClick={(e) => updateQuantity(e, product.id, 1)}
                                            className="w-6 h-6 flex items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white hover:to-amber-500 shadow-md shadow-orange-500/20 transition-all"
                                        >
                                            <Plus size={12} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* Right Sidebar - Cart */}
      <div className="w-[400px] xl:w-[440px] h-full shrink-0 z-30 flex flex-col">
        <Cart 
            items={cartItems} 
            onRemove={removeFromCart} 
            onCheckout={handleCheckout}
            onHold={handleHoldOrder}
            discount={discount}
            onSetDiscount={setDiscount}
            userRole={userRole}
            currentCustomer={currentCustomer}
        />
      </div>

      {/* Modals */}
      {modifyingProduct && (
        <CustomizationModal 
            product={modifyingProduct} 
            onClose={() => setModifyingProduct(null)} 
            onConfirm={(mods) => addToCart(modifyingProduct, mods, getQuantity(modifyingProduct.id))}
        />
      )}
      
      {canEditProducts && isProductModalOpen && (
        <AddProductModal
            onClose={() => {
                setIsProductModalOpen(false);
                setEditingProduct(null);
            }}
            onSave={handleSaveProduct}
            categories={CATEGORIES}
            initialProduct={editingProduct}
        />
      )}

      {isPaymentModalOpen && (
        <PaymentModal 
            items={cartItems}
            discount={discount}
            onClose={() => setIsPaymentModalOpen(false)}
            onConfirm={handlePaymentConfirm}
        />
      )}

      {isReceiptOpen && (
        <ReceiptModal 
            items={cartItems}
            onClose={handleReceiptClose}
            discount={discount}
            paymentDetails={paymentDetails}
            shopInfo={shopInfo}
        />
      )}

      {!isCustomerMode && isHeldOrdersModalOpen && (
        <HeldOrdersModal 
            heldOrders={heldOrders}
            onClose={() => setIsHeldOrdersModalOpen(false)}
            onResume={handleResumeOrder}
            onDelete={handleDeleteOrder}
        />
      )}

      {!isCustomerMode && isIncomingOrdersModalOpen && (
        <IncomingOrdersModal 
            orders={submittedOrders}
            onClose={() => setIsIncomingOrdersModalOpen(false)}
            onProcess={handleResumeOrder}
        />
      )}

      {isOrderSuccessOpen && (
        <OrderSuccessModal 
            onClose={() => setIsOrderSuccessOpen(false)}
            orderNumber={lastSubmittedOrderNum}
        />
      )}
    </div>
  );
};