const chai = require("chai");

const expect = chai.expect;
const supertest = require("supertest");

const app = require("../src/index");
const request = supertest(app);

describe("Auth service test", () => {
  //POST
  it("should register a user via the endpoint", async () => {
    //
    const inputUser = {
      email: "maryperesky@gmail.com",
      first_name: "Mary",
      last_name: "Peresky",
      age: 19,
      password: "CAmer0n",
    };
    const response = await request(app).post("/register").send(inputUser);

    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal("New user is created.");
  });

  //POST
  it("should login a user via the endpoint", async () => {
    //
    const inputUser = {
      email: "maryperesky@gmail.com",
      password: "CAmer0n",
    };
    const response = await request(app).post("/login").send(inputUser);

    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal("Login succesfull.");
  });

  //GET
  it("should get all users", async () => {
    //
    const response = await request(app).get("/profile");
    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal("The list of the user is OK.");
  });

  //POST
  it("should send a email to restore password.", async () => {
    const inputUser = {
      email: "maryperesky@gmail.com",
    };
    const response = await request(app)
      .post("/forgot-password")
      .send(inputUser);

    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal(
      "The email to reset password has been sent."
    );
  });

  //PATCH
  it("should update a product by id", async () => {
    const token = { token: "4524dd" };
    const infoToUpdate = { newPassword: "4r63nTINA" };

    const response = await request(app)
      .patch("/new-password")
      .send(token, infoToUpdate);

    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal("Password has been reset.");
  });
});
