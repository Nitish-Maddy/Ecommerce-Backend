const express = require("express");
const {
    createCoupon,
    getAllCoupons,
    getActiveCoupons,
    getCouponById,
    getCouponByCode,
    validateCoupon,
    applyCoupon,
    updateCoupon,
    deleteCoupon,
} = require("./controller");

const { authMiddleware, authorize } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getAllCoupons);
router.get("/active", getActiveCoupons);
router.get("/code/:code", getCouponByCode);
router.get("/:id", getCouponById);
router.post("/validate", validateCoupon);
router.post("/apply", applyCoupon);

// Admin-only routes
router.post("/", authMiddleware, authorize("admin"), createCoupon);
router.put("/:id", authMiddleware, authorize("admin"), updateCoupon);
router.delete("/:id", authMiddleware, authorize("admin"), deleteCoupon);

module.exports = router;
