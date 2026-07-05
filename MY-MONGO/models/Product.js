const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      unique: true,
      trim: true,
      maxlength: [100, 'Product name cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a product description'],
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
      min: [0, 'Price must be a positive number']
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please associate this product with a category']
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock must be a positive number or zero']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
