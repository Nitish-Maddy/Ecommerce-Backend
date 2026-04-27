const services = require("./services");
const mongoose = require("mongoose");
const Product = require("../product/model/model");

/** 24-char hex only — avoids mongoose.isValid accepting invalid strings like "1". */
function isStrictObjectId(id) {
  if (id === undefined || id === null) return false;
  const s = String(id).trim();
  return /^[0-9a-fA-F]{24}$/.test(s);
}

function isValidObjectId(id) {
  return typeof id === "string" && mongoose.Types.ObjectId.isValid(id);
}

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Resolve cart line to a real Product _id (DB) when frontend sends slug/title/demo ids.
 */
async function resolveProductIdForCartItem(item) {
  const raw = item.product || item.productId;
  const rawObj = raw && typeof raw === "object" ? raw : null;
  const candidateId =
    rawObj?._id ||
    rawObj?.id ||
    item._id ||
    item.id ||
    (typeof raw === "string" ? raw : null);

  if (isStrictObjectId(candidateId)) {
    const exists = await Product.exists({ _id: candidateId });
    if (!exists) {
      throw new Error(`Product not found for id: ${candidateId}`);
    }
    return String(candidateId).trim();
  }

  const candidateSlug =
    item.slug ||
    rawObj?.slug ||
    (typeof raw === "string" && !/^\d+$/.test(raw) ? raw : "");
  if (candidateSlug && String(candidateSlug).trim()) {
    const slug = String(candidateSlug).trim().toLowerCase();
    const p = await Product.findOne({ slug }).select("_id").lean();
    if (p) return String(p._id);
  }

  const title = (
    item.title ||
    item.name ||
    rawObj?.title ||
    rawObj?.name ||
    ""
  ).trim();
  if (title) {
    let p = await Product.findOne({
      title: new RegExp(`^${escapeRegex(title)}$`, "i"),
    })
      .select("_id")
      .lean();
    if (!p) {
      p = await Product.findOne({
        title: new RegExp(escapeRegex(title), "i"),
      })
        .select("_id")
        .lean();
    }
    if (p) return String(p._id);
  }

  throw new Error(
    "Invalid or unknown product in cart. Use catalog products (real IDs) or ensure titles match your database."
  );
}

async function mapCartItemsToOrderItems(cartItems = []) {
  const out = [];
  for (const item of cartItems) {
    const raw = item.product || item.productId;
    const rawObj = raw && typeof raw === "object" ? raw : null;
    const productId = await resolveProductIdForCartItem(item);
    const quantity = Number(item.quantity ?? 1);
    const price = Number(item.price ?? 0);
    out.push({
      product: productId,
      title: item.title || item.name || rawObj?.title || rawObj?.name,
      image: item.image || rawObj?.imgCover || rawObj?.image,
      quantity,
      price,
    });
  }
  return out;
}

