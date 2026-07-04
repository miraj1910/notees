import { env } from "../config/env";

const prefix = `[${env.APP_NAME}]`;

export const logger = {
  info: (...args: unknown[]): void => {
    console.info(prefix, ...args);
  },
  warn: (...args: unknown[]): void => {
    console.warn(prefix, ...args);
  },
  error: (...args: unknown[]): void => {
    console.error(prefix, ...args);
  },
  debug: (...args: unknown[]): void => {
    if (env.APP_ENV === "development") {
      console.debug(prefix, ...args);
    }
  },
};
