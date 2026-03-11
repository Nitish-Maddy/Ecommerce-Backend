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
} = require("../brand/controller");

const router = express.Router();

router.post("/", createBrand);
router.get("/", getAllBrands);
router.get("/active", getActiveBrands);
router.get("/featured", getFeaturedBrands);
router.get("/:id", getBrandById);
router.get("/slug/:slug", getBrandBySlug);
router.put("/:id", updateBrand);
router.delete("/:id", deleteBrand);

module.exports = router;