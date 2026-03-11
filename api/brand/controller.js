const {
     createBrandService,
    getAllBrandsService,
    getActiveBrandsService,
    getFeaturedBrandsService,
    getBrandByIdService,
    getBrandBySlugService,
    updateBrandService,
    deleteBrandService,
} = require("../brand/services");


const createBrand = async (req, res) => {
    try {
        const brand = await createBrandService(req.body);
        res.status(201).json({
            success: true,
            message: "Brand created successfully",
            data: brand,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getAllBrands =  async (req, res) => {
    try {
        const brands = await getAllBrandsService();
        res.status(200).json({ success: true, data: brands }); 
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getActiveBrands = async (req, res) => {
    try{
        const brands = await getActiveBrandsService();
        res.status(200).json({ success: true, data: brands });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getFeaturedBrands = async (req, res) => {
    try {
     const brands = await getFeaturedBrandsService();
     res.status(200).json({ success:  true, data: brands });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getBrandById = async (req, res) => {
    try {
        const brand = await getBrandByIdService(req.params.id);
        if (!brand) {
            return res
            .status(404)
            .json({ success: false, message: "Brand not found" });
        }
        res.status(200).json({ success: true, data: brand });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}; 


const getBrandBySlug = async (req, res) => {
    try {
        const brand = await getBrandBySlugService(req.params.slug);
        if (!brand) {
            return res 
            .status(404)
            .json({ success: false, message: "Brand not found" });
        }
        res.status(200).json({ success: true, data: brand });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const updateBrand = async (req, res) => {
    try {
        const brand = await updateBrandService(req.params.id, req.body);
        if (!brand) {
            return res
            .status(404)
            .json({ success: false, message: "Brand not found" });
        }
        res.status(200).json({
             success: true,
             message: "Brand updated successfully",
            data: brand, 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const deleteBrand = async (req, res) => {
    try {
        await deleteBrandService(req.params.id);
        res.status(200).json({
            success: true,
            message: "Brand deleted successfully",
         });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createBrand,
    getAllBrands,
    getActiveBrands,
    getFeaturedBrands,
    getBrandById,
    getBrandBySlug,
    updateBrand,
    deleteBrand,
};