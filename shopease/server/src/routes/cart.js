const router = require('express').Router();
const cartService = require('../services/cartService');

router.get('/', (req, res, next) => {
  try {
    res.json(cartService.getCart(req.user.id, req.query.coupon));
  } catch (err) {
    next(err);
  }
});

router.post('/items', (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    res.status(201).json(cartService.addItem(req.user.id, productId, quantity));
  } catch (err) {
    next(err);
  }
});

router.patch('/items/:productId', (req, res, next) => {
  try {
    res.json(cartService.updateQuantity(req.user.id, req.params.productId, req.body.quantity));
  } catch (err) {
    next(err);
  }
});

router.delete('/items/:productId', (req, res, next) => {
  try {
    res.json(cartService.removeItem(req.user.id, req.params.productId));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
