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
} = require("../category/controller");

const router = express.Router();

router.post("/", createCategory);
router.get("/", getAllCategories);
router.get("/active", getActiveCategories);
router.get("/slug/:slug", getCategoryBySlug);
router.get("/:id", getCategoryById);
router.get("/:id/subcategories", getSubcategoriesByParent);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;