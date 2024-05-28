const { environment } = require("../configs/app.config");
let loggerByEnv;
switch (environment) {
  case "dev":
     loggerByEnv = require("../utils/winston/logger-dev.util");
    break;

  case "prod":
     loggerByEnv = require("../utils/winston/logger-prod.util");
    break;
  
  default:
     loggerByEnv = require("../utils/winston/logger-dev.util");
}
module.exports = loggerByEnv;