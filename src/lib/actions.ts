"use server";

import logger from "./logger";
import { logServerActionError } from "./error-logger";

export async function logServerAction<T>(
  actionName: string,
  fn: () => Promise<T>,
): Promise<T> {
  const start = performance.now();
  logger.info({ action: actionName }, "ServerAction:%s started", actionName);

  try {
    const result = await fn();
    const duration = (performance.now() - start).toFixed(0);
    logger.info(
      { action: actionName, duration },
      "ServerAction:%s completed in %sms",
      actionName,
      duration,
    );
    return result;
  } catch (error) {
    const duration = (performance.now() - start).toFixed(0);
    logServerActionError(actionName, error);
    logger.error(
      { action: actionName, duration },
      "ServerAction:%s failed after %sms",
      actionName,
      duration,
    );
    throw error;
  }
}
