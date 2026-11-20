const TAX_RATE = Number(process.env.TAX_RATE ?? 0.08);
const FREE_SHIPPING_THRESHOLD = Number(process.env.FREE_SHIPPING_THRESHOLD ?? 50);
const FLAT_SHIPPING_FEE = 5.99;

const COUPONS = {
  WELCOME10: { type: 'percent', value: 10, minSubtotal: 0 },
  SAVE20: { type: 'flat', value: 20, minSubtotal: 100 },
  FREESHIP: { type: 'shipping', value: 0, minSubtotal: 25 },
};

const round = (n) => Math.round(n * 100) / 100;

/**
 * Calculates the order totals for a list of cart lines.
 * @param {{ price: number, quantity: number }[]} lines
 * @param {string} [couponCode]
 */
function calculateTotals(lines, couponCode) {
  const subtotal = round(lines.reduce((sum, l) => sum + l.price * l.quantity, 0));

  let discount = 0;
  let shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : FLAT_SHIPPING_FEE;
  let appliedCoupon = null;

  if (couponCode) {
    const coupon = COUPONS[couponCode.trim().toUpperCase()];
    if (!coupon) {
      const err = new Error('Invalid coupon code');
      err.status = 400;
      throw err;
    }
    if (subtotal < coupon.minSubtotal) {
      const err = new Error(`Coupon requires a minimum subtotal of $${coupon.minSubtotal}`);
      err.status = 400;
      throw err;
    }
    appliedCoupon = couponCode.toUpperCase();
    if (coupon.type === 'percent') discount = round((subtotal * coupon.value) / 100);
    if (coupon.type === 'flat') discount = Math.min(coupon.value, subtotal);
    if (coupon.type === 'shipping') shipping = 0;
  }

  const taxable = Math.max(subtotal - discount, 0);
  const tax = round(taxable * TAX_RATE);
  const total = round(taxable + tax + shipping);

  return { subtotal, discount, shipping, tax, total, appliedCoupon };
}

module.exports = { calculateTotals, TAX_RATE, FREE_SHIPPING_THRESHOLD, COUPONS };
