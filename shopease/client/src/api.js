let authToken = null;

export const setToken = (token) => {
  authToken = token;
};

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  getProducts: (params = {}) => request(`/products?${new URLSearchParams(params)}`),
  getCart: (coupon) => request(`/cart${coupon ? `?coupon=${encodeURIComponent(coupon)}` : ''}`),
  addToCart: (productId, quantity = 1) =>
    request('/cart/items', { method: 'POST', body: { productId, quantity } }),
  updateQuantity: (productId, quantity) =>
    request(`/cart/items/${productId}`, { method: 'PATCH', body: { quantity } }),
  removeFromCart: (productId) => request(`/cart/items/${productId}`, { method: 'DELETE' }),
  placeOrder: (shippingAddress, couponCode) =>
    request('/orders', { method: 'POST', body: { shippingAddress, couponCode } }),
};
