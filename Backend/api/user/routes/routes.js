const express = require("express");
const {
    createUser,
    getAllUsers,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser,
    updateUserPassword,
    toggleUserBlocked,
    addAddress,
    updateAddress,
    deleteAddress,
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    toggleNewsletter,
} = require("../controller/controller");

const { authMiddleware, authorize } = require("../../middleware/auth");

const { loginUser } = require("../controller/login");

const router = express.Router();

// Public routes (no auth required) — POST / and POST /register are mounted on app in server.js
router.post("/", createUser);
router.post("/register", createUser);
router.post("/login", loginUser);

// All routes below require authentication
router.use(authMiddleware);

router.get("/email/:email", getUserByEmail);

router.get("/:id/wishlist", getWishlist);
router.post("/:id/wishlist", addToWishlist);
router.delete("/:id/wishlist/:productId",removeFromWishlist);

router.post("/:id/addressess", addAddress);
router.put("/:id/addressess/:addressId", updateAddress);
router.delete("/:id/addressess/:addressId",deleteAddress);

router.patch("/:id/block", toggleUserBlocked);
router.patch("/:id/newsletter", toggleNewsletter);

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.patch("/:id/password", updateUserPassword);

module.exports = router;
