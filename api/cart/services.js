const Cart = require("../cart/model");

const getUserCartService = async (userId) => {
    return await Cart.findOne({ userId }).populate("cartItem.productId");
}; 

const addToCartService = async (userId, productData) => {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
        cart = await Cart.create({
            userId,
            cartItem: [productData],
            totalPrice: productData.price * productData.quantity,
            totalPriceAfterDiscount: 
            productData.price * productData.quantity - 
            (productData.totalProductDiscount || 0),
        });
        return cart;
    }

    const itemIndex = cart.cartItem.findIndex(
        (item) =>
            item.productId.toString() === productData.productId.toString()
    );

   if (itemIndex > -1) {
    cart.cartItem[itemIndex].quantity += productData.quantity;
   } else {
    cart.cartItem.push(productData);
   }

   cart.totalPrice += productData.price * productData.quantity;
   cart.totalPriceAfterDiscount = 
   cart.totalPrice - (cart.discount || 0);

   await cart.save();
   return cart;
};

const removeFromCartService = async (userId, productId) => {
    const cart = await Cart.findOne({ userId });

    if (!cart) return null;

    cart.cartItem = cart.cartItem.filter(
        (item) => item.productId.toString() !== productId
    );

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