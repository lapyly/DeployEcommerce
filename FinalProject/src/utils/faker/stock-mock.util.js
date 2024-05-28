const { faker } = require("@faker-js/faker");
const Products = require("../../models/product.model");

const generateProducts = (numOfProducts) => {
  const products = Products;

  for (let i = 0; i < numOfProducts; i++) {
    products.insertMany(generateProducts());
  }

  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.string.numeric({ length: 4 }),
    stock: faker.string.numeric({ length: 3, exclude: ["0"] }),
    caregory: faker.commerce.department(),
    code: faker.string.numeric({ length: 4 }),
  };
};
module.exports = generateProducts;
