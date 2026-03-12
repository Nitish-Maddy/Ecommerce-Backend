const express = require("express");
const {
     getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
} = require("../wishlist/controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, getWishlist);
router.post("/", authMiddleware, addToWishlist);
router.delete("/:productId", authMiddleware, removeFromWishlist);
router.delete("/", authMiddleware, clearWishlist);

module.exports = router;
