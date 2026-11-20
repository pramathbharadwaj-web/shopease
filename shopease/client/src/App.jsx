import { useEffect, useState } from 'react';
import { api, setToken } from './api';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import CheckoutForm from './components/CheckoutForm';

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('shop'); // shop | cart | checkout | done
  const [cart, setCart] = useState({ items: [], totals: null });
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) api.getCart().then(setCart).catch((e) => setError(e.message));
  }, [user]);

  const handleLogin = async (email, password) => {
    const { token, user } = await api.login(email, password);
    setToken(token);
    setUser(user);
  };

  const run = async (fn) => {
    setError('');
    try {
      await fn();
    } catch (e) {
      setError(e.message);
    }
  };

  const itemCount = cart.items.reduce((n, i) => n + i.quantity, 0);

  if (!user) return <LoginForm onLogin={handleLogin} />;

  return (
    <div className="app">
      <Header user={user} cartCount={itemCount} onNavigate={setView} />
      {error && <div className="alert" role="alert">{error}</div>}

      <main>
        {view === 'shop' && (
          <ProductList onAdd={(id) => run(async () => setCart(await api.addToCart(id)))} />
        )}
        {view === 'cart' && (
          <Cart
            cart={cart}
            onUpdate={(id, qty) => run(async () => setCart(await api.updateQuantity(id, qty)))}
            onRemove={(id) => run(async () => setCart(await api.removeFromCart(id)))}
            onApplyCoupon={(code) => run(async () => setCart(await api.getCart(code)))}
            onCheckout={() => setView('checkout')}
          />
        )}
        {view === 'checkout' && (
          <CheckoutForm
            totals={cart.totals}
            onSubmit={(address) =>
              run(async () => {
                const placed = await api.placeOrder(address, cart.totals?.appliedCoupon);
                setOrder(placed);
                setCart({ items: [], totals: null });
                setView('done');
              })
            }
          />
        )}
        {view === 'done' && order && (
          <section className="confirmation">
            <h2>Thank you for your order!</h2>
            <p>Order <strong>{order.id}</strong> — total ${order.totals.total.toFixed(2)}</p>
            <button onClick={() => setView('shop')}>Continue shopping</button>
          </section>
        )}
      </main>
    </div>
  );
}
