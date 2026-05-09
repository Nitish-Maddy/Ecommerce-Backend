const nodemailer = require("nodemailer");

function getMailerConfig() {
  return {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  };
}

function getMissingMailerEnv() {
  const required = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_FROM",
    "APP_BASE_URL",
  ];
  return required.filter((k) => !process.env[k]);
}

async function createTransporter() {
  const missing = getMissingMailerEnv();
  if (missing.length === 0) {
    return {
      transporter: nodemailer.createTransport(getMailerConfig()),
      from: process.env.SMTP_FROM,
      mode: "smtp",
    };
  }

  // Dev-friendly fallback: Ethereal test account (does NOT deliver to Gmail inbox)
  const testAccount = await nodemailer.createTestAccount();
  return {
    transporter: nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass },
    }),
    from: `Meenova <${testAccount.user}>`,
    mode: "ethereal",
  };
}

async function sendNewsletterConfirmationEmail({ to, confirmUrl }) {
  const { transporter, from, mode } = await createTransporter();

  const subject = "Confirm your subscription (Meenova)";
  const text =
    `Hi,\n\n` +
    `Please confirm you want to receive email marketing from Meenova.\n\n` +
    `Confirm here: ${confirmUrl}\n\n` +
    `If you didn’t request this, you can ignore this email.\n`;

  const html = `
  <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height:1.5; color:#111;">
    <h2 style="margin:0 0 12px;">Confirm your subscription</h2>
    <p style="margin:0 0 14px;">
      Please confirm you want to receive <strong>email marketing</strong> from Meenova.
    </p>
    <p style="margin:0 0 18px;">
      <a href="${confirmUrl}"
         style="display:inline-block; background:#00AEEF; color:#fff; text-decoration:none; padding:12px 18px; border-radius:10px; font-weight:700;">
        Confirm subscription
      </a>
    </p>
    <p style="margin:0 0 6px; color:#555; font-size:13px;">
      Or copy & paste this link:
    </p>
    <p style="margin:0; color:#555; font-size:13px; word-break:break-all;">
      ${confirmUrl}
    </p>
  </div>
  `;

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  const previewUrl =
    mode === "ethereal" ? nodemailer.getTestMessageUrl(info) : null;
  return { mode, previewUrl };
}

module.exports = { sendNewsletterConfirmationEmail };

