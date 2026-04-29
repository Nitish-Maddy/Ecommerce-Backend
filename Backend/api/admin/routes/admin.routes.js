const express = require("express");
const router = express.Router();
const { getDashboard, getAnalytics } = require("../controllers/admin.controller");
const { authMiddleware, authorize } = require("../../middleware/auth");

router.use(authMiddleware);
router.use(authorize("admin"));

router.get("/dashboard", getDashboard);
router.get("/analytics", getAnalytics);

module.exports = router;