const express = require("express");
const {
     getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
} = require("./controller");

const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

router.get("/", authMiddleware, getWishlist);
router.post("/", authMiddleware, addToWishlist);
router.delete("/:productId", authMiddleware, removeFromWishlist);
router.delete("/", authMiddleware, clearWishlist);

module.exports = router;
