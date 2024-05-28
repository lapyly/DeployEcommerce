const mongoose = require("mongoose");

const productCollection = "product";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  status: {
    type: Boolean,
    default: true,
  },
  code: {
    type: String,
    required: true,
  },
});

const Products = mongoose.model(productCollection, productSchema);

module.exports = Products;