const Model = require("../model/model");
const slugify = require("slugify");

const createProductService = async (data) => {
    if (data.title) {
        data.slug = slugify(data.title, { lower: true, strict: true });
    }
    return await Model.create(data);
};

const getAllProductService = async (queryParams = {}) => {
    const {
        page = 1,
        limit = 10,
        sort = "createdAt",
        category,
        subcategory,
        brand,
        minPrice,
        maxPrice,
        isBestSeller,
        isNewlyLaunched,
        isMegaOffer,
        isCombo,
        isActive,
        search,
    } = queryParams;

    const filter = {};
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (brand) filter.brand = brand;
    if (isBestSeller !== undefined) filter.isBestSeller = isBestSeller === 'true';
    if (isNewlyLaunched !== undefined) filter.isNewlyLaunched = isNewlyLaunched === 'true';
    if (isMegaOffer !== undefined) filter.isMegaOffer = isMegaOffer === 'true';
    if (isCombo !== undefined) filter.isCombo = isCombo === 'true';
    if (isActive !== undefined) filter.isActive = isActive === 'true';


    if(minPrice || maxPrice) {
        filter.price = {};
        if(minPrice) filter.price.$gte = Number(minPrice);
        if(maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
        filter.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const products = await Model.find(filter)
    .populate("category", "name slug")
    .populate("subcategory", "name slug")
    .populate("brand", "name slug logo")
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

    const total = await Model.countDocuments(filter);

    return {
        products,
        pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            totalProducts: total,
            hasNextPage: Number(page) < Math.ceil(total / Number(limit)),
            hasPrevPage: Number(page) > 1,
        },
    };
};

const getProductByIdService = async (id) => {
    return await Model.findById(id)
        .populate("category", "name slug")
        .populate("subcategory", "name slug")
        .populate("brand", "name slug logo");   
};

const getProductBySlugService = async (slug) =>
{
    return await Model.findOne({ slug })
    .populate("category","name slug")
    .populate("subcategory","name slug")
    .populate("brand","name slug logo");
};

const updateProductService = async (id, data) => {
    if (data.title) {
        data.slug = slugify(data.title, { lower: true, strict: true });
    }
    return await Model.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    })
    .populate("category", "name slug")
    .populate("subcategory", "name slug")
    .populate("brand", "name slug logo");
};

const deleteProductService = async (id) => {
    return await Model.findByIdAndDelete(id);
};

const getBestSellerProductsService = async (limit = 10) => {
    return await Model.find({ isBestSeller: true, isActive: true })
    .populate("category", "name slug")
    .populate("brand", "name slug logo")
    .limit(Number(limit));
};

const getNewlylaunchedProductsService = async (limit = 10) => {
    return await Model.find({ isNewlyLaunched: true, isActive: true })
    .populate("category", "name slug")
    .populate("brand", "name slug logo")
    .limit(Number(limit));
};

const getMegaOfferProductsService = async(limit = 10) => {
  return await Model.find({ isMegaOffer: true, isActive: true })
    .populate("category", "name slug")
    .populate("brand", "name slug logo")
    .limit(Number(limit));
};

const getProductsByCategoryService = async (categoryId, queryParams = {}) => {
const  { page = 1, limit = 10, sort = "-createdAt" } = queryParams;
const skip = (Number(page) - 1) * Number(limit);

const products = await Model.find({ category: categoryId, isActive: true })
  .populate("subcategory", "name slug")
  .populate("brand", "name slug logo")
  .sort(sort)
  .skip(skip)
  .limit(Number(limit));

  const total = await Model.countDocuments({
    category: categoryId, isActive: true });

    return {
        products,
        pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            totalProducts: total,
        },
    };
};

const getRelatedProductsService = async (productId, limit = 6) => {
    const product = await Model.findById(productId);
    if (!product) return [];

    return await Model.find({
        _id: { $ne: productId },
        category: product.category,
        isActive: true,
    })
    .populate("brand","name slug logo")
    .limit(Number(limit));
};

const updateProductStockService = async (id, quantity, operation = "decrease") => {
    const product = await Model.findById(id);
    if (!product) return null;

    if (operation === "decrease") {
        product.quantity -= quantity;
        product.sold += quantity;
    } else {
        product.quantity += quantity;
    }

    await product.save();
    return product;
};

 const searchProductsService = async(searchQuery, limit = 20) => {
    return await Model.find({
        $text: { $search: searchQuery },
        isActive: true,
    })
    .select("title slug imgCover price priceAfterDiscount discountPercentage")
    .limit(Number(limit));
 };
  
module.exports = {
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
    updateProductStockService,
    searchProductsService
};