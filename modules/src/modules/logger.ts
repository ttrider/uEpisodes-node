import log4js from "log4js";
import os from "os";
import path from "path";
log4js.configure({
  appenders: {
    uepisodes: { type: "file", filename: path.resolve(os.tmpdir(), "uepisodes", "uepisodes.log") },
    output: { type: "file", filename: path.resolve(os.tmpdir(), "uepisodes", "output.log") },
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

export function getLogger(
  category?: string,
  level?: "trace" | "debug" | "info" | "warn" | "error" | "fatal" | "off"
) {
  const logger = log4js.getLogger(category);

  logger.level = level ?? "debug";
  return logger;
}
