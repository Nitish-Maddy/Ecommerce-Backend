const nodemailer = require("nodemailer");

// Note: Configure these in your .env file
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS

const sendEmail = async (to, subject, htmlContent) => {
    try {
        console.log(`[Email Service] Simulating email to ${to} with subject: ${subject}`);
        
        // Uncomment and configure for real usage:
        /*
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, 
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"E-Commerce Admin" <admin@example.com>',
            to,
            subject,
            html: htmlContent,
        });
        console.log("Message sent: %s", info.messageId);
        */
        return true;
    } catch (error) {
        console.error("Email send error:", error);
        throw error;
    }
};

module.exports = {
    sendEmail
};