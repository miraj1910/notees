import logger from "./logger";

export function logError(error: unknown, context?: Record<string, unknown>): void {
  if (error instanceof Error) {
    logger.error({ err: error, ...context }, error.message);
  } else {
    logger.error({ error, ...context }, "Non-Error thrown");
  }
}

export function logApiError(error: unknown, req: { method: string; url: string }): void {
  logError(error, {
    type: "api_error",
    method: req.method,
    path: req.url,
  });
}

export function logServerActionError(
  actionName: string,
  error: unknown,
  args?: Record<string, unknown>,
): void {
  logError(error, {
    type: "server_action_error",
    action: actionName,
    ...args,
  });
}
