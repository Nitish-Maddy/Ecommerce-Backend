const express = require("express");
const {
    createSubCategory,
    getAllSubCategories,
    getSubCategoryById,
    getSubCategoriesByCategory,
    updateSubCategory,
    deleteSubCategory,
} = require("../controller/controller");

const router = express.Router();
const { authMiddleware } = require("../../middleware/auth");

router.post("/", authMiddleware, createSubCategory);
router.get("/", getAllSubCategories);
router.get("/category/:categoryId", getSubCategoriesByCategory);
router.get("/:id", getSubCategoryById);
router.put("/:id", authMiddleware, updateSubCategory);
router.delete("/:id", authMiddleware, deleteSubCategory);

module.exports = router;
