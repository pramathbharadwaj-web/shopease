const { products } = require('../data/products');

const SORTERS = {
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  'name-asc': (a, b) => a.name.localeCompare(b.name),
  rating: (a, b) => b.rating - a.rating,
};

function listProducts({ search, category, sort, inStock } = {}) {
  let result = [...products];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(q));
  }
  if (category) {
    result = result.filter((p) => p.category === category);
  }
  if (inStock === 'true') {
    result = result.filter((p) => p.stock > 0);
  }
  if (sort) {
    const sorter = SORTERS[sort];
    if (!sorter) {
      const err = new Error(`Unsupported sort option: ${sort}`);
      err.status = 400;
      throw err;
    }
    result.sort(sorter);
  }
  return result;
}

function getProduct(id) {
  const product = products.find((p) => p.id === id);
  if (!product) {
    const err = new Error('Product not found');
    err.status = 404;
    throw err;
  }
  return product;
}

function reserveStock(id, quantity) {
  const product = getProduct(id);
  if (product.stock < quantity) {
    const err = new Error(`Only ${product.stock} left in stock for ${product.name}`);
    err.status = 409;
    throw err;
  }
  product.stock -= quantity;
}

module.exports = { listProducts, getProduct, reserveStock };
