const crypto = require('crypto');
const { users } = require('../data/products');

const SECRET = process.env.TOKEN_SECRET || 'dev-secret';
const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function verifyToken(token) {
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  if (sig !== expected) return null;

  const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
  if (Date.now() > payload.exp) return null;
  return { id: payload.sub, email: payload.email };
}

function validateCredentials(email, password) {
  if (!email || !EMAIL_RE.test(email)) {
    const err = new Error('A valid email is required');
    err.status = 400;
    throw err;
  }
  if (!password || password.length < 8) {
    const err = new Error('Password must be at least 8 characters');
    err.status = 400;
    throw err;
  }
}

function login(email, password) {
  validateCredentials(email, password);
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }
  const token = sign({ sub: user.id, email: user.email, exp: Date.now() + TOKEN_TTL_MS });
  return { token, user: { id: user.id, name: user.name, email: user.email } };
}

function register({ name, email, password }) {
  validateCredentials(email, password);
  if (!name || !name.trim()) {
    const err = new Error('Name is required');
    err.status = 400;
    throw err;
  }
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    const err = new Error('An account with this email already exists');
    err.status = 409;
    throw err;
  }
  const user = { id: `u-${users.length + 1}`, name: name.trim(), email, password };
  users.push(user);
  return login(email, password);
}

module.exports = { login, register, verifyToken };
