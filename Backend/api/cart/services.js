const Cart = require("./model");
const Product = require("../product/model/model");

const getUserCartService = async (userId) => {
    return await Cart.findOne({ userId }).populate("cartItems.productId");
}; 

function normalizeIncomingItems(payload) {
    // Supports:
    // 1) { productId, quantity, price, ... }  (legacy)
    // 2) { cartItems: [ { productId, quantity? } ] } (client-friendly)
    if (!payload) return [];
    if (Array.isArray(payload.cartItems)) return payload.cartItems;
    if (payload.productId) return [payload];
    return [];
}

async function enrichItemFromProduct(item) {
    if (!item?.productId) {
        throw new Error("productId is required in cartItems");
    }

    const quantity = Number(item.quantity ?? 1);
    if (!Number.isFinite(quantity) || quantity < 1) {
        throw new Error("quantity must be a number >= 1");
    }

    // If client already sent price fields, keep them.
    const hasClientPricing =
        item.price !== undefined || item.priceAfterDiscount !== undefined;

    if (hasClientPricing) {
        return {
            productId: item.productId,
            quantity,
            price: Number(item.price ?? 0),
            priceAfterDiscount:
                item.priceAfterDiscount !== undefined
                    ? Number(item.priceAfterDiscount)
                    : undefined,
            totalProductDiscount:
                item.totalProductDiscount !== undefined
                    ? Number(item.totalProductDiscount)
                    : undefined,
        };
    }

    const product = await Product.findById(item.productId).select(
        "price priceAfterDiscount discountPercentage"
    );
    if (!product) {
        throw new Error("Product not found");
    }

    const price = Number(product.price ?? 0);
    const priceAfterDiscount =
        product.priceAfterDiscount && product.priceAfterDiscount > 0
            ? Number(product.priceAfterDiscount)
            : undefined;

    const totalProductDiscount =
        priceAfterDiscount !== undefined ? (price - priceAfterDiscount) * quantity : 0;

    return {
        productId: item.productId,
        quantity,
        price,
        priceAfterDiscount,
        totalProductDiscount,
    };
}

const addToCartService = async (userId, payload) => {
    let cart = await Cart.findOne({ userId });

    const incomingItems = normalizeIncomingItems(payload);
    if (!incomingItems.length) {
        throw new Error("cartItems is required");
    }

    const enrichedItems = [];
    for (const item of incomingItems) {
        enrichedItems.push(await enrichItemFromProduct(item));
    }

    if (!cart) {
        cart = await Cart.create({
            userId,
            cartItems: [],
        });
    }

    for (const productData of enrichedItems) {
        const itemIndex = cart.cartItems.findIndex(
            (item) =>
                item.productId.toString() === productData.productId.toString()
        );

        if (itemIndex > -1) {
            cart.cartItems[itemIndex].quantity += productData.quantity;
        } else {
            cart.cartItems.push(productData);
        }
    }

    cart.calculateTotals();
    await cart.save();
    return cart;
};

const removeFromCartService = async (userId, productId) => {
    const cart = await Cart.findOne({ userId });

    if (!cart) return null;

    cart.cartItems = cart.cartItems.filter(
        (item) => item.productId.toString() !== productId
    );

    cart.calculateTotals();
    await cart.save();
    return cart;
};

const clearCartService = async (userId) => {
    return await Cart.findOneAndDelete({ userId });
};

module.exports = {
    getUserCartService,
    addToCartService,
    removeFromCartService,
    clearCartService,
};