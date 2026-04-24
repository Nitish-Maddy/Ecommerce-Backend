const {
   createProductService,
    getAllProductService,
    getProductByIdService,
    getProductBySlugService,
    updateProductService,
    deleteProductService,
    getBestSellerProductsService,
    getNewlylaunchedProductsService,
    getMegaOfferProductsService,
    getProductsByCategoryService,
    getRelatedProductsService,
    searchProductsService
} = require("../services/services");

const createProduct = async (req, res) => {
    try {

        if (req.file) {
            req.body.imgCover = req.file.filename;
        }
        if (req.files && req.files.images) {
            req.body.images = req.files.images.map((file) => file.filename);
        }

        const product = await createProductService(req.body);
        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message});
    }
};

const getAllProducts = async (req, res) => {
    try{
        const result = await getAllProductService(req.query);
        res.status(200).json({
            success: true,
            data: result.products,
            pagination: result.pagination,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message});
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await getProductByIdService(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getProductBySlug = async (req, res) => {
    try {
        const product = await getProductBySlugService(req.params.slug);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        if (req.file) {
            req.body.imgCover = req.file.filename;
        }
        if (req.files && req.files.images) {
            req.body.images = req.files.images.map((file) => file.filename);
        }

        const product = await updateProductService(req.params.id, req.body);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        res.status(200).json({ 
        success: true,
        message: "Product updated successfully",
        data: product,
         });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await deleteProductService(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getBestSellerProducts = async (req, res) => {
    try{
        const { limit } = req.query;
        const products = await getBestSellerProductsService(limit);
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getNewlyLaunchedProducts = async (req,res) => {
    try{
        const { limit } = req.query;
        const products = await getNewlylaunchedProductsService(limit);
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMegaOfferProducts = async (req,res) => {
    try{
        const { limit } = req.query;
        const products = await getMegaOfferProductsService(limit);
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getProductsByCategory = async (req, res) => {
    try {
        const result = await getProductsByCategoryService(
            req.params.categoryId,
            req.query
        );
        res.status(200).json({
            success: true,
            data: result.products,
            pagination: result.pagination,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getRelatedProducts = async (req, res) => {
    try {
        const { limit } = req.query;
        const products = await getRelatedProductsService(req.params.Id, limit);
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message});
    }
};

const searchProducts = async (req, res) => {
    try {
        const { q, limit } = req.query;
        if (!q) {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
            });
        }
     const products = await searchProductsService(q, limit);
     res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    getProductBySlug,
    updateProduct,
    deleteProduct,
    getBestSellerProducts,
    getNewlyLaunchedProducts,
    getMegaOfferProducts,
    getProductsByCategory,
    getRelatedProducts,
    searchProducts,
};