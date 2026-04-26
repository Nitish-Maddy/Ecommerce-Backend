const express = require("express");
const {
    getCart,
    addToCart,
    removeFromCart,
    clearCart,
} = require("./controller");

const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

router.get("/", authMiddleware, getCart);
// Support both POST / and POST /add
router.post("/", authMiddleware, addToCart);
router.post("/add", authMiddleware, addToCart);
router.delete("/remove/:productId", authMiddleware, removeFromCart);
router.delete("/clear", authMiddleware, clearCart);

module.exports = router;