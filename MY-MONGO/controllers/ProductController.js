const Product = require('../models/Product');
const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

/**
 * @desc    
 * @route   
 * @access  
 */
const getProducts = asyncHandler(async (req, res, next) => {
  const filter = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }

  const products = await Product.find(filter).populate('category');

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

/**
 * @desc    
 * @route   
 * @access  
 */
const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('category');

  if (!product) {
    return next(new AppError(`No product found with ID: ${req.params.id}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

/**
 * @desc    
 * @route   
 * @access  
 */
const createProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, category, stock } = req.body;

  
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return next(new AppError(`No category found with ID: ${category}`, 404));
  }

  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock
  });

  res.status(201).json({
    status: 'success',
    data: {
      product
    }
  });
});

/**
 * @desc    
 * @route   
 * @access  
 */
const updateProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, category, stock } = req.body;

  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError(`No product found with ID: ${req.params.id}`, 404));
  }

  if (category) {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return next(new AppError(`No category found with ID: ${category}`, 404));
    }
  }

  product = await Product.findByIdAndUpdate(
    req.params.id,
    { name, description, price, category, stock },
    { new: true, runValidators: true }
  ).populate('category');

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

/**
 * @desc    
 * @route   
 * @access  
 */
const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError(`No product found with ID: ${req.params.id}`, 404));
  }

  await product.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
