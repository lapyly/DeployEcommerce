const chai = require("chai");
const expect = chai.expect;
const StockService = require("../../src/auth/auth.service");

describe("Auth service", () => {
  describe("validate user info", () => {
    //Test error 1
    it("should throw an error if any field is missing", () => {
      const invalidUser = {
        email: "maryp@gmail.com",
        first_name: "Mary",
        last_name: "Peresky",
      }; // Lack of data

      expect(() => StockService.validateUserInputInfo(invalidUser)).to.throw(
        "Incomplete data to create a user."
      );
    });

    //Test error 2
    it("should throw an error if any field has incorrect data type", () => {
      const invalidUser = {
        email: "Product B",
        first_name: "Mary",
        last_name: 10, // Incorrect: must be a string.
        age: 18,
        password: "Category A",
      };
      expect(() => StockService.validateUserInputInfo(invalidUser)).to.throw(
        "Incorrect data types to create a user."
      );
    });

    //Test error 3
    it("should throw an error if any field has incorrect length", () => {
      const invalidUser = {
        email: "Ahfjdkfhdshjdtitlethatexceeds5@0characters", //Incorrect: must be 50 characters, there are 52.
        first_name: "Mary",
        last_name: "Peresky",
        age: 19,
        password: "CAmer0n",
      };
      expect(() => StockService.validateUserInputInfo(invalidUser)).to.throw(
        "Incorrect length for user fields."
      );
    });

    //Test correct
    it("should not throw an error for a valid product", () => {
      const validUser = {
        email: "maryperesky@gmail.com",
        first_name: "Mary",
        last_name: "Peresky",
        age: 19,
        password: "CAmer0n",
      };
      expect(() =>
        StockService.validateUserInputInfo(validUser)
      ).to.not.throw();
    });
  });
});
