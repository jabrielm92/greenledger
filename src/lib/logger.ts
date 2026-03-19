type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  [key: string]: unknown;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) || (process.env.NODE_ENV === "production" ? "info" : "debug");

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function formatLog(entry: LogEntry): string {
  return JSON.stringify(entry);
}

function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  if (!shouldLog(level)) return;

  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };

  const output = formatLog(entry);

  switch (level) {
    case "error":
      console.error(output);
      break;
    case "warn":
      console.warn(output);
      break;
    default:
      console.log(output);
  }
}

/**
 * Capture an exception for error monitoring.
 * If Sentry is configured (via @sentry/nextjs), reports to Sentry.
 */
export function captureException(
  error: Error,
  context?: Record<string, unknown>
) {
  log("error", error.message, {
    stack: error.stack,
    ...context,
  });

  // Sentry integration (lazy-loaded, only if installed)
  if (process.env.SENTRY_DSN && process.env.NODE_ENV === "production") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Sentry = require("@sentry/nextjs");
      Sentry.captureException(error, { extra: context });
    } catch {
      // @sentry/nextjs not installed — that's fine
    }
  }
}

/**
 * Capture a warning message for monitoring.
 */
export function captureMessage(
  message: string,
  context?: Record<string, unknown>
) {
  log("warn", message, context);

  if (process.env.SENTRY_DSN && process.env.NODE_ENV === "production") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Sentry = require("@sentry/nextjs");
      Sentry.captureMessage(message, { level: "warning", extra: context });
    } catch {
      // @sentry/nextjs not installed — that's fine
    }
  }
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => log("debug", message, meta),
  info: (message: string, meta?: Record<string, unknown>) => log("info", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log("warn", message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log("error", message, meta),
  captureException,
  captureMessage,
};
