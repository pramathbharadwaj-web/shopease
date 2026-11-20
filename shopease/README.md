# ShopEase

A lightweight e-commerce storefront: **React (Vite)** frontend + **Node/Express** REST API.

## Features

- Email/password sign-in with signed, expiring tokens
- Product catalog with search, sorting and in-stock filtering
- Cart with quantity limits and stock checks
- Coupons (`WELCOME10`, `SAVE20`, `FREESHIP`), tax and free-shipping rules
- Checkout with address validation, order history and cancellation

## Project structure

```
shopease/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── components/     # Header, LoginForm, ProductList, ProductCard, Cart, CheckoutForm
│       ├── api.js          # API client
│       └── App.jsx
└── server/                 # Express REST API
    └── src/
        ├── routes/         # auth, products, cart, orders
        ├── services/       # business logic
        ├── middleware/     # auth, error handling
        ├── utils/pricing.js
        └── data/           # in-memory seed data
```

## Getting started

```bash
npm install
npm run dev
```

- Web app: http://localhost:5173
- API: http://localhost:4000/api

Demo login: `jane@shopease.dev` / `Passw0rd!`

## API overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Sign in, returns token |
| POST | `/api/auth/register` | Create an account |
| GET | `/api/products` | List products (`search`, `category`, `sort`, `inStock`) |
| GET | `/api/products/:id` | Product details |
| GET | `/api/cart` | Current cart + totals (`?coupon=`) |
| POST | `/api/cart/items` | Add item |
| PATCH | `/api/cart/items/:productId` | Update quantity |
| DELETE | `/api/cart/items/:productId` | Remove item |
| POST | `/api/orders` | Place order |
| GET | `/api/orders` | Order history |
| POST | `/api/orders/:id/cancel` | Cancel an order |
