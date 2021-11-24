import log4js from "log4js";
log4js.configure({
  appenders: {
    uepisodes: { type: "file", filename: "uepisodes.log" },
    output: { type: "file", filename: "output.log" },
    err: { type: "stdout" },
    console: { type: "console" },
  },
  categories: {
    default: {
      appenders: ["uepisodes", "err", "console"],
      level: "debug",
    },
    output: {
      appenders: ["output"],
      level: "debug",
    },
  },
});

export default function getLogger(
  category?: string,
  level?: "trace" | "debug" | "info" | "warn" | "error" | "fatal" | "off"
) {
  const logger = log4js.getLogger(category);

  logger.level = level ?? "debug";
  return logger;
}
