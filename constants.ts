
import { Category, Modifier, Product, Customer } from './types';

export const CATEGORIES = Object.values(Category);

export const EXCHANGE_RATE = 4000; // 1 USD = 4000 KHR

export const MODIFIERS: Modifier[] = [
  { id: 'm1', name: 'ទឹកដោះគោ Oat', price: 0.75, type: 'milk' },
  { id: 'm2', name: 'ទឹកដោះគោ អាល់ម៉ុន', price: 0.75, type: 'milk' },
  { id: 'm3', name: 'ទឹកដោះគោ ស្រស់', price: 0.0, type: 'milk' },
  { id: 'm4', name: 'ទឹកដោះគោ ខាប់', price: 0.50, type: 'milk' },
  { id: 's1', name: 'វ៉ានីឡា', price: 0.50, type: 'syrup' },
  { id: 's2', name: 'ការ៉ាមែល', price: 0.50, type: 'syrup' },
  { id: 's3', name: 'ហាសែលណាត់', price: 0.50, type: 'syrup' },
  { id: 's4', name: 'ប៊្លូប៊ឺរី', price: 0.50, type: 'syrup' },
  { id: 's5', name: 'ស្វាយ', price: 0.50, type: 'syrup' },
  { id: 's6', name: 'ស្ត្រប៊ឺរី', price: 0.50, type: 'syrup' },
  { id: 's7', name: 'ផាស្សិន', price: 0.50, type: 'syrup' },
  { id: 'e1', name: 'ថែមសត', price: 1.00, type: 'shot' },
  { id: 'sz1', name: 'តូច', price: 0.0, type: 'size' },
  { id: 'sz2', name: 'កណ្តាល', price: 0.50, type: 'size' },
  { id: 'sz3', name: 'ធំ', price: 1.00, type: 'size' },
  // Preparation options for Bakery
  { id: 'p1', name: 'កម្តៅ', price: 0.0, type: 'preparation' },
  { id: 'p2', name: 'ថែមប៊ឺ', price: 0.0, type: 'preparation' },
  { id: 'p3', name: 'កាត់ពាក់កណ្តាល', price: 0.0, type: 'preparation' },
];

