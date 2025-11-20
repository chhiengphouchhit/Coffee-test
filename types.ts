
export enum Category {
  SMOOTHIE = 'ក្រឡុក',
  FRAPPE = 'ហ្វ្រាប៉េ',
  ICE = 'ទឹកកក',
  SODA = 'សូដា',
  HOT = 'ក្តៅ',
  BAKERY = 'នំ'
}

export interface Modifier {
  id: string;
  name: string;
  price: number;
  type: 'milk' | 'syrup' | 'shot' | 'size' | 'preparation';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image?: string;
  allowsModifiers: boolean;
}

export interface CartItem extends Product {
  cartItemId: string;
  selectedModifiers: Modifier[];
}

export interface SalesData {
  time: string;
  sales: number;
  orders: number;
}

export interface TopSellingItem {
  name: string;
  quantity: number;
}

export interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
}

export interface PaymentDetails {
  receivedUSD: number;
  receivedKHR: number;
  changeUSD: number;
  changeKHR: number;
}

export interface HeldOrder {
  id: string;
  items: CartItem[];
  timestamp: number;
  total: number;
  discount?: Discount;
  customerName?: string;
  status: 'held' | 'submitted';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  points: number;
  visits: number;
  lastVisit: number;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  pin: string; // Simplified password for POS
  role: 'manager' | 'staff';
}

export interface ShopInfo {
  name: string;
  address: string;
  phone: string;
  wifi?: string;
}
