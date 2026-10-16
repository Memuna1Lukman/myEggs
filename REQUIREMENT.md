# Egg Ordering Website: Build Plan

A role-based web app where customers order crates of eggs and the admin (me) receives and manages the orders.

**Stack:** FastAPI (backend), React (frontend), PostgreSQL (SQLite is fine while developing)

**Goal for version 1:** keep it small, finish it, and start taking real orders. Add extra features later.

---

## 1. Roles and what each can do

### Customer
- [ ] Register and log in (name, phone, password)
- [ ] Browse products (crate sizes, price, stock status)
- [ ] Add to cart and place an order with delivery address, phone, and notes
- [ ] View order history and the status of each order
- [ ] Cancel an order while it is still `pending`

### Admin
- [ ] Log in to a separate admin dashboard
- [ ] See all orders, filter by status or date
- [ ] Update order status: `pending -> confirmed -> out for delivery -> delivered` (or `cancelled`)
- [ ] Manage products: add, edit price, mark in or out of stock
- [ ] See simple stats: orders today, total revenue, pending count

---

## 2. Data models (database tables)

**User**
- id, name, phone, email (optional), hashed_password, role (`customer` / `admin`), created_at

**Product**
- id, name (e.g. "Small crate, 30 eggs"), description, price, in_stock, image_url

**Order**
- id, user_id, status, total_amount, delivery_address, phone, note, payment_method, payment_status, created_at

**OrderItem**
- id, order_id, product_id, quantity, unit_price
- Store the price at the time of the order so old orders do not change when prices change.

---

## 3. Backend (FastAPI)

**Packages:** FastAPI, SQLAlchemy, Alembic (migrations), Pydantic, PostgreSQL driver, `passlib[bcrypt]` for password hashing, `python-jose` or PyJWT for tokens.

### Endpoints

| Method | Route | Who |
|---|---|---|
| POST | `/auth/register` | public |
| POST | `/auth/login` | public |
| GET | `/auth/me` | logged in |
| GET | `/products` | public |
| POST / PUT / DELETE | `/products` | admin only |
| POST | `/orders` | customer |
| GET | `/orders/my` | customer |
| GET | `/orders` (with filters) | admin only |
| PATCH | `/orders/{id}/status` | admin only |
| GET | `/admin/stats` | admin only |

### Role-based access
- Write a reusable dependency, e.g. `require_admin`, that decodes the JWT, checks `role == "admin"`, and returns 403 otherwise.
- Use it on every admin route.
- Never trust a role sent from the frontend. Only the token decides.

---

## 4. Frontend (React)

**Packages:** React with Vite, React Router, Axios or fetch, Tailwind or plain CSS. Use React Context or Zustand for auth and cart state.

### Pages
- **Public:** Home / Products, Login, Register
- **Customer:** Cart, Checkout, My Orders
- **Admin:** Dashboard, Orders list (with status dropdown), Manage Products

### Protected routes
- Build a `ProtectedRoute` component that checks whether the user is logged in and has the right role, and redirects otherwise.
- This only hides pages. The real security is on the backend.

---

## 5. Things people forget (worth learning)

- [ ] Hash passwords, never store them in plain text
- [ ] Validate all inputs with Pydantic
- [ ] Set up CORS correctly between React and FastAPI
- [ ] Keep secrets (JWT secret, DB URL) in a `.env` file and never commit it to Git (add it to `.gitignore`)
- [ ] Create the admin account with a seed script, not public sign-up
- [ ] Rate-limit login attempts if possible

---

## 6. Payments: keep it simple at first

Skip online payment integration in version 1.
- Offer **pay on delivery** and **manual transfer / mobile money**.
- The customer pays, then I mark `payment_status = paid` in the admin panel.
- Add a payment gateway later, once I have real customers.

---

## 7. Build order (one step at a time, commit to Git after each)

1. [ ] **Backend setup:** project structure, DB connection, models, migrations
2. [ ] **Auth:** register, login, JWT, `require_admin`
3. [ ] **Products API:** test it in FastAPI's `/docs`
4. [ ] **Orders API:** with the status flow
5. [ ] **React:** auth pages, then product list, cart, checkout
6. [ ] **Admin dashboard:** orders table and status updates
7. [ ] **Polish and deploy:** frontend on Vercel or Netlify, backend on Render or Railway, database on their Postgres

### Suggested folder structure

```
egg-shop/
  backend/
    app/
      main.py
      database.py
      models.py
      schemas.py
      auth.py
      routers/
        auth.py
        products.py
        orders.py
        admin.py
    seed_admin.py
    requirements.txt
    .env
  frontend/
    src/
      api/

      
      components/
      context/
      pages/
      App.jsx
    package.json
```

---

## 8. Later features (not now)

- Order notifications to WhatsApp or email
- Delivery fee by area
- Discounts for bulk crates
- Product image upload
- Customer reviews
- Payment gateway

---

## Working habits

- Build one numbered step at a time and finish it before moving on.
- Commit to Git after every step.
- Code a little every day. Consistency beats long, rare sessions.
- When stuck, paste the code and the error message and ask for help debugging.

Bismillah, start small and keep going.