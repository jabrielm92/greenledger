import { NextResponse } from "next/server";
import { testConnection } from "@/lib/storage";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const health = {
    status: "healthy" as string,
    timestamp: new Date().toISOString(),
    checks: {
      database: false,
      storage: false,
    },
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    health.checks.database = true;
  } catch (error) {
    health.status = "unhealthy";
    console.error("Database health check failed:", error);
  }

  try {
    health.checks.storage = await testConnection();
    if (!health.checks.storage) {
      // Storage not configured is not unhealthy in dev
      if (process.env.NODE_ENV === "production") {
        health.status = "unhealthy";
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      health.status = "unhealthy";
    }
    console.error("Storage health check failed:", error);
  }

  const statusCode = health.status === "healthy" ? 200 : 503;
  return NextResponse.json(health, { status: statusCode });
}
