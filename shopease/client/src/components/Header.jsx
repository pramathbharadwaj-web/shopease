export default function Header({ user, cartCount, onNavigate }) {
  return (
    <header className="header">
      <h1 className="logo" onClick={() => onNavigate('shop')}>ShopEase</h1>
      <nav>
        <span className="greeting">Hi, {user.name.split(' ')[0]}</span>
        <button className="cart-button" onClick={() => onNavigate('cart')} aria-label="Open cart">
          🛒 Cart {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </button>
      </nav>
    </header>
  );
}
