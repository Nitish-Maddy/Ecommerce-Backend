const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    googleId: {
      type: String,
      sparse: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // hide password
    },

    passwordChangedAt: Date,

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    blocked: {
      type: Boolean,
      default: false,
    },

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    addresses: [
      {
        city: String,
        street: String,
        state: String,
        pincode: String,
        phone: String,
      },
    ],
  },
  { timestamps: true }
);

// 🔐 Hash password before save (sync avoids Mongoose 9 / async-hook edge cases with Express)
userSchema.pre("save", function () {
  if (!this.isModified("password")) return;
  this.password = bcrypt.hashSync(this.password, 8);
});

// Password changes that must be hashed go through document.save() (pre save above).
// Mongoose 9 query hooks for findOneAndUpdate no longer use next(); avoid brittle $update hashing here.

// 🔍 Compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
