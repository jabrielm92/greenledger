import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import * as fs from "fs/promises";
import * as path from "path";

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession();
    if ((session?.user as { role?: string })?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const backupDir = "./backups";

    let files: string[];
    try {
      files = await fs.readdir(backupDir);
    } catch {
      return NextResponse.json({
        status: "error",
        message: "Backup directory not found",
        lastBackup: null,
      }, { status: 500 });
    }

    const backups = files.filter((f) => f.endsWith(".sql.gz")).sort().reverse();

    if (backups.length === 0) {
      return NextResponse.json({
        status: "warning",
        message: "No backups found",
        lastBackup: null,
      });
    }

    const latestFile = path.join(backupDir, backups[0]);
    const stats = await fs.stat(latestFile);
    const ageHours = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60);

    const isRecent = ageHours < 26;
    const status = isRecent ? "healthy" : "warning";

    return NextResponse.json({
      status,
      lastBackup: {
        file: backups[0],
        size: stats.size,
        created: stats.mtime,
        ageHours: Math.round(ageHours * 10) / 10,
      },
      totalBackups: backups.length,
      backups: backups.slice(0, 10),
    });
  } catch (error) {
    console.error("Backup status error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to check backup status" },
      { status: 500 }
    );
  }
}
