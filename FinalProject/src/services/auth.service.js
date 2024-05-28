const Users = require("../models/user.model");
const NewUserDto = require("../DTO/new-user.dto");

const { hashPassword, passwordIsValidated } = require("../utils/bcrypt.util");
const { generateJwt, generateLinkJwt, authLinkJwt, jwtVerifyLink } = require("../utils/jwt.util");
const MailAdapter = require("../services/message.service");
const logger = require("../factory/winston.factory");
const GetUserDto = require("../DTO/get-users.dto");

class AuthService {
  static async validateUserInputInfo(newUserInfo) {
    const { email, first_name, last_name, age, password } = newUserInfo;

    //Cheking if any field is missed.
    if (!email || !first_name || !last_name || !age || !password) {
      throw new Error("Incomplete data to create a user.");
    }
    //Cheking data type
    if (
      typeof email !== "string" ||
      typeof first_name !== "string" ||
      typeof last_name !== "string" ||
      typeof age !== "number" ||
      typeof password !== "string"
    ) {
      throw new Error("Incorrect data types to create a user.");
    }
    //Cheking data length
    if (
      email.length < 1 ||
      email.length > 50 ||
      first_name.length < 1 ||
      first_name.length > 50 ||
      last_name.length < 1 ||
      last_name.length > 50 ||
      age < 18 ||
      password.length < 8 ||
      password.length > 22
    ) {
      throw new Error({ message: "Incorrect length for user fields." });
    }
  }

  //createUser
  static async createUser(newUserInfo) {
    //Validate info
    this.validateUserInputInfo(newUserInfo);
    const newUserInfoDTO = new NewUserDto(newUserInfo);
    const newUser = await Users.create(newUserInfoDTO);
    return newUser;
  }
  // login;
  static async login(email, password) {
    const user = await Users.findOne({ email });
    logger.debug(`find ${user}`);
    if (!user) {
      throw new Error("User not found.");
    }
    const tryPass = password;
    const userPass = user.password;
    logger.debug(`plain text: ${tryPass} and hash text ${userPass}`);

    const isPasswordValid = passwordIsValidated(tryPass, userPass);

    if (!isPasswordValid) {
      throw new Error("Password is incorrect.");
    }

    const userId = user._id;
    const userRole = user.role;
    logger.debug(`Data id ${userId} and role ${userRole}`);

    //Add date of login.
    const loginKey = await Users.updateOne(
      {_id: userId},
      { $set: { lastLogin: new Date() } &&
      { status: true } },
      {upsert: true}
    )
    logger.debug(`User with login date: ${JSON.stringify(loginKey)} is the same with ${user.lastLogin}?`)
    if (!loginKey) {
      throw new Error("Cannot save login date in mongodb.")
    }
    //Token generation.
    const tokenInfo = {
      id: userId,
      role: userRole,
    };
    const token = generateJwt(tokenInfo);
    logger.debug(`token bro:${token}`);

    return token;
  }

  static async deleteUsers() {
    const currentDate = new Date();
    const month = 3600000 * 24 * 30; 
    //The users that did not login in 30 days, change status to false.
    const dateToDelete = new Date(currentDate.getTime() - month);
    logger.debug(`Last ${JSON.stringify(dateToDelete)}`);
    const usersToFind = { lastLogin: { $lt: dateToDelete } };
    //Send email.
    const getUsers = await Users.find(usersToFind);
    logger.debug(
      `The follow users have not login in a month: ${JSON.stringify(
        getUsers
      )}`
    );
    
    const mailAdapter = new MailAdapter();
    for (const user of getUsers) {
      const userInfo = {
        email: user.email,
        name: user.first_name,
      };
      logger.debug(userInfo)
      const sendMailBye = mailAdapter.deleteUsers(userInfo);
      logger.debug(`The info is going to return: ${JSON.stringify(sendMailBye)}`);
    }
   
    //Work with db.
    const deleteUsers = await Users.updateMany(usersToFind, {
      $set: { status: false },
    });
    logger.debug(JSON.stringify(deleteUsers));
    if (!deleteUsers) {
      throw new Error ('Cannot delete users by service.')
    }
    return deleteUsers;
  }
  static async getUsers() {
    const usersToFind = { status: true };
    const users = await Users.find(usersToFind);
    logger.debug( `Active users:`, users)
    const usersDto = users.map((user) => new GetUserDto(user));
    logger.debug(`Look so pretty:`, usersDto)

    if (!users || !usersDto) {
      throw new Error (`The error is in service getUsers().`)
    }
    return usersDto;
  }

  static async forgotPassword(email) {
    if (!email) {
      throw new Error("Email is request.");
    }
    const user = await Users.findOne({ email });
    logger.debug(`find: ${user}`);
    if (!user) {
      throw new Error("User not found.");
    }
    logger.debug(`Is there ${user.email} and ${user.first_name}?`);
    const emailForToken = user.email;
    const nameForToken = user.first_name;
    const tokenInfo = {
      email: emailForToken,
      name: nameForToken,
    };
    logger.debug(`Token will have: ${JSON.stringify(tokenInfo)}`);
    const token = generateLinkJwt(tokenInfo); //Token expire in 3600
    logger.debug(`Token now is: ${token}.`);
    const resetPasswordLink = `http:/localhost:8080/api/auth/new-password/${token}`;
    logger.debug(`Look the link: ${resetPasswordLink}`);
    const mailAdapter = new MailAdapter();
    const sendMailToResetPass = mailAdapter.sendMessage(
      tokenInfo,
      resetPasswordLink
    );
    logger.debug(`The info is going to return: ${sendMailToResetPass}`);

    return sendMailToResetPass;
  }

  static async getMail(token) {
    const decoded = jwtVerifyLink(token);
    logger.debug(decoded);
    const email = decoded.tokenInfo.email;
    logger.debug(`debug email from service ${email}`);
    return email;
  }

  static async updatePassword(email, newPassword) {
    const user = await Users.findOne({ email: email });
    logger.debug(`user: ${user}`);
    if (!user) {
      throw new Error("User not found.");
    }

    const hashedPassword = user.password;
    logger.debug(`user old hashed pass: ${hashedPassword}`);
    const checkPass = passwordIsValidated(newPassword, hashedPassword);
    if (checkPass) {
      throw new Error("Cannot use the same password.");
    }

    const newPasswordHash = hashPassword(newPassword);
    logger.debug(`user NEW hashed pass: ${newPasswordHash}`);

    const updadatePass = await Users.findOneAndUpdate(
      { email: email },
      { password: newPasswordHash }
    );
    logger.debug(`should has new pass ${updadatePass}`);
    return updadatePass;
  }

  static async changeAuth(uid) {
    const changeUserToSales = await Users.findOneAndReplace(
      { _id: uid },
      { role: "sales" }
    );
    return changeUserToSales;
  }
  static async deleteUser(uid) {
    const deleteUser = await Users.findOneAndReplace(
      { _id: uid },
      { status: false }
    );
    return deleteUser;
  }
}

module.exports = AuthService;