// ================= CREATE ORDER =================
const create = async (req, res) => {
  try {
    const body = { ...(req.body || {}) };

    // Auto invoice number generate
    body.invoiceNumber = `INV-${Date.now()}`;

    // Attach logged-in user (JWT middleware sets id as ObjectId — normalize to hex string)
    const rawUserId = req.user?.id ?? req.user?._id ?? body.user;
    if (rawUserId == null || rawUserId === "") {
      return res.status(400).json({
        success: false,
        message: "Valid user is required (login required).",
      });
    }
    const userIdStr =
      rawUserId instanceof mongoose.Types.ObjectId
        ? rawUserId.toHexString()
        : String(rawUserId).trim();
    if (!isStrictObjectId(userIdStr)) {
      return res.status(400).json({
        success: false,
        message: "Valid user is required (login required).",
      });
    }
    body.user = userIdStr;

    // Accept frontend payload: { cartItems: [...] } and map to orderItems
    if (!Array.isArray(body.orderItems) || body.orderItems.length === 0) {
      if (Array.isArray(body.cartItems) && body.cartItems.length > 0) {
        body.orderItems = await mapCartItemsToOrderItems(body.cartItems);
      }
    }

    if (!Array.isArray(body.orderItems) || body.orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "orderItems (or cartItems) is required.",
      });
    }

    // Normalize shipping address keys from frontend
    if (body.shippingAddress) {
      body.shippingAddress = {
        fullName: body.shippingAddress.fullName || body.shippingAddress.name,
        phone: body.shippingAddress.phone,
        addressLine:
          body.shippingAddress.addressLine || body.shippingAddress.street,
        city: body.shippingAddress.city,
        state: body.shippingAddress.state,
        pincode: body.shippingAddress.pincode,
        country: body.shippingAddress.country,
      };
    }

    // Compute required prices if missing
    const itemsPrice = body.orderItems.reduce(
      (sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 0),
      0
    );
    body.itemsPrice = Number(body.itemsPrice ?? itemsPrice);
    body.taxPrice = Number(body.taxPrice ?? 0);
    body.shippingPrice = Number(body.shippingPrice ?? 0);
    body.discountPrice = Number(body.discountPrice ?? 0);
    if (!Number.isFinite(body.itemsPrice)) body.itemsPrice = 0;
    if (!Number.isFinite(body.taxPrice)) body.taxPrice = 0;
    if (!Number.isFinite(body.shippingPrice)) body.shippingPrice = 0;
    if (!Number.isFinite(body.discountPrice)) body.discountPrice = 0;
    body.totalPrice = Number(
      body.totalPrice ??
        body.itemsPrice + body.taxPrice + body.shippingPrice - body.discountPrice
    );
    if (!Number.isFinite(body.totalPrice)) {
      body.totalPrice =
        body.itemsPrice + body.taxPrice + body.shippingPrice - body.discountPrice;
    }

    // Default payment method (required by schema)
    body.paymentMethod = (body.paymentMethod || "RAZORPAY").toUpperCase();

    const data = await services.create(body);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data,
    });
  } catch (err) {
    const msg = err?.message || "Error creating order";
    const lower = msg.toLowerCase();
    const isClientError =
      lower.includes("validation") ||
      lower.includes("required") ||
      lower.includes("invalid") ||
      lower.includes("product not found") ||
      lower.includes("unknown product");
    res.status(isClientError ? 400 : 500).json({
      success: false,
      message: isClientError ? msg : "Error creating order",
      details: msg,
    });
  }
};

// ================= GET MY ORDERS =================
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const data = await services.getMyOrders(userId);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching my orders",
      details: err.message,
    });
  }
};

// ================= CANCEL ORDER =================
const cancelOrder = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid order id" });
    }

    const order = await services.getone(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const orderUserId = order.user?._id || order.user;
    if (String(orderUserId) !== String(userId)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const currentStatus = String(order.orderStatus || "PLACED").toUpperCase();
    const cancellable = ["PLACED", "CONFIRMED"].includes(currentStatus);
    if (!cancellable) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled when status is ${currentStatus}`,
      });
    }

    const updated = await services.update(
      { orderStatus: "CANCELLED" },
      id
    );

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
      details: err.message,
    });
  }
};

// ================= GET SINGLE ORDER =================
const getone = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await services.getone(id);
    if (!data) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Error fetching order",
      details: err.message,
    });
  }
};

// ================= GET ALL ORDERS =================
const getAll = async (req, res) => {
  try {
    const data = await services.getAll();

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Error fetching orders",
      details: err.message,
    });
  }
};

// ================= UPDATE ORDER (GENERIC) =================
const update = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    const data = await services.update(body, id);
    if (!data) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Error updating order",
      details: err.message,
    });
  }
};

// ================= ASSIGN DELIVERY DETAILS =================
const assignDelivery = async (req, res) => {
  try {
    const id = req.params.id;
    const { deliveryPartner, trackingId, expectedDeliveryDate } = req.body;

    const data = await services.update(
      {
        deliveryPartner,
        trackingId,
        expectedDeliveryDate,
        orderStatus: "SHIPPED",
      },
      id
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Delivery details updated successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Error assigning delivery",
      details: err.message,
    });
  }
};

// ================= UPDATE EXPECTED DELIVERY DATE ONLY =================
const updateExpectedDeliveryDate = async (req, res) => {
  try {
    const id = req.params.id;
    const { expectedDeliveryDate } = req.body;

    const data = await services.update(
      { expectedDeliveryDate },
      id
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expected delivery date updated",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Error updating delivery date",
      details: err.message,
    });
  }
};

// ================= DELETE SINGLE ORDER =================
const deleteone = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await services.deleteone(id);
    if (!data) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Error deleting order",
      details: err.message,
    });
  }
};

// ================= DELETE ALL ORDERS =================
const deleteAll = async (req, res) => {
  try {
    await services.deleteAll();

    res.status(200).json({
      success: true,
      message: "All orders deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Error deleting all orders",
      details: err.message,
    });
  }
};

// ================= EXPORT =================
module.exports = {
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
};
