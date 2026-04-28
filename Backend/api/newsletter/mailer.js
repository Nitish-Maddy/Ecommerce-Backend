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

function hasPlaceholderCreds() {
  const user = (process.env.SMTP_USER || "").toLowerCase();
  const pass = (process.env.SMTP_PASS || "").toLowerCase();

  // Catch common placeholder patterns
  const placeholderPatterns = [
    "your_", "your-", "your ", "changeme", "placeholder",
    "example", "xxx", "todo", "replace",
  ];

  const isPlaceholder = (val) =>
    val === "" || placeholderPatterns.some((p) => val.includes(p));

  return isPlaceholder(user) || isPlaceholder(pass);
}

async function createEtherealTransporter() {
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

function createNoopTransporter() {
  return {
    transporter: {
      sendMail: async (opts) => {
        console.log("📧 [DEV] Email would be sent to:", opts.to);
        console.log("📧 [DEV] Subject:", opts.subject);
        return { messageId: "dev-noop" };
      },
    },
    from: "noreply@localhost",
    mode: "noop",
  };
}

async function createTransporter() {
  const missing = getMissingMailerEnv();

  // Skip SMTP entirely if creds are placeholders or missing
  if (missing.length > 0 || hasPlaceholderCreds()) {
    console.log("⚠️  SMTP credentials not configured, using fallback mailer");
    try {
      return await createEtherealTransporter();
    } catch (err) {
      console.warn("⚠️  Ethereal fallback also failed:", err.message);
      return createNoopTransporter();
    }
  }

  // Try real SMTP
  try {
    const transporter = nodemailer.createTransport(getMailerConfig());
    await transporter.verify();
    return {
      transporter,
      from: process.env.SMTP_FROM,
      mode: "smtp",
    };
  } catch (err) {
    console.warn("⚠️  SMTP auth failed, falling back to Ethereal:", err.message);
    try {
      return await createEtherealTransporter();
    } catch (err2) {
      console.warn("⚠️  Ethereal fallback also failed:", err2.message);
      return createNoopTransporter();
    }
  }
}

async function sendNewsletterConfirmationEmail({ to, confirmUrl }) {
  const { transporter, from, mode } = await createTransporter();

  const subject = "Confirm your subscription (Meenova)";
  const text =
    `Hi,\n\n` +
    `Please confirm you want to receive email marketing from Meenova.\n\n` +
    `Confirm here: ${confirmUrl}\n\n` +
    `If you didn't request this, you can ignore this email.\n`;

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
