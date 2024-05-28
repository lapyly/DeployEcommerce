const winston = require("winston");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize } = format;
const levels = require("../../configs/winston.config");

const logger = createLogger({
  //level: "debug",
  levels: levels.levels,
  format: combine(
    timestamp(),
    colorize({ colors: levels.colors }),
    printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: "logs/debug-error.log",
      level: "debug",
      format: format.simple(),
    }),
  ],
});

module.exports = logger;