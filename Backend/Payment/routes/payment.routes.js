const express = require("express");
const router = express.Router();
const {
    createRazorpayOrder,
    createPayment,
    getPaymentDetails,
    getUserPayments,
    getOrderPayment,
    verifyPayment,
    refundPayment
} = require("../controllers/payments.controller");
const { authMiddleware, authorize } = require("../../api/middleware/auth");

router.use(authMiddleware);

router.post("/create-order", createRazorpayOrder);
router.post("/", createPayment);
router.get("/user", getUserPayments);
router.get("/:id", getPaymentDetails);
router.get("/order/:id", getOrderPayment);
router.post("/verify", verifyPayment);
router.post("/refund", authorize("admin"), refundPayment);

module.exports = router;