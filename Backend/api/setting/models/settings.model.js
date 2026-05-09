const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  preferences: {
    language: {
      type: String,
      default: "en"
    },

    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light"
    },

    timezone: {
      type: String,
      default: "UTC"
    }
  },

  notifications: {
    email: {
      type: Boolean,
      default: true
    },

    sms: {
      type: Boolean,
      default: false
    },

    push: {
      type: Boolean,
      default: true
    }
  },

  privacy: {
    profileVisibility: {
      type: String,
      enum: ["public", "private"],
      default: "public"
    },

    showEmail: {
      type: Boolean,
      default: false
    }
  },

  security: {
    twoFactorAuth: {
      type: Boolean,
      default: false
    },

    loginAlerts: {
      type: Boolean,
      default: true
    }
  }

},
{
  timestamps: true
}
);

module.exports = mongoose.model("Settings", settingsSchema);