const SubCategory = require("../model/model");

const createSubCategoryService = async (data) => {
    return await SubCategory.create(data);
};

const getAllSubCategoriesService = async () => {
    return await SubCategory.find().populate("category");
};

const getSubCategoryByIdService = async (id) => {
    return await SubCategory.findById(id).populate("category");
};

const getSubCategoriesByCategoryService = async (categoryId) => {
    return await SubCategory.find({ category: categoryId }).populate("category");
};

const updateSubCategoryService = async (id, data) => {
    return await SubCategory.findByIdAndUpdate(id, data, { new: true });
};

const deleteSubCategoryService = async (id) => {
    return await SubCategory.findByIdAndDelete(id);
};

module.exports = {
    createSubCategoryService,
    getAllSubCategoriesService,
    getSubCategoryByIdService,
    getSubCategoriesByCategoryService,
    updateSubCategoryService,
    deleteSubCategoryService,
};
