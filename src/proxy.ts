import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import logger from "./lib/logger";

export function proxy(request: NextRequest) {
  const { method, nextUrl } = request;
  const path = nextUrl.pathname;
  const start = performance.now();

  logger.info({ method, path }, "Request %s %s", method, path);

  const response = NextResponse.next();

  const duration = (performance.now() - start).toFixed(0);
  logger.debug(
    { method, path, status: response.status, duration },
    "%s %s %d %sms",
    method,
    path,
    response.status,
    duration,
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
