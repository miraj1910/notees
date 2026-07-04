const prefix = "[Blackline Notes]";

function isDev(): boolean {
  return typeof window !== "undefined" && window.__ENV?.APP_ENV === "development";
}

export const clientLogger = {
  debug: (...args: unknown[]) => {
    if (isDev()) {
      console.debug(prefix, ...args);
    }
  },
  info: (...args: unknown[]) => {
    console.info(prefix, ...args);
  },
  warn: (...args: unknown[]) => {
    console.warn(prefix, ...args);
  },
  error: (...args: unknown[]) => {
    console.error(prefix, ...args);
  },
};
