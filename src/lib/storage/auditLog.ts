import fs from "fs";
import path from "path";

export interface AuditLogEntry {
  id: string;
  action:
    | "report_created"
    | "pdf_uploaded"
    | "draft_saved"
    | "published"
    | "unpublished"
    | "pdf_replaced"
    | "archived"
    | "deleted";
  reportId: string;
  adminUser: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

const AUDIT_LOG_PATH = path.join(process.cwd(), "data", "audit_log.json");

export async function logReportAudit(
  action: AuditLogEntry["action"],
  reportId: string,
  adminUser = "admin",
  details?: Record<string, unknown>
): Promise<AuditLogEntry> {
  const entry: AuditLogEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    action,
    reportId,
    adminUser,
    details,
    timestamp: new Date().toISOString(),
  };

  try {
    let logs: AuditLogEntry[] = [];
    if (fs.existsSync(AUDIT_LOG_PATH)) {
      const raw = fs.readFileSync(AUDIT_LOG_PATH, "utf-8");
      logs = JSON.parse(raw);
    }
    logs.unshift(entry);
    // Keep last 500 audit records
    if (logs.length > 500) logs = logs.slice(0, 500);

    const dir = path.dirname(AUDIT_LOG_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(AUDIT_LOG_PATH, JSON.stringify(logs, null, 2));
  } catch {
    // Non-blocking log write failure
  }

  return entry;
}

export async function listAuditLogs(reportId?: string): Promise<AuditLogEntry[]> {
  try {
    if (!fs.existsSync(AUDIT_LOG_PATH)) return [];
    const raw = fs.readFileSync(AUDIT_LOG_PATH, "utf-8");
    const logs: AuditLogEntry[] = JSON.parse(raw);
    if (reportId) return logs.filter((l) => l.reportId === reportId);
    return logs;
  } catch {
    return [];
  }
}
