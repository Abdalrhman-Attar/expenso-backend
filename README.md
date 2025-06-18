# 🧠 Expenso Backend

This is the backend server for the Expenso personal finance tracker. It exposes RESTful API endpoints and integrates with Auth0 for authentication and role-based access control.

---

## 🔧 Tech Stack

* Node.js + Express
* PostgreSQL (via `pg`)
* Auth0 for authentication and user roles
* JWT (via `express-oauth2-jwt-bearer`)

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set environment variables

Create a `.env` file in the root directory:

```env
PORT=3001
DATABASE_URL=postgresql://username:password@localhost:5432/expenso
AUTH0_DOMAIN=your-auth0-domain
AUTH0_AUDIENCE=your-auth0-api-identifier
AUTH0_MGMT_CLIENT_ID=your-management-client-id
AUTH0_MGMT_CLIENT_SECRET=your-management-client-secret
```

### 3. Start the server

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

---

## 🔐 Authentication

All endpoints (except root) require a valid Auth0-issued JWT.
Send it in the `Authorization` header:

```http
Authorization: Bearer <token>
```

---

## 📦 API Endpoints

### 👤 Users

| Method | Endpoint             | Description                                    |
| ------ | -------------------- | ---------------------------------------------- |
| GET    | `/api/users/me`      | Fetch or create user (auto-creates if missing) |
| PATCH  | `/api/users/me`      | Update name or subscription                    |
| POST   | `/api/users/upgrade` | Upgrade to Premium role (Auth0 + DB)           |

### 💸 Transactions

| Method | Endpoint                | Description                |
| ------ | ----------------------- | -------------------------- |
| GET    | `/api/transactions`     | List all transactions      |
| GET    | `/api/transactions/:id` | Get a specific transaction |
| POST   | `/api/transactions`     | Create a new transaction   |
| PUT    | `/api/transactions/:id` | Update a transaction       |
| DELETE | `/api/transactions/:id` | Delete a transaction       |

### 🗂️ Categories

| Method | Endpoint              | Description                   |
| ------ | --------------------- | ----------------------------- |
| GET    | `/api/categories`     | List all categories           |
| GET    | `/api/categories/:id` | Get a specific category       |
| POST   | `/api/categories`     | Create a new category         |
| PUT    | `/api/categories/:id` | Update a category             |
| DELETE | `/api/categories/:id` | Delete a category (if unused) |

### 🔔 Notifications

| Method | Endpoint                 | Description                 |
| ------ | ------------------------ | --------------------------- |
| GET    | `/api/notifications`     | List all notifications      |
| GET    | `/api/notifications/:id` | Get a specific notification |
| POST   | `/api/notifications`     | Create a new notification   |
| PUT    | `/api/notifications/:id` | Update a notification       |
| DELETE | `/api/notifications/:id` | Delete a notification       |

---

## ✅ Notes

* Role assignment uses Auth0 Management API.
* All database access uses parameterized SQL via `pg`.
* Date columns use `TIMESTAMPTZ` for consistency.
* Notification triggers can be set in business logic (e.g., low balance).

---

## 📁 File Structure

```
expenso-backend/
├── db.js
├── index.js
├── .env
├── routes/
│   ├── users.js
│   ├── transactions.js
│   ├── categories.js
│   └── notifications.js
└── middleware/
    └── auth.js
```

---

## 🛠️ Future Improvements

* WebSocket push notifications
* Admin dashboard endpoints
* Audit logging for role upgrades
