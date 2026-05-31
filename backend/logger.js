const pino = require("pino");
const isDev = process.env.NODE_ENV !== "production";

const logger = pino({
  level: process.env.LOG_LEVEL || (isDev ? "debug" : "info"),
  redact: {
    paths: ["req.body.password", "req.headers.cookie", "req.headers.authorization"],
    censor: "[REDACTED]",
  },
  ...(isDev && {
    transport: { target: "pino-pretty", options: { colorize: true } },
  }),
});

module.exports = logger;
