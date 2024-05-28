const chai = require("chai");
const expect = chai.expect;
const StockService = require("../../src/stock/stock.service");

describe("Stock service", () => {
  describe("validate product info", () => {
    //Test error 1
    it("should throw an error if any field is missing", () => {
      const invalidProduct = { title: "Hello", description: "Oh no!" }; // Lack of data

      expect(() =>
        StockService.validateProductInputInfo(invalidProduct)
      ).to.throw("Incomplete data to create a product.");
    });

    //Test error 2
    it("should throw an error if any field has incorrect data type", () => {
      const invalidProduct = {
        title: "Product B",
        description: 123, // Incorrect: must be a string.
        price: 10,
        stock: 100,
        category: "Category A",
        status: true,
        code: "abcd",
      };
      expect(() =>
        StockService.validateProductInputInfo(invalidProduct)
      ).to.throw("Incorrect data types to create a product.");
    });

    //Test error 3
    it("should throw an error if any field has incorrect length", () => {
      const invalidProduct = {
        title: "A very long product title that exceeds 50 characters", //Incorrect: must be 50 characters, there are 52.
        description: "Description",
        price: 10,
        stock: 100,
        category: "Category A",
        status: true,
        code: "abcd",
      };
      expect(() =>
        StockService.validateProductInputInfo(invalidProduct)
      ).to.throw("Incorrect length for product fields.");
    });

    //Test correct
    it("should not throw an error for a valid product", () => {
      const validProduct = {
        title: "Streaming production",
        description: "Platform management for streaming.",
        price: 50,
        stock: 4,
        category: "service",
        status: true,
        code: 4867,
      };
      expect(() =>
        StockService.validateProductInputInfo(validProduct)
      ).to.not.throw();
    });
  });
});
