const { Router } = require("express");
const router = Router();
//Service
const AuthService = require("../services/auth.service");
//Middlewares
const logger = require("../factory/winston.factory");
const authorization = require("../middlewares/auth.middleware");
const { authJwt } = require("../utils/jwt.util");
const generateUsers = require("../utils/faker/user-mock.util");
const CartService = require("../services/cart.service");


  //Controller of Auth Service
  router.post("/register", async (req, res) => {
    try {
      const { first_name, last_name, email, age, password } = req.body;
      
      const newCart = await CartService.createNewCart()

      const newUserInfo = {
        first_name,
        last_name,
        email,
        age,
        password,
        cart: newCart._id,
      };
      const newUser = await AuthService.createUser(newUserInfo);

      logger.info(`User: ${newUser}" has been created.`);
      return res.status(201).json({ message: "New user is created." });
    } catch (error) {
      if (
        error.message.includes("Incomplete data to create a user.") ||
        error.message.includes("Incorrect data types to create a user.") ||
        error.message.includes("Incorrect length for user fields.")
      ) {
        logger.warn(`Warning: ${error.message}`);
        return res.status(400).json({ message: error.message });
      }

      logger.error("Error creating users.", {
        error: error.message,
      });
      return res.status(500).json({ message: "Please try in an hour." });
    }
    });

  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Must write email and password." });
      }
      const token = await AuthService.login(email, password);
      //token in cookie
      res
        .cookie("authToken", token, {
          maxAge: 600000,
          httpOnly: true,
        })
        .status(200)
        .json({ message: "Login succesfull." });
    } catch (error) {
      if (
        error.message.includes("User not found.") ||
        error.message.includes("Password is incorrect.") ||
        error.message.includes("Cannot save login date in mongodb.")
      ) {
        logger.warn(`Warning: ${error.message}`);
        return res.status(400).json({ message: "Check your mail and password please." });
      }

      logger.error("Error login user.", {
        error: error.message,
      });
      return res.status(500).json({ message: "Please try in an hour." });
    }
  });
  
  router.get(
    "/users",
    authJwt,
    authorization("admin"),
    async (req, res) => {
      try {
        const users = await AuthService.getUsers();
        logger.info(`Active users: ${JSON.stringify(users)}.`);
        return res.status(200).json({ message: `The list of the users is: ${JSON.stringify(users)}.` });
      } catch (error) {
        if (
          error.message.includes(`The error is in service getUsers().`)
        ) {
          logger.warn("Problem getting profiles.", { message: error.message });
          res.status(400).json({message: `You cannot see the users.`})
        }
        logger.warn("Problem getting profiles.", { message: error.message });
        return res.status(500).json({ message: "Try in an hour." });
      }
    }
  );

  router.post("/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      await AuthService.forgotPassword(email);
      logger.info(`Password reset for ${email}.`);
      return res
        .status(200)
        .json({ message: `The email to reset password has been sent.` });
      } catch (error) {
      if (
        error.message.includes("Email is request.") ||
        error.message.includes("The user does not exist.")
      ) {
        logger.warn(`Warning: ${error.message}`);
        return res.status(400).json({ message: error.message });
      }

      logger.error("Error restoring password.", {
        error: error.message,
      });
      return res.status(500).json({ message: "Please try in an hour." });
    }
  });

  router.patch("/new-password/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;
          if (!newPassword) {
            res.status(400).json({message: "New password is required."});
      }
      const email = await AuthService.getMail(token);
      logger.debug(`debug email from controller: ${email}`);

      const resetPassword = await AuthService.updatePassword(email, newPassword);
      if (!resetPassword) {
        logger.error('not resetPassword')
      }
      logger.info(`${email} has reset the password.`);
      return res.status(200).json({ message: `Password has been reset.` });
    } catch (error) {
      if (
        error.message.includes("New password is required.") ||
        error.message.includes("User not found.") ||
        error.message.includes("Cannot use the same password.")
      ) {
        logger.warn(`Warning: ${error.message}`);
        return res.status(400).json({ message: 'Problems with new password.' });
      }
      logger.warn(`Warning: ${error.message}`);
      return res.status(500).json({ message: 'Try in an hour.'});
    }
  });
  router.patch(
    "/change-authorization/:uid",
    authJwt,
    authorization("admin"),
    async (req, res) => {
      try {
        const { uid } = req.params;
        await AuthService.changeAuth(uid);
        logger.info(`Now ID ${uid} has been change to sales.`);
        
        res.status(200).json({ message: `USer sales is OK.` });
      } catch (error) {
        logger.error(`Error changing user auth.`);
        return res.status(500).json({ message: error.message });
      }
    }
  );
  
  router.patch('/delete/:uid', authJwt, authorization("admin"), async (req, res) => {
    try {
      const { uid } = req.params
      await AuthService.deleteUser(uid);
    logger.info(`Now ID ${uid} has been deleted.`);
    
    res.status(200).json({ message: `USer delete is OK.` });
  } catch (error) {
    logger.error(`Error deleting user.`)
    return res.status(500).json({ message: error.message });
  }
})

router.delete("/old-users", authJwt, authorization("admin"), async (req, res) => {
  try {
    const deleteUsers = await AuthService.deleteUsers()
    logger.info(`The follow info of modify documents: ${JSON.stringify(deleteUsers)}`)
    res.status(201).json({ message: "Users have been deleted." })
  } catch (error) {
    if (
      error.message.includes("Cannot delete users by service.")
    ) {
      logger.warn('Error deleting users', { message: error.message })
      res.status(400).json({message: "You cannot delete users."})
    }
      
    res.status(500).json({message: "Please try in an hour."})
  }
});

router.post('/mock/:mid', authJwt,authorization("admin"),async (req, res) => {
  try {
    const { mid } = req.params;

    const mock = await generateUsers(mid);
    logger.info(`The follow list of users are mock ones: ${JSON.stringify(mock)}`);
    res.status(201).json({ message: "New users in db." });
  } catch (error) {
    res.status(400).json({message: `Problem with mock users. ${error}`})
  }
})
module.exports = router;
