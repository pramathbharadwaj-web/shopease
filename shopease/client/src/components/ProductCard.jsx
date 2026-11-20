export default function ProductCard({ product, onAdd }) {
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <article className="card">
      <div className="card-category">{product.category}</div>
      <h3>{product.name}</h3>
      <div className="rating">★ {product.rating.toFixed(1)}</div>
      <div className="price">${product.price.toFixed(2)}</div>
      {lowStock && <div className="stock-warning">Only {product.stock} left!</div>}
      <button disabled={outOfStock} onClick={() => onAdd(product.id)}>
        {outOfStock ? 'Out of stock' : 'Add to cart'}
      </button>
    </article>
  );
}
