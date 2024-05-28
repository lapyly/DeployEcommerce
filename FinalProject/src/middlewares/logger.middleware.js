const loggerByEnv = require("../factory/winston.factory");

const logger = (req, res, next) => {
  req.logger = loggerByEnv;
  req.logger.info(
    `${req.method}-${req.url}/${
      req.headers["user-agent"]
    }-${new Date().toUTCString()}`
  );

  next();
};

module.exports = logger;
