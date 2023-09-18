const { format, createLogger, transports } = require("winston");
const { combine, timestamp, label, json } = format;
require("winston-daily-rotate-file");
require("winston-mongodb");
require("dotenv").config();

const fileRotateTransport = new transports.DailyRotateFile({
  filename: "logs/rotate-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxFiles: "30d",
  auditFile: "logs/audit-log.json",
});

const logger = createLogger({
  level: "debug",
  format: combine(
    timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    json()
  ),
  transports: [
    fileRotateTransport,
    // new transports.MongoDB({
    //   collection: "logsinfo",
    //   level: "debug",
    //   db: process.env.MONGODB_URL,
    //   options: { useUnifiedTopology: true },
    // }),
  ],
});
logger.on("finish", function (info) {
  // All `info` log messages has now been logged
});

module.exports = logger;