export const PRODUCTS: Product[] = [
  // --- SMOOTHIES ---
  { id: '1', name: 'ស្មូតធីប៊្លូប៊ឺរី', price: 4.50, category: Category.SMOOTHIE, allowsModifiers: true },
  { id: '2', name: 'ស្មូតធី Blue Margaritas', price: 4.50, category: Category.SMOOTHIE, allowsModifiers: true },
  { id: '3', name: 'ស្មូតធីស្វាយ', price: 4.50, category: Category.SMOOTHIE, allowsModifiers: true },
  { id: '4', name: 'ស្មូតធីផាស្សិន', price: 4.50, category: Category.SMOOTHIE, allowsModifiers: true },
  { id: '5', name: 'ស្មូតធីបឺរ', price: 5.00, category: Category.SMOOTHIE, allowsModifiers: true },
  { id: '6', name: 'ស្មូតធីស្ត្រប៊ឺរី', price: 4.50, category: Category.SMOOTHIE, allowsModifiers: true },
  { id: '7', name: 'ស្មូតធី Raspberry', price: 4.50, category: Category.SMOOTHIE, allowsModifiers: true },

  // --- FRAPPE ---
  { id: '8', name: 'កាហ្វេហ្វ្រាប៉េ', price: 4.75, category: Category.FRAPPE, allowsModifiers: true },
  { id: '9', name: 'ការ៉ាមែលហ្វ្រាប៉េ', price: 4.75, category: Category.FRAPPE, allowsModifiers: true },
  { id: '10', name: 'កាពុឈីណូហ្វ្រាប៉េ', price: 4.75, category: Category.FRAPPE, allowsModifiers: true },
  { id: '11', name: 'សូកូឡាហ្វ្រាប៉េ', price: 4.75, category: Category.FRAPPE, allowsModifiers: true },
  { id: '12', name: 'ទឹកដោះគោស្រស់ហ្វ្រាប៉េ', price: 4.25, category: Category.FRAPPE, allowsModifiers: true },
  { id: '13', name: 'តែបៃតងហ្វ្រាប៉េ', price: 4.75, category: Category.FRAPPE, allowsModifiers: true },
  { id: '14', name: 'ម៉ូកាហ្វ្រាប៉េ', price: 4.75, category: Category.FRAPPE, allowsModifiers: true },
  { id: '15', name: 'តែក្រូចឆ្មាហ្វ្រាប៉េ', price: 4.25, category: Category.FRAPPE, allowsModifiers: true },
  { id: '16', name: 'តែ Peach ហ្វ្រាប៉េ', price: 4.25, category: Category.FRAPPE, allowsModifiers: true },
  { id: '17', name: 'តែក្រហមហ្វ្រាប៉េ', price: 4.25, category: Category.FRAPPE, allowsModifiers: true },
  { id: '18', name: 'វ៉ានីឡាហ្វ្រាប៉េ', price: 4.75, category: Category.FRAPPE, allowsModifiers: true },

  // --- ICE ---
  { id: '19', name: 'អាមេរិកាណូទឹកកក', price: 3.50, category: Category.ICE, allowsModifiers: true },
  { id: '20', name: 'អេសប្រេសូទឹកកក', price: 3.50, category: Category.ICE, allowsModifiers: true },
  { id: '21', name: 'Ice Extra Premium', price: 4.50, category: Category.ICE, allowsModifiers: true },
  { id: '22', name: 'ការ៉ាមែលឡាតេទឹកកក', price: 4.25, category: Category.ICE, allowsModifiers: true },
  { id: '23', name: 'កាពុឈីណូទឹកកក', price: 4.00, category: Category.ICE, allowsModifiers: true },
  { id: '24', name: 'សូកូឡាទឹកកក', price: 4.00, category: Category.ICE, allowsModifiers: true },
  { id: '25', name: 'តែបៃតងទឹកកក', price: 3.75, category: Category.ICE, allowsModifiers: true },
  { id: '26', name: 'តែបៃតងឡាតេទឹកកក', price: 4.25, category: Category.ICE, allowsModifiers: true },
  { id: '27', name: 'ឡាតេទឹកកក', price: 4.00, category: Category.ICE, allowsModifiers: true },
  { id: '28', name: 'តែក្រូចឆ្មាទឹកកក', price: 3.50, category: Category.ICE, allowsModifiers: true },
  { id: '29', name: 'ម៉ូកាទឹកកក', price: 4.25, category: Category.ICE, allowsModifiers: true },
  { id: '30', name: 'Ice Passion Fruit', price: 3.75, category: Category.ICE, allowsModifiers: true },
  { id: '31', name: 'Ice Peach Tea', price: 3.75, category: Category.ICE, allowsModifiers: true },
  { id: '32', name: 'តែក្រហមទឹកកក', price: 3.50, category: Category.ICE, allowsModifiers: true },
  { id: '33', name: 'វ៉ានីឡាឡាតេទឹកកក', price: 4.25, category: Category.ICE, allowsModifiers: true },

  // --- SODA ---
  { id: '34', name: 'សូដាប៊្លូប៊ឺរី', price: 3.50, category: Category.SODA, allowsModifiers: true },
  { id: '35', name: 'សូដា Blue Margaritas', price: 3.50, category: Category.SODA, allowsModifiers: true },
  { id: '36', name: 'សូដាស្វាយ', price: 3.50, category: Category.SODA, allowsModifiers: true },
  { id: '37', name: 'សូដាផាស្សិន', price: 3.50, category: Category.SODA, allowsModifiers: true },
  { id: '38', name: 'សូដា Raspberry', price: 3.50, category: Category.SODA, allowsModifiers: true },
  { id: '39', name: 'សូដាស្ត្រប៊ឺរី', price: 3.50, category: Category.SODA, allowsModifiers: true },

  // --- HOT ---
  { id: '40', name: 'អាមេរិកាណូក្តៅ', price: 3.00, category: Category.HOT, allowsModifiers: true },
  { id: '41', name: 'កាពុឈីណូក្តៅ', price: 3.50, category: Category.HOT, allowsModifiers: true },
  { id: '42', name: 'សូកូឡាក្តៅ', price: 3.50, category: Category.HOT, allowsModifiers: true },
  { id: '43', name: 'អេសប្រេសូក្តៅ', price: 2.50, category: Category.HOT, allowsModifiers: true },
  { id: '44', name: 'Hot Extra Premium', price: 4.00, category: Category.HOT, allowsModifiers: true },
  { id: '45', name: 'ទឹកដោះគោស្រស់ក្តៅ', price: 3.00, category: Category.HOT, allowsModifiers: true },
  { id: '46', name: 'តែបៃតងក្តៅ', price: 3.25, category: Category.HOT, allowsModifiers: true },
  { id: '47', name: 'តែក្រូចឆ្មាក្តៅ', price: 3.00, category: Category.HOT, allowsModifiers: true },
  { id: '48', name: 'ឡាតេក្តៅ', price: 3.50, category: Category.HOT, allowsModifiers: true },
  { id: '49', name: 'ម៉ូកាក្តៅ', price: 3.75, category: Category.HOT, allowsModifiers: true },
  { id: '50', name: 'តែក្រហមក្តៅ', price: 3.00, category: Category.HOT, allowsModifiers: true },
  { id: '51', name: 'តែ Peach ក្តៅ', price: 3.00, category: Category.HOT, allowsModifiers: true },
  { id: '52', name: 'តែក្តៅ', price: 2.50, category: Category.HOT, allowsModifiers: true },

  // --- BAKERY ---
  { id: 'b1', name: 'Croissant', price: 3.50, category: Category.BAKERY, allowsModifiers: true },
  { id: 'b2', name: 'Blueberry Muffin', price: 3.25, category: Category.BAKERY, allowsModifiers: true },
  { id: 'b3', name: 'Chocolate Cookie', price: 2.50, category: Category.BAKERY, allowsModifiers: true },
];

export const MOCK_SALES_DATA = [
  { time: '06:00', sales: 120, orders: 15 },
  { time: '07:00', sales: 450, orders: 52 },
  { time: '08:00', sales: 890, orders: 95 },
  { time: '09:00', sales: 620, orders: 70 },
  { time: '10:00', sales: 300, orders: 35 },
  { time: '11:00', sales: 250, orders: 28 },
  { time: '12:00', sales: 350, orders: 40 },
];

export const TOP_SELLING_ITEMS = [
  { name: 'ឡាតេទឹកកក', quantity: 145 },
  { name: 'កាហ្វេហ្វ្រាប៉េ', quantity: 98 },
  { name: 'កាពុឈីណូក្តៅ', quantity: 86 },
  { name: 'ស្មូតធីប៊្លូប៊ឺរី', quantity: 72 },
  { name: 'អាមេរិកាណូក្តៅ', quantity: 65 },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Sokha', phone: '012345678', points: 120, visits: 5, lastVisit: Date.now() - 86400000 },
  { id: 'c2', name: 'Dara', phone: '098765432', points: 45, visits: 2, lastVisit: Date.now() - 172800000 },
];
