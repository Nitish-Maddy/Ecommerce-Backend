const {
    createSubCategoryService,
    getAllSubCategoriesService,
    getSubCategoryByIdService,
    getSubCategoriesByCategoryService,
    updateSubCategoryService,
    deleteSubCategoryService,
} = require("../services/services");


const createSubCategory = async (req, res) => {
    try {
        const subCategory = await createSubCategoryService(req.body);
        res.status(201).json({
            success: true,
            message: "SubCategory created successfully",
            data: subCategory,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllSubCategories = async (req, res) => {
    try {
        const subCategories = await getAllSubCategoriesService();
        res.status(200).json({ success: true, data: subCategories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getSubCategoryById = async (req, res) => {
    try {
        const subCategory = await getSubCategoryByIdService(req.params.id);
        if (!subCategory) {
            return res
                .status(404)
                .json({ success: false, message: "SubCategory not found" });
        }
        res.status(200).json({ success: true, data: subCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getSubCategoriesByCategory = async (req, res) => {
    try {
        const subCategories = await getSubCategoriesByCategoryService(req.params.categoryId);
        res.status(200).json({ success: true, data: subCategories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateSubCategory = async (req, res) => {
    try {
        const subCategory = await updateSubCategoryService(req.params.id, req.body);
        if (!subCategory) {
            return res
                .status(404)
                .json({ success: false, message: "SubCategory not found" });
        }
        res.status(200).json({
            success: true,
            message: "SubCategory updated successfully",
            data: subCategory,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteSubCategory = async (req, res) => {
    try {
        await deleteSubCategoryService(req.params.id);
        res.status(200).json({
            success: true,
            message: "SubCategory deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createSubCategory,
    getAllSubCategories,
    getSubCategoryById,
    getSubCategoriesByCategory,
    updateSubCategory,
    deleteSubCategory,
};
