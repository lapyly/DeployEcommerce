const authController = require("../controllers/auth.controller");
const cartController = require("../controllers/cart.controller");
const stockController = require("../controllers/stock.controller");
const viewsController = require("../controllers/views.controller");

const routes = (app) => {
    app.use("/api/auth", authController);
    app.use("/api/cart", cartController);
    app.use("/api/stock", stockController); 
    app.use("/", viewsController);
};

module.exports = routes;
