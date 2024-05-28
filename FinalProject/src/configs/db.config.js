const mongoose = require("mongoose");
const { URLDB } = require("./app.config");

const mongoConnect = async () => {
  try {
    await mongoose.connect(URLDB);
    console.log("DB is connected.");
  } catch (error) {
    console.log(error);
  }
};

module.exports = mongoConnect;