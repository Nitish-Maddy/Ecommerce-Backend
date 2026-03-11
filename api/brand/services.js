const Brand = require("../brand/model");


const createBrandService = async (data) => {
    return await Brand.create(data);
};


const getAllBrandsService = async () => {
    return await Brand.find().sort("displayOrder");
};


const getActiveBrandsService = async () => {
    return await Brand.find({ isActive: true }).sort("displayOrder");
};


const getFeaturedBrandsService = async () => {
    return await Brand.find({ isActive: true, isFeatured: true }).sort(
        "displayOrder"
    );
};


const getBrandByIdService = async (id) => {
    return await Brand.findById(id);
};


const getBrandBySlugService = async (id, data) => {
    return await Brand.findByIdAndUpdate(id, data, { new: true });
};


const updateBrandService = async (id, data) => {
    return await Brand.findByIdAndUpdate(id, data, { new: true });
};


const deleteBrandService = async (id) => {
    return await Brand.findByIdAndDelete(id);
};

module.exports = {
    createBrandService,
    getAllBrandsService,
    getActiveBrandsService,
    getFeaturedBrandsService,
    getBrandByIdService,
    getBrandBySlugService,
    updateBrandService,
    deleteBrandService,
}