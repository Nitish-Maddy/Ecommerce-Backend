const mongoose = require("mongoose");
const { Schema } = mongoose;

const brandSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        slug: {
            type: String,
            lowercase: true,
        },

        logo: String,
        banner: String,

        description: {
            type: String,
            trim: true,
        },

        website: String,
        country: String,

        displayOrder: {
            type: Number,
            default: 0,
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },

        isActive: {
            type: Boolean,
            default: true,
        },


        metaTitle: String,
        metaDescription: String,
    },
    { timestamps: true }
);


brandSchema.pre("save", function (next) {
    if (this.name) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
    }
    next();
});

module.exports = mongoose.model("brand", brandSchema);