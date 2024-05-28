//DB for auth service.
const mongoose = require("mongoose");


const userCollection = "user";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin", "sales"], default: "user" },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Carts" },
  lastLogin: { type: Date, default: null },
  status: { type: Boolean, default: true}
});

const Users = mongoose.model(userCollection, userSchema);

module.exports = Users;
