const express = require("express");
const {
    getCart,
    addToCart,
    removeFromCart,
    clearCart,
} = require("../cart/controller");

const router = express.Router();

router.get("/", getCart);
router.post("/add", addToCart);
router.delete("/remove/:productId", removeFromCart);
router.delete("/clear", clearCart);

module.exports = router;