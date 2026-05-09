const {
    createPaymentService,
    getPaymentByIdService,
    getPaymentsByUserService,
    getPaymentByOrderService,
    updatePaymentStatusService,
    processRefundService
} = require("../services/payment.service");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "YOUR_KEY_ID",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "YOUR_KEY_SECRET",
});

const createRazorpayOrder = async (req, res) => {
    try {
        const { amount, currency = "INR", receipt } = req.body;
        
        const options = {
            amount: amount * 100, // amount in the smallest currency unit (paise)
            currency,
            receipt,
        };
        
        const order = await razorpay.orders.create(options);
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createPayment = async (req, res) => {
    try {
        const paymentData = { ...req.body, userId: req.user.id };
        const payment = await createPaymentService(paymentData);
        res.status(201).json({ success: true, data: payment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getPaymentDetails = async (req, res) => {
    try {
        const payment = await getPaymentByIdService(req.params.id);
        if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
        
        // Security check: Only owner or admin
        if (payment.userId._id.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        res.status(200).json({ success: true, data: payment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getUserPayments = async (req, res) => {
    try {
        const payments = await getPaymentsByUserService(req.user.id);
        res.status(200).json({ success: true, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

 const getOrderPayment = async (req, res) => {
    try {
        const payment = await getPaymentByOrderService(req.params.id);
        if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
        
        // Security check: Only owner or admin
        if (payment.userId._id.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        res.status(200).json({ success: true, data: payment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
 }; 

const verifyPayment = async (req, res) => {
    try {
        const { paymentId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
        
        const body = razorpayOrderId + "|" + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "YOUR_KEY_SECRET")
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpaySignature;

        if (isAuthentic) {
            const extraData = { 
                paidAt: new Date(),
                razorpayOrderId,
                razorpayPaymentId,
                razorpaySignature
            };
            const payment = await updatePaymentStatusService(paymentId, "SUCCESS", extraData);
            res.status(200).json({ success: true, message: "Payment verified successfully", data: payment });
        } else {
            await updatePaymentStatusService(paymentId, "FAILED");
            res.status(400).json({ success: false, message: "Invalid payment signature" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const refundPayment = async (req, res) => {
    try {
        const { paymentId, refundId } = req.body;
        const payment = await processRefundService(paymentId, refundId);
        res.status(200).json({ success: true, message: "Refund processed", data: payment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createRazorpayOrder,
    createPayment,
    getPaymentDetails,
    getUserPayments,
    getOrderPayment,
    verifyPayment,
    refundPayment
};