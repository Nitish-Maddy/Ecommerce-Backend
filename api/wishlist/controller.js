const {
     getWishlistService,
    addToWishlistService,
    removeFromWishlistService,
    clearWishlistService,
} = require("../wishlist/services");


const getWishlist = async (req, res) => {
    try {
      const wishlist = await getWishlistService(req.user.id);
      res.status(200).json({ success: true, data: wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const addToWishlist = async (req, res) => {
    try {
        const result = await addToWishlistService(
            req.user.id,
            req.body.productId
        );

        if (result.alreadyExists)
            return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
        data: result.wishlist,
    });


     res.status(200).json({
        success: true,
        message: "Product added to wishlist",
        data: result,
    });
} catch (error) {
    res.status(500).json({ success: false, message: error.message });
}
};


const removeFromWishlist = async (req, res) => {
 try {
    const wishlist = await removeFromWishlistService(
        req.user.id,
        req.params.productId
    );

    if (!wishlist) {
        return res.status(404).json({
            success: false,
            message: "Wishlist not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "Product removed from wishlist",
        data: wishlist,
    });
 } catch (error) {
    res.status(500).json({ success: false, message: error.message });
 }
};


const clearWishlist = async (req, res) => {
    try {
        await clearWishlistService(req.user.id);
        res.status(200).json({
            success: true,
            message: "Wishlist cleared",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
};

