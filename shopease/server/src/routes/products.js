const router = require('express').Router();
const productService = require('../services/productService');

// GET /api/products?search=&category=&sort=price-asc&inStock=true
router.get('/', (req, res, next) => {
  try {
    res.json(productService.listProducts(req.query));
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    res.json(productService.getProduct(req.params.id));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
