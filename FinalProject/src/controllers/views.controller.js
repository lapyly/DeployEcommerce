const { Router } = require("express");
const router = Router();
const logger = require("../factory/winston.factory");


  //Views render
router.get("/register", async (req, res) => {
        try {

            res.render("register",
                {
              title: "Register here:",
              login: "login?",
              style:'register.css',
                }
            );
          logger.http('Views register OK.')
         
      } catch (error) {
          logger.http('Problems in register render.', {message: error.message})
          res.status(404).json({message: 'not render'})
      }
});

router.get("/login", async (req, res) => {
      try {
          res.render("login", {
            title: "Login:",
            style: "general.css",
          });
        logger.http("Views login OK.");
      } catch (error) {
         logger.http("Problems in login render.", {
           message: error.message,
         });
         res.status(404).json({ message: "not render" });
      }
});

router.get("/new-password", (req, res) => {
      try {
          res.render("login", {
            title: "Set new password:",
            style: "general.css",
          });
        logger.http("Views new-passord OK.");
      } catch (error) {
        logger.http("Problems in login render.", {
          message: error.message,
        });
        res.status(404).json({ message: "not render" });
      }
});

  
router.get("/cart", (req, res) => {
    try {
        const productList = [
          { name: "Product 1", quantity: 1 },
          { name: "Product 2", quantity: 2 },
        ];
    
      res.render("cart", {
        title: "Your Cart",
        hasCart: true,
        product: productList,

        style: "general.css",
      });
         logger.http("Views cart OK.");
    } catch (error) {
         logger.http("Problems in login render.", {
          message: error.message,
        });
        res.status(404).json({ message: "not render" });
      }
});

router.get("/product/form", async (req, res) => {
    try {
        res.render("stock", {
          title: "Upload your product:",

          style: "general.css",
        });
        logger.http("Views product OK.");
    } catch (error) {
        logger.http("Problems in login render.", {
          message: error.message,
        });
        res.status(404).json({ message: "not render" });
      }
});

module.exports = router;