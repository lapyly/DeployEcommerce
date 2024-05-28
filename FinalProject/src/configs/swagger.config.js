const swaggerJsdoc = require("swagger-jsdoc");
const { PORT } = require("./app.config");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API de Stock",
    version: "1.0.0",
    description: "Documentation for the Stock Management API",
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: "Dev server",
    },
  ],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ["./docs/*.yaml"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
