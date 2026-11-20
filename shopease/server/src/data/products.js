// In-memory catalog. Swap for a real database in production.
const products = [
  { id: 'p-1001', name: 'Classic Canvas Backpack', category: 'bags', price: 49.99, stock: 25, rating: 4.6 },
  { id: 'p-1002', name: 'Wireless Earbuds Pro', category: 'electronics', price: 89.0, stock: 40, rating: 4.4 },
  { id: 'p-1003', name: 'Stainless Water Bottle', category: 'outdoors', price: 18.5, stock: 120, rating: 4.8 },
  { id: 'p-1004', name: 'Running Shoes – Aero', category: 'footwear', price: 119.99, stock: 12, rating: 4.3 },
  { id: 'p-1005', name: 'Organic Cotton Tee', category: 'apparel', price: 22.0, stock: 0, rating: 4.1 },
  { id: 'p-1006', name: 'Smart Desk Lamp', category: 'electronics', price: 39.95, stock: 18, rating: 4.5 },
];

const users = [
  { id: 'u-1', email: 'jane@shopease.dev', password: 'Passw0rd!', name: 'Jane Doe' },
];

module.exports = { products, users };
