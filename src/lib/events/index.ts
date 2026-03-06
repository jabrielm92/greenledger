/**
 * Event pipeline registration.
 *
 * Import this module once at app startup (or lazily on first use)
 * to wire all handlers to their events.
 */

export { emit, on } from "./dispatcher";
export type { PipelineEvent } from "./dispatcher";

import { on } from "./dispatcher";
import { handleAutoCreateEmission } from "./handlers/auto-create-emission";
import { handleAutoDetectSupplier } from "./handlers/auto-detect-supplier";
import { handleUpdateCompliance } from "./handlers/update-compliance";
import { handleFlagStaleReports } from "./handlers/flag-stale-reports";
import {
  notifyExtractionComplete,
  notifyExtractionFailed,
  notifyEmissionAutoCreated,
  notifySupplierAutoCreated,
} from "./handlers/create-notification";

// ── document.extracted ────────────────────────────────────────────
on("document.extracted", "auto-create-emission", handleAutoCreateEmission);
on("document.extracted", "auto-detect-supplier", handleAutoDetectSupplier);
on("document.extracted", "notify-extraction-complete", notifyExtractionComplete);

// ── document.extraction_failed ────────────────────────────────────
on("document.extraction_failed", "notify-extraction-failed", notifyExtractionFailed);

// ── emission.auto_created ─────────────────────────────────────────
on("emission.auto_created", "update-compliance", handleUpdateCompliance);
on("emission.auto_created", "flag-stale-reports", handleFlagStaleReports);
on("emission.auto_created", "notify-emission-created", notifyEmissionAutoCreated);

// ── supplier.auto_created ─────────────────────────────────────────
on("supplier.auto_created", "notify-supplier-created", notifySupplierAutoCreated);
