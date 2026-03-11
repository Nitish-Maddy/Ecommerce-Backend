const Review = require("../review/model");


const createReviewService = async (data) => {
    return await Review.create(data);
};


const getAllReviewsService = async () => {
    return await Review.find().sort({ createdAt: -1 });
};


const getActiveReviewsService = async () => {
    return await Review.find({ isActive: true }).sort({ createdAt: -1 });
};


const getReviewsByProductIdService = async (productId) => {
    return await Review.find({ productId, isActive: true }).sort({
     createdAt: -1
     });
};


const getReviewsByUserIdService = async (userId) => {
    return await Review.find({ userId }).sort({ createdAt: -1 });
};


const getReviewByIdService = async (id) => {
    return await Review.findById(id);
};


const updateReviewService = async (id, data) => {
    return await Review.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
};


const deleteReviewService = async (id) => {
    return await Review.findByIdAndDelete(id);
};

module.exports = {
    createReviewService,
    getAllReviewsService,
    getActiveReviewsService,
    getReviewsByProductIdService,
    getReviewsByUserIdService,
    getReviewByIdService,
    updateReviewService,
    deleteReviewService,
};