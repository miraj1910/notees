import { NextRequest, NextResponse } from "next/server";
import logger from "@/lib/logger";

export async function GET(request: NextRequest) {
  const start = performance.now();

  logger.info({ method: "GET", path: "/api/notes" }, "GET /api/notes started");

  try {
    const data = { notes: [], message: "Notes API ready" };

    const duration = (performance.now() - start).toFixed(0);
    logger.info(
      { method: "GET", path: "/api/notes", status: 200, duration },
      "GET /api/notes 200 %sms",
      duration,
    );

    return NextResponse.json(data);
  } catch (error) {
    const duration = (performance.now() - start).toFixed(0);
    logger.error(
      { err: error, method: "GET", path: "/api/notes", duration },
      "GET /api/notes failed after %sms",
      duration,
    );

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
