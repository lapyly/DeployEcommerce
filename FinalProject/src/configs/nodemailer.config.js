const nodemailer = require("nodemailer");
const { identifier, password } = require("./app.config");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: identifier,
    pass: password,
  },
});

module.exports = transport;