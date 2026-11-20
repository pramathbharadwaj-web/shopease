const router = require('express').Router();
const orderService = require('../services/orderService');

router.get('/', (req, res) => {
  res.json(orderService.listOrders(req.user.id));
});

router.post('/', (req, res, next) => {
  try {
    res.status(201).json(orderService.placeOrder(req.user.id, req.body));
  } catch (err) {
    next(err);
  }
});

router.post('/:id/cancel', (req, res, next) => {
  try {
    res.json(orderService.cancelOrder(req.user.id, req.params.id));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
