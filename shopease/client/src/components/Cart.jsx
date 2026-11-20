import { useState } from 'react';

export default function Cart({ cart, onUpdate, onRemove, onApplyCoupon, onCheckout }) {
  const [coupon, setCoupon] = useState('');
  const { items, totals } = cart;

  if (items.length === 0) {
    return <p className="muted">Your cart is empty.</p>;
  }

  return (
    <section className="cart">
      <h2>Your cart</h2>
      <ul>
        {items.map((item) => (
          <li key={item.productId} className="cart-line">
            <span className="name">{item.name}</span>
            <input
              type="number"
              min="0"
              max="10"
              value={item.quantity}
              onChange={(e) => onUpdate(item.productId, Number(e.target.value))}
              aria-label={`Quantity for ${item.name}`}
            />
            <span>${(item.price * item.quantity).toFixed(2)}</span>
            <button className="link" onClick={() => onRemove(item.productId)}>Remove</button>
          </li>
        ))}
      </ul>

      <div className="coupon">
        <input placeholder="Coupon code" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
        <button onClick={() => onApplyCoupon(coupon)} disabled={!coupon}>Apply</button>
      </div>

      {totals && (
        <dl className="totals">
          <dt>Subtotal</dt><dd>${totals.subtotal.toFixed(2)}</dd>
          {totals.discount > 0 && (<><dt>Discount ({totals.appliedCoupon})</dt><dd>−${totals.discount.toFixed(2)}</dd></>)}
          <dt>Shipping</dt><dd>{totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`}</dd>
          <dt>Tax</dt><dd>${totals.tax.toFixed(2)}</dd>
          <dt className="total">Total</dt><dd className="total">${totals.total.toFixed(2)}</dd>
        </dl>
      )}

      <button className="primary" onClick={onCheckout}>Proceed to checkout</button>
    </section>
  );
}
