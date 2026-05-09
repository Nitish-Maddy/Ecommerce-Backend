const Payment = require("../model/payment.model");

const createPaymentService = async (data) => {
    return await Payment.create(data);
};

const getPaymentByIdService = async (id) => {
    return await Payment.findById(id).populate("userId", "name email").populate("orderId");
};

const getPaymentsByUserService = async (userId) => {
    return await Payment.find({ userId }).sort("-createdAt");
};

const getPaymentByOrderService = async (orderId) => {
    return await Payment.findOne({ orderId });
};

const updatePaymentStatusService = async (id, status, extraData = {}) => {
    return await Payment.findByIdAndUpdate(
        id,
        { status, ...extraData },
        { new: true }
    );
};

const processRefundService = async (id, refundId) => {
    return await Payment.findByIdAndUpdate(
        id,
        { status: "REFUNDED", refundId },
        { new: true }
    );
};

module.exports = {
    createPaymentService,
    getPaymentByIdService,
    getPaymentsByUserService,
    getPaymentByOrderService,
    updatePaymentStatusService,
    processRefundService
};