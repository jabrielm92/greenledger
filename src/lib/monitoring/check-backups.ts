import * as fs from "fs/promises";
import * as path from "path";
import { logger } from "@/lib/logger";

/**
 * Check backup health and return status.
 * Can be called from cron endpoints or admin dashboards.
 */
export async function checkBackupHealth(): Promise<{
  healthy: boolean;
  message: string;
  details?: { file: string; sizeKB: number; ageHours: number };
}> {
  const backupDir = "./backups";

  try {
    const files = await fs.readdir(backupDir);
    const backups = files.filter((f) => f.endsWith(".sql.gz"));

    if (backups.length === 0) {
      logger.error("No database backups found");
      return { healthy: false, message: "No backups found" };
    }

    const latest = backups.sort().reverse()[0];
    const stats = await fs.stat(path.join(backupDir, latest));
    const ageHours = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60);
    const sizeKB = Math.round(stats.size / 1024);

    if (ageHours > 26) {
      logger.warn("Stale database backup", { file: latest, ageHours: Math.round(ageHours) });
      return {
        healthy: false,
        message: `Latest backup is ${Math.round(ageHours)} hours old`,
        details: { file: latest, sizeKB, ageHours: Math.round(ageHours) },
      };
    }

    if (stats.size < 1024) {
      logger.warn("Suspiciously small backup", { file: latest, sizeKB });
      return {
        healthy: false,
        message: `Backup file is only ${sizeKB}KB`,
        details: { file: latest, sizeKB, ageHours: Math.round(ageHours) },
      };
    }

    logger.info("Backup health check passed", {
      file: latest,
      sizeMB: (stats.size / 1024 / 1024).toFixed(1),
      ageHours: Math.round(ageHours),
    });

    return {
      healthy: true,
      message: "Backup is healthy",
      details: { file: latest, sizeKB, ageHours: Math.round(ageHours) },
    };
  } catch (error) {
    logger.error("Backup health check failed", { error: String(error) });
    return { healthy: false, message: `Check failed: ${error}` };
  }
}
