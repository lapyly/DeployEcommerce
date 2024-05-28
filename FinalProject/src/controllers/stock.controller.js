const { Router } = require("express");
const router = Router();

//Service
const StockService = require("../services/stock.service");

const logger = require("../factory/winston.factory");
const generateProducts = require("../utils/faker/stock-mock.util");
const authorization = require("../middlewares/auth.middleware");
const { authJwt } = require("../utils/jwt.util");


router.get("/products", authJwt, async (req, res) => {
  try {
    const allProductList = await StockService.getAllProducts();
    logger.info("Get method in products is OK.");
    return res.status(201).json({ allProductList });
  } catch (error) {
    logger.error("Error getting the products.", { error: error.message });
    return res.status(500).json({ message: "Please try in an hour." });
  }
});

router.post("/new-product", authJwt, authorization("sales"), async (req, res) => {
  try {
    const inputProduct = req.body;
    const newProduct = await StockService.addProduct(inputProduct);

    logger.info(
      `The "${newProduct.title}" product has ${newProduct.stock} in stock`
    );
    return res.status(201).json({ message: "New product is created." });
  } catch (error) {
    if (
      error.message.includes("Incomplete data to create a product.") ||
      error.message.includes("Incorrect data types to create a product.") ||
      error.message.includes("Incorrect length for product fields.")
    ) {
      logger.warn(`Warning: ${error.message}`);
      return res.status(400).json({ message: error.message });
    }
    logger.error("Error creating products.", { error: error.message });
    return res.status(500).json({ message: "Please try in an hour." });
  }
});


router.patch(
  "/update-product/:pid", authJwt,
  authorization("sales"),
  async (req, res) => {
    try {
      const { pid } = req.params;
      logger.info(`Changing product pid: ${pid}`)
      const infoToUpdate = req.body;
      logger.debug(`Info to update: ${JSON.stringify(infoToUpdate)}`);
      const updateProductById = await StockService.updateProduct(
        pid,
        infoToUpdate
      );

      logger.info(
        `The "${updateProductById.title}" product has ${updateProductById.stock} in stock`
      );
      logger.info(`UPDATE PRODUCT OK.`)
      return res.status(201).json({ message: "Product is updated." });
    } catch (error) {
      if (
        error.message.includes(`Did not find: ${pid} product.`)   
      ) {
        logger.warn(`Warning: ${error.message}`);
        return res.status(400).json({ message: "Error in data entry." });
      }
      logger.error( {message: "Error updating products.", error: error.message });
      return res.status(500).json({ message: "Please try in an hour." });
    }
  }
);

router.delete(
  "/delete-product/:pid", authJwt,
  authorization("sales"),
  async (req, res) => {
    try {
      const { pid } = req.params;
      if (!pid) {
      return res
        .status(400)
        .json({ message: `Select id product.` });

    }
      const deleteProduct = await StockService.deleteProduct(pid);

      logger.info(`The "${deleteProduct.title}" has been deleted.`);
      res
        .status(201)
        .json("Product has been deleted.");
    } catch (error) {
      logger.error({message:"Error deleting products.", error: error.message});
      return res.status(500).json({ message: "Please try in an hour." });
    }
  }
);

router.post('/mock/:mid', authJwt,authorization("admin"),async (req, res) => {
  try {
    const { mid } = req.params;

    const mock = generateProducts(mid);
    logger.info(`The follow list of products are mock ones; ${JSON.stringify(mock)}`)
    res.status(201).json({message: 'New products in db.'})
  } catch (error) {
    res.status(400).json({ message: `Problem with mock products. ${error}` });
  }
})

module.exports = router;