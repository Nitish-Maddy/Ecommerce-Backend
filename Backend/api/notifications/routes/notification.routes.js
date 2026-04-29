const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const { authMiddleware } = require("../../middleware/auth");

router.post("/send-notification", authMiddleware, notificationController.sendOrderNotification);
router.post("/", authMiddleware, notificationController.sendOrderNotification);

module.exports = router;