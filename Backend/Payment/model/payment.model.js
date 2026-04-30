const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: "INR",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "CARD", "UPI", "NETBANKING", "RAZORPAY", "PAYTM", "STRIPE", "PAYPAL"],
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    refundId: String,
    paidAt: Date,
    metadata: {
        type: Map,
        of: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);