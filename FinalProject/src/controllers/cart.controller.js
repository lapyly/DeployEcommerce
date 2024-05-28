const { Router } = require("express");
const router = Router();

//Service
const CartService = require("../services/cart.service");

const logger = require("../factory/winston.factory");
const { authJwt, jwtVerify } = require("../utils/jwt.util");
const authorization = require("../middlewares/auth.middleware");


router.get("/:cid", authJwt, authorization("admin"), async (req, res) => {
  try {
    const { cid } = req.params;
    const findCart = await CartService.getCartById(cid);
    logger.info(`Get cart: ${JSON.stringify(findCart)}.`);
    return res.status(201).json({
      message: `Your cart has this products: ${JSON.stringify(findCart)}`,
    });
  } catch (error) {
    if (
      error.message.includes("Cart does not exist.")) {
      logger.warn(`Warning: ${error.message}`);
      return res.status(400).json({ message: error.message });
    }
     logger.error("Error getting cart.", {
       error: error.message,
     });
     return res.status(500).json({ message: "Please try in an hour." });
  }
});

router.patch(
  "/:cartId/product",
  authJwt,
  authorization("user"),
  async (req, res) => {
    try {
      const { cartId } = req.params;
      const { productId, quantity } = req.body;
      if (!cartId || !productId || !quantity) {
        logger.debug(`Error in data input.`);
        return res
          .status(400)
          .json({ message: "Cart ID, Product ID, and quantity are required." });
      }
      const updatedCart = await CartService.addProductToCart(
        cartId,
        productId,
        quantity
      );
      logger.info(`Add to: ${cartId} products: ${productId}.`);
      return res.status(201).json({ message: "Update data product is OK." });
    } catch (error) {
      if (
        error.message.includes(`Cart not found.`) ||
        error.message.includes(`Product not found.`)
      ) {
        logger.warn(`Warning: ${error.message}`);
        return res.status(400).json({ message: error.message });
      }
      logger.error("Error adding product to cart.", {
        error: error.message,
      });
      return res.status(500).json({ message: "Please try in an hour." });
    }
  }
);

router.patch(
  "/:cartId/delete-product",
  authJwt,
  authorization("user"),
  async (req, res) => {
    try {
      const { cartId } = req.params;
      const { productId, quantity } = req.body;
      if (!cartId || !productId || !quantity) {
        logger.debug(`Error in data input.`);
        return res
          .status(400)
          .json({ message: "Cart ID, Product ID, and quantity are required." });
      }
      const updatedCart = await CartService.deleteProductOfCart(
        cartId,
        productId,
        quantity
      );
      logger.info(
        `Delete to the cart: ${cartId} ${quantity} products with ${productId} id.`
      );
      return res.status(201).json({ message: "Delete data product is OK." });
    } catch (error) {
      if (
        error.message.includes(`Cart not found.`) ||
        error.message.includes(`Product not found.`)
      ) {
        logger.warn(`Warning: ${error.message}`);
        return res.status(400).json({ message: error.message });
      }
      logger.error("Error deleting product of cart.", {
        error: error.message,
      });
      return res.status(500).json({ message: "Please try in an hour." });
    }
  }
);

router.delete(
  "/delete/:cid",
  authJwt,
  authorization("admin"),
  async (req, res) => {
    try {
      const { cid } = req.params;
      const deleteCart = await CartService.deleteCart(cid);
      logger.info(`Delete: ${deleteCart.id}.`);
      return res.status(201).json({ message: "Cart has been deleted." });
    } catch (err) {
      return res.status(400).json({ message: "Try in a hour." });
    }
  }
);

router.post("/buy", authJwt, authorization("user"), async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    logger.debug(`Auth Token from buy endpoint: ${JSON.stringify(authHeader)}`);
    if (!authHeader) {
      logger.warn(`People trying to get authorization without it.`);
      return res.status(401).json({ message: "Forbbiden." });
    }
    const token = authHeader.split(" ")[1];
    logger.debug(`The token: ${JSON.stringify(token)}`);

    const decoded = jwtVerify(token);
    logger.debug(
      `From authorization buy endpoint: ${JSON.stringify(decoded)}`
    );
    const id = decoded.tokenInfo.id;
    logger.debug(`debug id: ${id}`)

    const purchaseMail = await CartService.purchase(id)
    res.status(201).json({message: "Check your email!"})
  } catch (error) {
    if (error.message.includes("User not found."))
    {
      logger.warn({ message: error.message });
      res.status(400).json({ message: "Please try in an hour." });
    }
    res.status(500).json({message: "Please try in an hour."})
  }
})

module.exports = router;
