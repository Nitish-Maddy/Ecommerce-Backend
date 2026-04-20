<div align="center">

# 🛒 TBS Veda — E-Commerce Platform

**A full-stack e-commerce application built with React, Node.js, Express, and MongoDB**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?logo=mongodb&logoColor=white)](https://mongoosejs.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-0C2451?logo=razorpay&logoColor=white)](https://razorpay.com)

---

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure) · [API Reference](#-api-reference) · [Deployment](#-deployment) · [Contributing](#-contributing) · [License](#-license)

</div>

---

## ✨ Features

### 🛍️ Storefront
- **Hero Carousel** — Dynamic hero banners with promotional content
- **Product Catalog** — Browse products by category, brand, collection, and search
- **Product Details** — Rich product pages with image galleries, reviews, and related products
- **Best Sellers & New Launches** — Curated product sections with smart fallbacks
- **Mega Offers** — Dedicated offer pages with promotional pricing

### 🛒 Shopping Experience
- **Cart Management** — Add, update, and remove products with real-time totals
- **Wishlist** — Save products for later with persistent storage
- **Coupon System** — Apply discount codes at checkout
- **Checkout Flow** — Multi-step checkout with address selection and order summary

### 💳 Payments
- **Razorpay Integration** — Secure payment processing with order verification
- **Order Confirmation** — Post-payment success pages with order details

### 👤 User Account
- **Authentication** — JWT-based login and registration
- **Profile Dashboard** — View and edit personal information
- **Order Management** — View current orders, order history, and detailed order info
- **Order Tracking** — Visual tracking timeline for shipments
- **Address Book** — Save, edit, and manage multiple delivery addresses
- **Payment Methods** — Manage saved payment methods
- **Account Settings** — Change password and profile preferences

### 📧 Engagement
- **Newsletter** — Email subscription via SMTP (Nodemailer)
- **Testimonials** — Customer review slider
- **Trust Badges** — Social proof and credibility indicators
- **Contact Us** — Customer support contact page

### 🔧 Admin & Backend
- **Admin Dashboard** — Manage products, categories, brands, and orders
- **Notifications System** — Configurable notification management
- **Settings API** — Dynamic site settings and configuration
- **Image Uploads** — Static file serving for product images

---

## 🧰 Tech Stack

### Frontend

| Technology | Purpose |
|:-----------|:--------|
| **React 18** | UI framework with functional components & hooks |
| **TypeScript** | Type-safe development |
| **Vite 6** | Lightning-fast dev server & build tool |
| **Tailwind CSS 4** | Utility-first styling with custom theme |
| **React Router 7** | Client-side routing with nested layouts |
| **Radix UI** | Accessible, unstyled UI primitives (48+ components) |
| **MUI (Material UI)** | Additional UI components & icons |
| **Framer Motion** | Smooth animations & transitions |
| **Recharts** | Data visualization & charts |
| **Swiper / Embla** | Touch-friendly carousels & sliders |
| **React Hook Form** | Performant form handling |
| **Sonner** | Toast notification system |
| **Lucide React** | Beautiful icon library |

### Backend

| Technology | Purpose |
|:-----------|:--------|
| **Node.js** | Server runtime |
| **Express 5** | HTTP framework with async route handling |
| **MongoDB + Mongoose 9** | NoSQL database & ODM |
| **JWT (jsonwebtoken)** | Stateless token-based authentication |
| **bcrypt** | Secure password hashing |
| **Razorpay SDK** | Payment gateway integration |
| **Nodemailer** | Transactional emails (SMTP/Gmail) |
| **Morgan** | HTTP request logging |
| **Slugify** | URL-friendly slug generation |
| **dotenv** | Environment variable management |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **MongoDB** — Local instance or [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Razorpay Account** — For payment processing ([Dashboard](https://dashboard.razorpay.com))
- **Gmail App Password** — For newsletter emails ([Guide](https://support.google.com/accounts/answer/185833))

### 1. Clone the Repository

```bash
git clone https://github.com/Nitish-Maddy/Ecommerce-Backend.git
cd Ecommerce-Backend
```

### 2. Setup the Backend

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory:

```env
# Server
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/tbsveda

# Authentication
JWT_SECRET=your_jwt_secret_key_change_in_production

# File Uploads
BASE_URL=http://localhost:5000/uploads/

# Application URLs
APP_BASE_URL=http://localhost:5000
FRONTEND_BASE_URL=http://localhost:5173

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_FROM="TBS Veda <your_email@gmail.com>"
```

Start the backend server:

```bash
npm start
```

> The backend runs at **http://localhost:5000**. Verify with a GET request to `/` — you should see `Meenova API is running 🚀`.

### 3. Setup the Frontend

```bash
# From the project root (not Backend/)
npm install
```

Start the development server:

```bash
npm run dev
```

> The frontend runs at **http://localhost:5173**. Vite automatically proxies `/api`, `/auth`, and `/uploads` requests to the backend.

### 4. Build for Production

```bash
npm run build
```

The production bundle is output to the `dist/` folder, ready to be deployed to any static hosting provider.

---

## 📁 Project Structure

```
TBS-Veda/
├── Backend/                        # Express.js REST API
│   ├── api/                        # API modules (domain-driven)
│   │   ├── admin/                  #   Admin management
│   │   ├── brand/                  #   Brand CRUD
│   │   ├── cart/                   #   Shopping cart
│   │   ├── category/              #   Product categories
│   │   ├── coupon/                #   Discount coupons
│   │   ├── middleware/            #   Shared middleware (auth, etc.)
│   │   ├── newsletter/           #   Email subscriptions
│   │   ├── notifications/        #   Notification system
│   │   ├── order/                #   Order management
│   │   ├── product/              #   Product CRUD & search
│   │   ├── review/               #   Product reviews
│   │   ├── setting/              #   Site settings
│   │   ├── subcategory/          #   Subcategory management
│   │   ├── user/                 #   User profiles & addresses
│   │   └── wishlist/             #   Wishlist management
│   ├── auth/                      # Authentication module
│   │   ├── controllers/           #   Auth logic
│   │   ├── middleware/            #   JWT verification
│   │   ├── models/                #   Auth-related models
│   │   ├── routes/                #   Auth endpoints
│   │   └── services/              #   Auth services
│   ├── Payment/                   # Razorpay integration
│   │   ├── controllers/           #   Payment logic
│   │   ├── model/                 #   Payment models
│   │   ├── routes/                #   Payment endpoints
│   │   └── services/              #   Payment services
│   ├── config/                    # Database connection
│   ├── server.js                  # Express app entry point
│   ├── package.json               # Backend dependencies
│   └── .cpanel.yml                # cPanel deployment config
│
├── src/                            # React frontend source
│   ├── app/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── ui/                #   Radix-based design system (48 components)
│   │   │   ├── figma/             #   Figma-imported components
│   │   │   ├── Navbar.tsx         #   Three-tier navigation bar
│   │   │   ├── Footer.tsx         #   Site footer with links & payment icons
│   │   │   ├── ProductCard.tsx    #   Product display card
│   │   │   ├── HeroSection.tsx    #   Homepage hero carousel
│   │   │   └── ...                #   And more
│   │   ├── pages/                 # Route-level page components
│   │   │   ├── account/           #   Account dashboard pages (9 pages)
│   │   │   ├── Home.tsx           #   Landing page
│   │   │   ├── Shop.tsx           #   Product listing
│   │   │   ├── ProductDetail.tsx  #   Product detail page
│   │   │   ├── Cart.tsx           #   Shopping cart
│   │   │   ├── Checkout.tsx       #   Checkout flow
│   │   │   └── ...                #   And more (17 pages)
│   │   ├── context/               # React Context providers
│   │   │   ├── AuthContext.tsx    #   Authentication state
│   │   │   └── ShopContext.tsx    #   Shopping state (cart, wishlist)
│   │   ├── services/              # API client layer
│   │   │   └── api.ts             #   Centralized API service
│   │   ├── data/                  # Static / seed data
│   │   └── App.tsx                # Root component & routes
│   ├── styles/                    # Global styles & theme
│   └── main.tsx                   # Application entry point
│
├── public/                         # Static assets (logo, etc.)
├── index.html                      # HTML shell
├── vite.config.ts                  # Vite + Tailwind + proxy config
├── package.json                    # Frontend dependencies
└── .gitignore                      # Git exclusion rules
```

---

## 📡 API Reference

All API endpoints are prefixed with `/api/v1` unless noted otherwise.

### Authentication

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/api/v1/users/login` | Login with email & password |
| `POST` | `/api/v1/users/register` | Register a new account |
| `GET` | `/api/v1/auth/...` | Auth-related routes |

### Products

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/api/v1/products` | List all products (with filters) |
| `GET` | `/api/v1/products/:id` | Get product by ID |
| `GET` | `/api/v1/products/slug/:slug` | Get product by URL slug |
| `GET` | `/api/v1/products/bestsellers` | Get best-selling products |
| `GET` | `/api/v1/products/newlylaunched` | Get newly launched products |
| `GET` | `/api/v1/products/megaoffers` | Get mega offer products |
| `GET` | `/api/v1/products/category/:id` | Get products by category |
| `GET` | `/api/v1/products/:id/related` | Get related products |
| `GET` | `/api/v1/products/search` | Search products by query |

### Categories & Brands

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/api/v1/categories` | List all categories |
| `GET` | `/api/v1/categories/active` | List active categories |
| `GET` | `/api/v1/categories/slug/:slug` | Get category by slug |
| `GET` | `/api/v1/brands` | List all brands |
| `GET` | `/api/v1/subcategories` | List all subcategories |

### Cart & Wishlist

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/api/v1/cart` | Get user's cart |
| `POST` | `/api/v1/cart/add` | Add item to cart |
| `DELETE` | `/api/v1/cart/remove/:id` | Remove item from cart |
| `DELETE` | `/api/v1/cart/clear` | Clear entire cart |
| `GET` | `/api/v1/wishlist` | Get user's wishlist |
| `POST` | `/api/v1/wishlist` | Add item to wishlist |
| `DELETE` | `/api/v1/wishlist/:id` | Remove from wishlist |

### Orders

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/api/v1/orders` | Create a new order |
| `GET` | `/api/v1/orders` | List all orders (admin) |
| `GET` | `/api/v1/orders/my-orders` | Get current user's orders |
| `GET` | `/api/v1/orders/:id` | Get order details |
| `PATCH` | `/api/v1/orders/:id/cancel` | Cancel an order |

### Reviews

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/api/v1/reviews/product/:id` | Get reviews for a product |
| `POST` | `/api/v1/reviews` | Submit a review |
| `DELETE` | `/api/v1/reviews/:id` | Delete a review |

### Payments (Razorpay)

> ⚠️ Payment routes are under `/api/payments` (not `/api/v1`).

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/api/payments/create-order` | Create Razorpay payment order |
| `POST` | `/api/payments/verify` | Verify payment signature |

### Other

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/api/v1/newsletter/subscribe` | Subscribe to newsletter |
| `*` | `/api/v1/coupons` | Coupon management |
| `*` | `/api/v1/settings` | Site settings |
| `*` | `/api/v1/notifications` | Notification management |
| `*` | `/api/v1/admin` | Admin dashboard APIs |

---

## 🌐 Deployment

### Frontend

Build the production bundle and deploy to any static hosting:

```bash
npm run build
# Output → dist/
```

Compatible with **Vercel**, **Netlify**, **GitHub Pages**, **Cloudflare Pages**, and more.

Set the `VITE_API_URL` environment variable to point to your production backend:

```env
VITE_API_URL=https://your-api-domain.com
```

### Backend

The backend includes a `.cpanel.yml` for **cPanel Git deployment**. It deploys the following to `public_html/`:

- `api/`, `auth/`, `config/`, `Payment/` directories
- `server.js`, `package.json`, `package-lock.json`

For other hosting providers (Railway, Render, DigitalOcean, etc.), ensure:

1. Node.js 18+ is available
2. Environment variables are configured
3. `npm start` runs the server
4. MongoDB is accessible from the server

---

## 🔐 Environment Variables

### Backend (`Backend/.env`)

| Variable | Description | Required |
|:---------|:------------|:--------:|
| `PORT` | Server port (default: 5000) | ✅ |
| `MONGO_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | Secret key for JWT signing | ✅ |
| `BASE_URL` | Base URL for uploaded files | ✅ |
| `APP_BASE_URL` | Backend application URL | ✅ |
| `FRONTEND_BASE_URL` | Frontend application URL | ✅ |
| `RAZORPAY_KEY_ID` | Razorpay API key | 💳 |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret | 💳 |
| `SMTP_HOST` | Email SMTP host | 📧 |
| `SMTP_PORT` | Email SMTP port | 📧 |
| `SMTP_USER` | Email sender address | 📧 |
| `SMTP_PASS` | Email sender password | 📧 |
| `SMTP_FROM` | Email "From" display name | 📧 |

### Frontend (optional)

| Variable | Description | Default |
|:---------|:------------|:--------|
| `VITE_API_URL` | Backend API base URL | Uses Vite proxy in dev |

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">

**Built with ❤️ by [Nitish-Maddy](https://github.com/Nitish-Maddy)**

⭐ Star this repo if you found it helpful!

</div>