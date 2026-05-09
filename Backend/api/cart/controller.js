const {
    getUserCartService,
    addToCartService,
    removeFromCartService,
    clearCartService,
} = require("./services");

const getCart = async (req, res) => {
    try {
        const userId = req.user?.id || req.query.userId || req.body?.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required (or provide a Bearer token).",
            });
        }
        const cart = await getUserCartService(userId);
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const addToCart = async (req, res) => {
    try {
        const userId = req.user?.id || req.body?.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required (or provide a Bearer token).",
            });
        }
        const cart = await addToCartService(userId, req.body);
        res.status(200).json({
           success: true,
           message: "Item added to cart successfully",
           data: cart, 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const userId = req.user?.id || req.body?.userId || req.query.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required (or provide a Bearer token).",
            });
        }
        const cart = await removeFromCartService(
            userId,
            req.params.productId
        );
        res.status(200).json({
            success: true,
            message: "Item removed",
            data: cart,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const clearCart = async (req, res) => {
    try {
        const userId = req.user?.id || req.body?.userId || req.query.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required (or provide a Bearer token).",
            });
        }
        await clearCartService(userId);
        res.status(200).json({
            success: true,
            message: "Cart cleared",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    removeFromCart,
    clearCart,
};