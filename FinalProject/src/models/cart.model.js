const mongoose = require("mongoose");
const Products = require('./product.model')

const cartCollection = "cart";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const Carts = mongoose.model(cartCollection, cartSchema);

module.exports = Carts;
