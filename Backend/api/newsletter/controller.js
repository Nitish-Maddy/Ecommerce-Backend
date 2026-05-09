const crypto = require("crypto");
const Subscriber = require("./model");
const { sendNewsletterConfirmationEmail } = require("./mailer");

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

const subscribe = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    if (!email || !email.includes("@")) {
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = sha256(token);
    const confirmUrl = `${process.env.APP_BASE_URL}/api/v1/newsletter/confirm/${token}`;

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      if (existing.status === "confirmed") {
        return res.status(200).json({
          success: true,
          message: "You are already subscribed.",
        });
      }

      existing.confirmationTokenHash = tokenHash;
      existing.lastConfirmationSentAt = new Date();
      await existing.save();

      const mail = await sendNewsletterConfirmationEmail({ to: email, confirmUrl });
      return res.status(200).json({
        success: true,
        message: "Confirmation email sent. Please check your inbox.",
        previewUrl: mail.previewUrl || undefined,
      });
    }

    await Subscriber.create({
      email,
      status: "pending",
      confirmationTokenHash: tokenHash,
      lastConfirmationSentAt: new Date(),
    });

    const mail = await sendNewsletterConfirmationEmail({ to: email, confirmUrl });

    return res.status(200).json({
      success: true,
      message: "Confirmation email sent. Please check your inbox.",
      previewUrl: mail.previewUrl || undefined,
    });
  } catch (err) {
    const msg = err?.message || "Failed to subscribe";
    return res.status(500).json({
      success: false,
      message: msg,
    });
  }
};

const confirm = async (req, res) => {
  try {
    const token = String(req.params.token || "");
    if (!token) {
      return res.status(400).send("Invalid confirmation token.");
    }

    const tokenHash = sha256(token);
    const sub = await Subscriber.findOne({ confirmationTokenHash: tokenHash });
    if (!sub) {
      return res.status(400).send("This confirmation link is invalid or expired.");
    }

    if (sub.status !== "confirmed") {
      sub.status = "confirmed";
      sub.confirmedAt = new Date();
      await sub.save();
    }

    return res
      .status(200)
      .send(
        `<div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; padding:40px; max-width:720px; margin:0 auto;">
          <h2 style="margin:0 0 12px;">Subscription confirmed</h2>
          <p style="margin:0 0 18px; color:#333;">You will now receive email marketing from Meenova.</p>
          <a href="${process.env.FRONTEND_BASE_URL || process.env.APP_BASE_URL || "http://localhost:5173"}"
             style="display:inline-block; background:#00AEEF; color:#fff; text-decoration:none; padding:12px 18px; border-radius:10px; font-weight:700;">
            Go back to Meenova
          </a>
        </div>`
      );
  } catch (err) {
    return res.status(500).send("Failed to confirm subscription.");
  }
};

module.exports = { subscribe, confirm };

