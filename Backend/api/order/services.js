const Model = require("./model");

// CREATE ORDER (invoice auto-generate)
const create = async (body) => {
  if (!body.invoiceNumber) {
    body.invoiceNumber = `INV-${Date.now()}`;
  }

  return await Model.create(body);
};

// ASSIGN DELIVERY PARTNER & TRACKING
const assignDelivery = async (id, deliveryData) => {
  /*
    deliveryData = {
      deliveryPartner,
      trackingId,
      expectedDeliveryDate
    }
  */

  return await Model.findByIdAndUpdate(
    id,
    {
      deliveryPartner: deliveryData.deliveryPartner,
      trackingId: deliveryData.trackingId,
      expectedDeliveryDate: deliveryData.expectedDeliveryDate,
      orderStatus: "SHIPPED",
    },
    { new: true }
  );
};

// GET SINGLE ORDER
const getone = async (id) => {
  return await Model.findById(id)
    .populate("user", "name email")
    .populate("orderItems.product", "title price image");
};

// GET ALL ORDERS
const getAll = async () => {
  return await Model.find({}).sort({ createdAt: -1 });
};

// GET MY ORDERS
const getMyOrders = async (userId) => {
  return await Model.find({ user: userId }).sort({ createdAt: -1 });
};

// UPDATE ORDER (generic)
const update = async (body, id) => {
  return await Model.findByIdAndUpdate(id, body, { new: true });
};

// UPDATE EXPECTED DELIVERY DATE ONLY
const updateExpectedDelivery = async (id, date) => {
  return await Model.findByIdAndUpdate(
    id,
    { expectedDeliveryDate: date },
    { new: true }
  );
};

// DELETE ORDER
const deleteone = async (id) => {
  return await Model.findByIdAndDelete(id);
};

// DELETE ALL ORDERS
const deleteAll = async () => {
  return await Model.deleteMany({});
};

module.exports = {
  create,
  assignDelivery,
  getone,
  getAll,
  getMyOrders,
  update,
  updateExpectedDelivery,
  deleteone,
  deleteAll,
};
