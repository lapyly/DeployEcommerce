
const {hashPassword} = require("../utils/bcrypt.util")

class NewUserDto {
  constructor(userInfo) {
    this.first_name = userInfo.first_name;
    this.last_name = userInfo.last_name;
    this.age = userInfo.age;
    this.email = userInfo.email;
    this.password = hashPassword(userInfo.password);
    this.cart= userInfo.cart;
    this.created_At = Date.now();
  }
}

module.exports = NewUserDto;