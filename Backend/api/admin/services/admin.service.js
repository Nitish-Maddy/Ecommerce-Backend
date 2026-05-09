const User = require("../../user/model/model");
const Order = require("../../order/model");
const Product = require("../../product/model/model");
const Payment = require("../../../Payment/model/payment.model");

const getDashboardStats = async () => {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    
    const revenueData = await Payment.aggregate([
        { $match: { status: "SUCCESS" } },
        { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]);

    return {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue: revenueData.length > 0 ? revenueData[0].totalRevenue : 0
    };
};

const getRecentOrders = async (limit = 5) => {
    return await Order.find().sort("-createdAt").limit(limit).populate("user", "name email");
};

const getRevenueAnalytics = async () => {
    return await Payment.aggregate([
        { $match: { status: "SUCCESS" } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                dailyRevenue: { $sum: "$amount" },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);
};

const getTopProducts = async (limit = 5) => {
    // Basic implementation: top sold products
    return await Product.find().sort("-sold").limit(limit).select("title price sold imgCover");
};

module.exports = {
    getDashboardStats,
    getRecentOrders,
    getRevenueAnalytics,
    getTopProducts
};