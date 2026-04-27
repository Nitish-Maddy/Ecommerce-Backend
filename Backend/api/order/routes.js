const express = require("express");
const {
  create,
  getMyOrders,
  cancelOrder,
  getone,
  getAll,
  update,
  assignDelivery,
  updateExpectedDeliveryDate,
  deleteone,
  deleteAll,
} = require("./controller");

const { authMiddleware, authorize } = require("../middleware/auth");

const router = express.Router();

router.use("/", authMiddleware);

// Customer routes
router.post("/", authMiddleware, create);
router.get("/my-orders", authMiddleware, getMyOrders);
router.patch("/:id/cancel", authMiddleware, cancelOrder);

// Admin / generic routes
router.get("/", getAll);
router.get("/:id", getone);
router.put("/:id", update);
router.patch("/:id/delivery", assignDelivery);
router.patch("/:id/expected-delivery", updateExpectedDeliveryDate);
router.delete("/:id", deleteone);

router.delete("/", authorize("admin"), deleteAll);

module.exports = router;
