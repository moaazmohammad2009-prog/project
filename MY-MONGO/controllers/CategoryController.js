const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

/**
 * @desc    
 * @route   
 * @access  
 */
const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories
    }
  });
});

/**
 * @desc    
 * @route   
 * @access  
 */
const getCategoryById = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError(`No category found with ID: ${req.params.id}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      category
    }
  });
});

/**
 * @desc    
 * @route   
 * @access  
 */
const createCategory = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;

  // Check if name is already taken
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    return next(new AppError('Category name already exists', 400));
  }

  const category = await Category.create({ name, description });

  res.status(201).json({
    status: 'success',
    data: {
      category
    }
  });
});

/**
 * @desc    
 * @route   
 * @access  
 */
const updateCategory = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;

  let category = await Category.findById(req.params.id);
  if (!category) {
    return next(new AppError(`No category found with ID: ${req.params.id}`, 404));
  }

  if (name && name !== category.name) {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return next(new AppError('Category name already exists', 400));
    }
  }

  category = await Category.findByIdAndUpdate(
    req.params.id,
    { name, description },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      category
    }
  });
});

/**
 * @desc    
 * @route   
 * @access  
 */
const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError(`No category found with ID: ${req.params.id}`, 404));
  }

  await category.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
