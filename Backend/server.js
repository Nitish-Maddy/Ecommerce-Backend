require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
let paymentRoutes = null;
try {
  paymentRoutes = require("./Payment/routes/payment.routes");
} catch (e) {
  console.warn("⚠️  Payments module not loaded:", e.message);
}

// Ensure Mongoose models used via `ref` are registered
require("./api/subcategory/model/model");



// Import routes
const productRoutes = require("./api/product/routes/routes");
const userRoutes = require("./api/user/routes/routes");
const brandRoutes = require("./api/brand/routes");
const cartRoutes = require("./api/cart/routes");
const categoryRoutes = require("./api/category/routes");
const couponRoutes = require("./api/coupon/routes");
const orderRoutes = require("./api/order/routes");
const reviewRoutes = require("./api/review/routes");
const wishlistRoutes = require("./api/wishlist/routes");
const subCategoryRoutes = require("./api/subcategory/routes/routes");
const newsletterRoutes = require("./api/newsletter/routes");
const authRoutes = require("./auth/routes/auth.routes");
const settingsRoutes = require("./api/setting/routes/settings.routes");
const notificationRoutes = require("./api/notifications/routes/notification.routes");
const adminRoutes = require("./api/admin/routes/admin.routes");

const { loginUser } = require("./api/user/controller/login");
const { createUser } = require("./api/user/controller/controller");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Static files (for uploaded images)
app.use("/uploads", express.static("uploads"));

// API Routes — explicit login + signup on app so they always match before the user router (Express 5 / router-safe)
app.post("/api/v1/users/login", loginUser);
app.post("/api/v1/users/register", createUser);
app.post("/api/v1/users", createUser);

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/subcategories", subCategoryRoutes);
app.use("/api/v1/newsletter", newsletterRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/settings", settingsRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/admin", adminRoutes);
if (paymentRoutes) {
  app.use("/api/payments", paymentRoutes);
}

// Health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "Meenova API is running 🚀" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});



// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
