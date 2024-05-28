const logger = require("../factory/winston.factory");
const { jwtVerify } = require("../utils/jwt.util");

const authorization = (role) => {
  return (req,res,next) => {
    const authToken = req.headers.authorization;
    logger.debug(`Auth Token from middleware: ${JSON.stringify(authToken)}`);
    if (!authToken) {
    logger.warn(`People trying to get authorization without it.`)
      return res.status(401).json({ message: "Forbbiden." });
    }
    const token = authToken.split(" ")[1];
    logger.debug(`SPLIT token: ${JSON.stringify(token)}`);
    
    const decoded = jwtVerify(token);
    logger.debug(`From authorization middleware: ${JSON.stringify(decoded)}`);
  const roleOK = decoded.tokenInfo.role;
  logger.debug(`debug role: ${roleOK}`);
  
    if (!roleOK){   
      return res
        .status(401)
        .json({ status: "error", error: "Login again." });
      }
    if (roleOK !== role){
      return res.status(403).json({ status: "error", error: "Forbidden." });
    }
      logger.info(`AUTHORIZATION OK.`);
    next();
  }
};

module.exports = authorization;
