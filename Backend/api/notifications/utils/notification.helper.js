const Notification = require("../models/notification.model");

/**
 * Saves a notification to the database and optionally formats it
 */
const saveNotificationRecord = async (data) => {
    try {
        const notification = new Notification({
            userId: data.userId,
            type: data.type,
            title: data.title,
            message: data.message,
            data: data.metaData
        });
        await notification.save();
        return notification;
    } catch (error) {
        console.error("Error saving notification to DB:", error);
        // Do not throw, as we don't want to crash the main flow if DB logging fails
    }
};

const formatOrderMessage = (orderId, status) => {
    return `Your order #${orderId} status has been updated to: ${status}.`;
};

module.exports = {
    saveNotificationRecord,
    formatOrderMessage
};