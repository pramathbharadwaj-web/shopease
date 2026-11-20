import { useEffect, useState } from 'react';
import { api } from '../api';
import ProductCard from './ProductCard';

const SORT_OPTIONS = [
  { value: '', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function ProductList({ onAdd }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (sort) params.sort = sort;
    if (inStockOnly) params.inStock = 'true';
    api.getProducts(params).then(setProducts);
  }, [search, sort, inStockOnly]);

  return (
    <section>
      <div className="toolbar">
        <input
          type="search"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <label className="checkbox">
          <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
          In stock only
        </label>
      </div>

      {products.length === 0 ? (
        <p className="muted">No products match your search.</p>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={onAdd} />
          ))}
        </div>
      )}
    </section>
  );
}
