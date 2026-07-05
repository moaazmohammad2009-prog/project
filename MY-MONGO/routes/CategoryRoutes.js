const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/CategoryController');

const router = express.Router();

const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 'fail',
      errors: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg
      }))
    });
  }
  next();
};

const categoryValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ max: 50 })
    .withMessage('Category name cannot exceed 50 characters')
];

router.route('/')
  .get(getCategories)
  .post(categoryValidationRules, validateResults, createCategory);

router.route('/:id')
  .get(getCategoryById)
  .patch(categoryValidationRules, validateResults, updateCategory)
  .delete(deleteCategory);

module.exports = router;
