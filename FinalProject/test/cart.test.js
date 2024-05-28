const supertest = require("supertest");
const chai = require("chai");
const expect = chai.expect;

const app = require("../src/index");
const request = supertest(app);

describe("Cart service test", () => {
  //POST
  it("should create a cart via the endpoint", async () => {
    //
    const inputProduct = {
      products: [
        { product: "orange", quantity: 6 },
        { product: "apple", quantity: 15 },
      ],
    };
    const response = await request(app).post("/api/cart/").send(inputProduct);

    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal(`Cart created: ${cart}.`);
  });

  //GET
  it("should get a cart by id", async () => {
    const cid = { _id: 1452 };
    const response = await request(app).get("/api/cart/:cid").send(cid);
    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal(
      `Your cart ${findCart.id} has ${findCart.products}`
    );
  });



  //DELETE
  it("should delete a product by id", async () => {
    const pid = { _id: "4524dd" };

    const response = await request(app).delete("/cart/:cid").send(cid);

    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal("Cart has been deleted.");
  });
});
