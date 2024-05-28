const { faker } = require("@faker-js/faker");
const Users = require("../../models/user.model");
const { createNewCart } = require("../../services/cart.service");


const generateUser = async () => {
  const newCart = await createNewCart();
  return {
    _id: faker.database.mongodbObjectId(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 80 }),
    password: faker.internet.password({ length: 20 }),
    role: faker.helpers.arrayElement(["user", "admin", "sales"]),
    cart: newCart._id,
    lastLogin: faker.date.between({ from: "2020-01-01T00:00:00.000Z", to: "2024-08-07T00:00:00.000Z" }),
    status: true 
  };
} 
const generateUsers= async (numOfUsers) => {
  const users = [];
  
  for (let i = 0; i < numOfUsers; i++) {
    const mockUser = await generateUser();
    users.push(mockUser);
  }

  await Users.insertMany(users);
  return users;
};

module.exports = generateUsers;


