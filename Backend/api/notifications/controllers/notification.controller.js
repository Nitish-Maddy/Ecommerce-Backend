const emailService = require("../services/email.service");
const whatsappService = require("../services/whatsapp.service");
const helper = require("../utils/notification.helper");


const sendOrderNotification = async (req, res) => {
  try {
    const { email, phone, userId, orderId } = req.body;

    const message = helper.formatOrderMessage(orderId, "SUCCESS");

    // Email
    if (email) {
      await emailService.sendEmail(email, "Order Successful", message);
      if (userId) await helper.saveNotificationRecord({ userId, type: "EMAIL", title: "Order Successful", message });
    }

    // WhatsApp
    if (phone) {
      await whatsappService.sendWhatsApp(phone, message);
      if (userId) await helper.saveNotificationRecord({ userId, type: "WHATSAPP", title: "Order Successful", message });
    }

    res.status(200).json({
      success: true,
      message: "Notification sent successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send notification",
      error: error.message
    });
  }
};

module.exports = {
  sendOrderNotification
};