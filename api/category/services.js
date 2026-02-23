const Category = require("../category/model");

const createCategoryService = async (data) => {
    return await Category.create(data);
};

const getAllCategoriesService = async (data) => {
    return await Category.find().populate("subcategories").sort("displayOrder");
};

const getActiveCategoriesService = async () => {
    return await Category.find({ isActive: true, showInNav: true })
    .populate("subcategories")
    .sort("displayOrder");
};

const getCategoryByIdService = async (id) => {
    return await Category.findById(id).populate("subcategories");
};

const getCategoryBySlugService = async (slug) => {
    return await Category.findOne({ slug }).populate("subcategories");
};

const getSubcategoriesByParentService = async (parentId) => {
    return await Category.find({ parentCategory: parentId })
    .populate("subcategories")
    .sort("displayOrder");
};

const updateCategoryService = async (id, data) => {
    return await Category.findByIdAndUpdate(id, data, { new: true });
};

const deleteCategoryService = async (id) => {
    return await Category.findByIdAndDelete(id);
};

module.exports = {
    createCategoryService,
    getAllCategoriesService,
    getActiveCategoriesService, 
    getCategoryByIdService,
    getCategoryBySlugService,
    getSubcategoriesByParentService,
    updateCategoryService,
    deleteCategoryService,
};