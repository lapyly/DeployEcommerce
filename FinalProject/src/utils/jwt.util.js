const jwt = require("jsonwebtoken");
const { JWTSECRET } = require("../configs/app.config");
const { JWTlinksecret } = require("../configs/app.config");
const logger = require("../factory/winston.factory");

//REGISTER
//generate jwt token
const generateJwt = (tokenInfo) => {
  const payload = { tokenInfo };
  const token = jwt.sign(payload, JWTSECRET, { expiresIn: 6800 });
  return token
};

//authentication via jwt token
const authJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  logger.debug(`Auth Token: ${JSON.stringify(authHeader)}`)
  if (!authHeader)
    return res.status(401).json({ message: "Forbbiden." });

  const token = authHeader.split(" ")[1];
  logger.debug(`token: ${JSON.stringify(token)}`);
  logger.info(`AUTHENTICATION OK.`)
  next();
};

const jwtVerify = (token) => {
  const jwtVerif = jwt.verify(token, JWTSECRET);
  return jwtVerif;
};

//RESET PASSWORD
const generateLinkJwt = (tokenInfo) => {
  const payload = { tokenInfo };
  const token = jwt.sign(payload, JWTlinksecret, { expiresIn: 3600 });
  return token;
};

//authorización via token jwt
const authLinkJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  logger.debug(authHeader);
  if (!authHeader)
    return res.json(401).json({ status: "error", error: "Forbbiden." });

  const token = authHeader.split(" ")[1];
  logger.debug("token:", token);

  jwt.verify(token, JWTlinksecret, (error, credentials) => {
    req.tokenInfo = credentials.tokenInfo;

    next();
  });
};

const jwtVerifyLink = (token) => {
  const jwtVerify = jwt.verify(token, JWTlinksecret);
  return jwtVerify;
}

module.exports = {
  jwtVerifyLink,
  jwtVerify,
  generateJwt,
  generateLinkJwt,
  authJwt,
  authLinkJwt,
};