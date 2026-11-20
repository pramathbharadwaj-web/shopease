const cartService = require('./cartService');
const productService = require('./productService');

const orders = [];
const ZIP_RE = /^\d{5,6}$/;

function validateShipping(address = {}) {
  const required = ['fullName', 'line1', 'city', 'postalCode'];
  const missing = required.filter((f) => !address[f] || !String(address[f]).trim());
  if (missing.length) {
    const err = new Error(`Missing shipping fields: ${missing.join(', ')}`);
    err.status = 400;
    throw err;
  }
  if (!ZIP_RE.test(address.postalCode)) {
    const err = new Error('Postal code must be 5 or 6 digits');
    err.status = 400;
    throw err;
  }
}

function placeOrder(userId, { shippingAddress, couponCode }) {
  validateShipping(shippingAddress);

  const cart = cartService.getCart(userId, couponCode);
  if (cart.items.length === 0) {
    const err = new Error('Cannot place an order with an empty cart');
    err.status = 400;
    throw err;
  }

  cart.items.forEach((item) => productService.reserveStock(item.productId, item.quantity));

  const order = {
    id: `ORD-${Date.now().toString(36).toUpperCase()}`,
    userId,
    items: cart.items,
    totals: cart.totals,
    shippingAddress,
    status: 'PLACED',
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  cartService.clearCart(userId);
  return order;
}

function listOrders(userId) {
  return orders.filter((o) => o.userId === userId).reverse();
}

function cancelOrder(userId, orderId) {
  const order = orders.find((o) => o.id === orderId && o.userId === userId);
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }
  if (order.status !== 'PLACED') {
    const err = new Error(`Order cannot be cancelled once ${order.status.toLowerCase()}`);
    err.status = 409;
    throw err;
  }
  order.status = 'CANCELLED';
  return order;
}

module.exports = { placeOrder, listOrders, cancelOrder };
