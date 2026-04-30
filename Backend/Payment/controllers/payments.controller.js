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

let _razorpay = null;
function getRazorpay() {
    if (!_razorpay) {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            throw new Error("Razorpay API keys are missing in .env");
        }

        _razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }

    return _razorpay;
}

const createRazorpayOrder = async (req, res) => {
    try {
        const { amount, currency = "INR", receipt } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: "Valid amount is required" });
        }

        const options = {
            amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
        };
        
        console.log("📦 Creating Razorpay order:", options);
        const order = await getRazorpay().orders.create(options);
        console.log("✅ Razorpay order created:", order.id);
        
        res.status(200).json({ 
            success: true, 
            data: { ...order, key_id: process.env.RAZORPAY_KEY_ID } 
        });
    } catch (error) {
        console.error("❌ Razorpay create-order error:", error.statusCode, error.error || error.message);
        const statusCode = error.statusCode === 401 ? 401 : 500;
        const message = error.statusCode === 401 
            ? "Razorpay authentication failed — check your API keys in .env"
            : error.message || "Failed to create Razorpay order";
        res.status(statusCode).json({ success: false, message });
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