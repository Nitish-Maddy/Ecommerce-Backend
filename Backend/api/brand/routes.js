const express = require("express");
const {
    createBrand,
    getAllBrands,
    getActiveBrands,
    getFeaturedBrands,
    getBrandById,
    getBrandBySlug,
    updateBrand,
    deleteBrand,
} = require("./controller");

const { authMiddleware, authorize } = require("../../auth/middleware/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, authorize("admin"), createBrand);
router.get("/", getAllBrands);
router.get("/active", getActiveBrands);
router.get("/featured", getFeaturedBrands);
router.get("/slug/:slug", getBrandBySlug);
router.get("/:id", getBrandById);
router.put("/:id", authMiddleware, authorize("admin"), updateBrand);
router.delete("/:id", authMiddleware, authorize("admin"), deleteBrand);

module.exports = router;