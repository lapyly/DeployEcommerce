const express = require("express");
const { PORT } = require("./configs/app.config.js");
const router = require("./router/index.js");

const mongoConnect = require("./configs/db.config.js");

const bodyParser = require("body-parser");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./configs/swagger.config.js");

const handlebars = require("express-handlebars");
const path = require("path");
const logger = require("./middlewares/logger.middleware");

const app = express();


app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger);



router(app);

//Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

mongoConnect();

app.listen(PORT, () => {
  console.log(PORT);
});
