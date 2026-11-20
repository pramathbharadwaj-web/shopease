import { useState } from 'react';

const EMPTY = { fullName: '', line1: '', city: '', postalCode: '' };

export default function CheckoutForm({ totals, onSubmit }) {
  const [address, setAddress] = useState(EMPTY);
  const update = (field) => (e) => setAddress({ ...address, [field]: e.target.value });

  return (
    <form
      className="checkout"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(address);
      }}
    >
      <h2>Shipping details</h2>
      <input placeholder="Full name" value={address.fullName} onChange={update('fullName')} />
      <input placeholder="Address line 1" value={address.line1} onChange={update('line1')} />
      <input placeholder="City" value={address.city} onChange={update('city')} />
      <input placeholder="Postal code" value={address.postalCode} onChange={update('postalCode')} />

      {totals && <p className="order-total">Order total: <strong>${totals.total.toFixed(2)}</strong></p>}
      <button type="submit" className="primary">Place order</button>
    </form>
  );
}
