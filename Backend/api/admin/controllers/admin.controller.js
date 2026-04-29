const {
    getDashboardStats,
    getRecentOrders,
    getRevenueAnalytics,
    getTopProducts
} = require("../services/admin.service");

const getDashboard = async (req, res) => {
    try {
        const stats = await getDashboardStats();
        const recentOrders = await getRecentOrders();
        res.status(200).json({ success: true, data: { stats, recentOrders } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAnalytics = async (req, res) => {
    try {
        const revenue = await getRevenueAnalytics();
        const topProducts = await getTopProducts();
        res.status(200).json({ success: true, data: { revenue, topProducts } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getDashboard,
    getAnalytics
};