const express = require("express");
const {
     createCategory,
        getAllCategories,
        getActiveCategories,
        getCategoryById,
        getCategoryBySlug,
        getSubcategoriesByParent,
        updateCategory,
        deleteCategory,
} = require("./controller");

const { authMiddleware, authorize } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getAllCategories);
router.get("/active", getActiveCategories);
router.get("/slug/:slug", getCategoryBySlug);
router.get("/:id", getCategoryById);
router.get("/:id/subcategories", getSubcategoriesByParent);

// Admin-only routes
router.post("/", authMiddleware, authorize("admin"), createCategory);
router.put("/:id", authMiddleware, authorize("admin"), updateCategory);
router.delete("/:id", authMiddleware, authorize("admin"), deleteCategory);

module.exports = router;