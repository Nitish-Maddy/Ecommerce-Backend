let twilio = null;
try { twilio = require('twilio'); } catch (_) { /* optional dependency */ }

const sendWhatsApp = async (phone, message) => {
    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;
        
        if (!accountSid || !authToken || !fromNumber) {
            console.log(`[WhatsApp Service - Dev Mode] Simulating message to ${phone}: ${message}`);
            return true;
        }

        const client = twilio(accountSid, authToken);
        
        const response = await client.messages.create({
            body: message,
            from: `whatsapp:${fromNumber}`,
            to: `whatsapp:${phone}`
        });

        console.log(`WhatsApp message sent successfully. SID: ${response.sid}`);
        return true;
    } catch (error) {
        console.error("WhatsApp send error:", error);
        throw error;
    }
};

module.exports = {
    sendWhatsApp
};