const {  mongoose } = require("mongoose");
const Products = require("../models/product.model");

class StockService {
  static async validateProductInputInfo(inputProduct) {
    const { title, description, price, stock, category, status, code } =
      inputProduct;

    //Cheking if any field is missed.
    if (
      !title ||
      !description ||
      !price ||
      !stock ||
      !category ||
      !code
    ) {
      throw new Error("Incomplete data to create a product.");
    }
    //Cheking data type
    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof price !== "number" ||
      typeof stock !== "number" ||
      typeof category !== "string" ||
      typeof code !== "string"
    ) {
      throw new Error("Incorrect data types to create a product.");
    }
    //Cheking data length
    if (
      title.length < 1 ||
      title.length > 50 ||
      description.length < 1 ||
      description.length > 100 ||
      price.length < 3 ||
      price.length > 8 ||
      stock < 1 ||
      stock > 5000 ||
      category.length < 1 ||
      category.length > 50 ||
      code.length !== 4
    ) {
      throw new Error("Incorrect length for product fields.");
    }
  }
  static async addProduct(inputProduct) {
    //Validate info
    this.validateProductInputInfo(inputProduct);
    //Create new product.
    const newProduct = await Products.create(inputProduct);
    return newProduct;
  }

  static async getAllProducts() {
    const allProductList = await Products.find();
    return allProductList;
  }

  static async updateProduct(pid, infoToUpdate) {
    if (!pid) {
      throw new Error(`Did not find: ${pid} product.`);
    }
    const updateProductById = await Products.findByIdAndUpdate(
      pid,
      infoToUpdate,
      { new: true }
    );
    return updateProductById;
  }

  static async deleteProduct(pid) {

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      logger.debug(`Error stock service line 76.`)
      throw new Error(`Invalid product ID.}`);
    }

    const updateProductById = await Products.findOneAndUpdate(
      { _id: ObjectId(`${pid}`) },
      { $set: infoToUpdate },
      { new: true }
    );

    if (!updateProductById) {
      throw new Error(`Did not find product.}`);
    }
    return updateProductById;
  }
}
module.exports = StockService;
