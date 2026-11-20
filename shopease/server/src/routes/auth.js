const router = require('express').Router();
const authService = require('../services/authService');

router.post('/login', (req, res, next) => {
  try {
    const { email, password } = req.body;
    res.json(authService.login(email, password));
  } catch (err) {
    next(err);
  }
});

router.post('/register', (req, res, next) => {
  try {
    res.status(201).json(authService.register(req.body));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
