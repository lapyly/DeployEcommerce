const logger = require("../factory/winston.factory");
const Carts = require("../models/cart.model");
const Products = require("../models/product.model");

class CartService {
  static async getCartById(cid) {
    const findCart = await Carts.findOne({ _id: cid });
    if (!findCart) {
      throw new Error("Cart does not exist.");
    }
    const cartById = findCart.products;
    return cartById;
  }

  static async addProductToCart(cartId, productId, quantity) {
    const cartById = await Carts.findById(cartId);
    if (!cartById) {
      throw new Error(`Cart not found.`);
    }
    logger.debug(`The cart find is ${JSON.stringify(cartById)}`);
    
        
    const findProduct = await Products.findById(productId);
    if (!findProduct) {
      throw new Error (`Product not found.`)
    }
    
    const existingProduct = cartById.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (existingProduct > -1) {
      cartById.products[existingProduct].quantity += quantity;
    } else {
      cartById.products.push({ product: productId, quantity });
    }

    await cartById.save();
    return cartById;
  }

  static async deleteProductOfCart(cartId,productId,quantity) {
      const cartById = await Carts.findById(cartId);
      if (!cartById) {
        throw new Error(`Cart not found.`);
      }
      logger.debug(`The cart find is ${JSON.stringify(cartById)}`);

      const findProduct = await Products.findById(productId);
      if (!findProduct) {
        throw new Error(`Product not found.`);
      }

      const existingProduct = cartById.products.findIndex(
        (p) => p.product.toString() === productId
      );
     if (!existingProduct) {
        return new Error (`You dont have this product in your cart`)
      }
        cartById.products[existingProduct].quantity -= quantity;
      
      await cartById.save();
      return cartById;  
      }

  static async deleteCart(cid) {
    const deleteCart = await Carts.findOneAndUpdate(
      { _id: cid },
      { status: false }
    );
    return deleteCart;
  }

  static async purchase(id) {
    const findUser = await Users.findById(id);
    logger.debug(`find: ${findUser}`);
    if (!findUser) {
      throw new Error("User not found.");
    }
    const userEmail = findUser.email;
    const userName = findUser.first_name;
    const userCart = findUser.cart;
    logger.debug(`cart: ${JSON.stringify(userCart)}`);
    const purchaseCart = await Carts.findById(userCart).populate(
      "products.product"
    );
    logger.debug(`purchase cart: ${JSON.stringify(purchaseCart)}`);
    const purchaseProducts = purchaseCart.products.map((p) => ({
      product: p.product,
      quantity: p.quantity,
    }));
    logger.debug(`purchase products: ${JSON.stringify(purchaseProducts)}`);
    const userInfo = {
      email: userEmail,
      name: userName,
      cart: purchaseProducts,
    };

    logger.debug(`send ${JSON.stringify(userInfo)}`);

    const mailAdapter = new MailAdapter();
    const sendMailWithPurchase = mailAdapter.purchase(userInfo);
    logger.debug(
      `The info is going to return: ${JSON.stringify(sendMailWithPurchase)}`
    );
  }

  //The follow service is used in auth controller when the user register.
  static async createNewCart() {
    const newCart = new Carts();
    await newCart.save();
    return newCart;
  }
}

module.exports = CartService;