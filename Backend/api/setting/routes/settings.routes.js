const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settings.controller");
const { authMiddleware } = require("../../middleware/auth");

router.use(authMiddleware);

router.get("/", settingsController.getSettings);
router.put("/", settingsController.updateSettings);
router.get("/settings", settingsController.getSettings);
router.put("/settings", settingsController.updateSettings);

module.exports = router;