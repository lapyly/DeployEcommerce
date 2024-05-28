const bcrypt = require("bcrypt");

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const passHash =  bcrypt.hashSync(password, salt);
  return passHash;
};

const passwordIsValidated = (plainPassword, hashedPassword) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

module.exports = { hashPassword, passwordIsValidated };
