const chai = require("chai");
const supertest = require("supertest");
const expect = chai.expect;

const app = require("../src/index");
const request = supertest(app);

describe("Stock service test", () => {
  //POST
  it("should add a product via the endpoint", async () => {
    //
    const inputProduct = {
      title: "Streaming production",
      description: "Platform management for streaming.",
      price: 50,
      stock: 4,
      category: "service",
      status: true,
      code: 4867,
    };
    const response = await request(app).post("/new-product").send(inputProduct);

    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal("New product is created.");
  });

  //GET
  it("should get all products", async () => {
    //
    const response = await request(app).get("/products");
    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal("Get method in products is OK.");
  });

  //PATCH
  it("should update a product by id", async () => {
    const pid = { _id: "4524dd" };
    const infoToUpdate = { category: "full service" };

    const response = await request(app)
      .patch("/update-product/:pid")
      .send(pid, infoToUpdate);

    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal("Product is updated.");
  });

  //DELETE
  it("should delete a product by id", async () => {
    const pid = { _id: "4524dd" };

    const response = await request(app)
      .delete("/delete-product/:pid")
      .send(pid);

    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal("Product has been deleted.");
  });
});
