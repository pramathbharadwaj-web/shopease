const productService = require('./productService');
const { calculateTotals } = require('../utils/pricing');

const MAX_QTY_PER_ITEM = 10;
const carts = new Map(); // userId -> [{ productId, quantity }]

function getLines(userId) {
  if (!carts.has(userId)) carts.set(userId, []);
  return carts.get(userId);
}

function getCart(userId, couponCode) {
  const lines = getLines(userId).map((line) => {
    const product = productService.getProduct(line.productId);
    return { ...line, name: product.name, price: product.price };
  });
  return { items: lines, totals: calculateTotals(lines, couponCode) };
}

function addItem(userId, productId, quantity = 1) {
  if (!Number.isInteger(quantity) || quantity < 1) {
    const err = new Error('Quantity must be a positive whole number');
    err.status = 400;
    throw err;
  }

  const product = productService.getProduct(productId);
  const lines = getLines(userId);
  const existing = lines.find((l) => l.productId === productId);
  const newQty = (existing?.quantity ?? 0) + quantity;

  if (newQty > MAX_QTY_PER_ITEM) {
    const err = new Error(`You can add at most ${MAX_QTY_PER_ITEM} of this item`);
    err.status = 400;
    throw err;
  }
  if (newQty > product.stock) {
    const err = new Error(`Only ${product.stock} left in stock`);
    err.status = 409;
    throw err;
  }

  if (existing) existing.quantity = newQty;
  else lines.push({ productId, quantity });

  return getCart(userId);
}

function updateQuantity(userId, productId, quantity) {
  const lines = getLines(userId);
  const line = lines.find((l) => l.productId === productId);
  if (!line) {
    const err = new Error('Item not in cart');
    err.status = 404;
    throw err;
  }
  if (quantity <= 0) return removeItem(userId, productId);
  line.quantity = Math.min(quantity, MAX_QTY_PER_ITEM);
  return getCart(userId);
}

function removeItem(userId, productId) {
  carts.set(userId, getLines(userId).filter((l) => l.productId !== productId));
  return getCart(userId);
}

function clearCart(userId) {
  carts.set(userId, []);
}

module.exports = { getCart, addItem, updateQuantity, removeItem, clearCart, MAX_QTY_PER_ITEM };
