const {
    getUserCartService,
    addToCartService,
    removeFromCartService,
    clearCartService,
} = require("../cart/services");

const getCart = async (req, res) => {
    try {
        const cart = await getUserCartService(req.user.id);
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const addToCart = async (req, res) => {
    try {
        const cart = await addToCartService(req.user.id, req.body);
        res.status(200).json({
           success: true,
           message: "Item added to cart successfully",
           data: cart, 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const cart = await removeFromCartService(
            req.user.id,
            req.params.productId
        );
        res.status(200).json({
            success: true,
            message: "Item removed",
            data: cart,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const clearCart = async (req, res) => {
    try {
        await clearCartService(req.user.id);
        res.status(200).json({
            success: true,
            message: "Cart cleared",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    removeFromCart,
    clearCart,
};