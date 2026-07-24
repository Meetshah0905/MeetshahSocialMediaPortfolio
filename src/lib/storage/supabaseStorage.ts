import fs from "fs";
import path from "path";

const BUCKET_NAME = "analytics-reports";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isSupabaseConfigured = Boolean(supabaseUrl && supabaseServiceKey);

/**
 * Builds recommended Supabase Storage path (§1):
 * youtube-main/2026/90-days/meet-shah-youtube-90-days-2026-05-01-to-2026-07-29.pdf
 */
export function buildReportStoragePath(
  channel: string,
  periodStart: string,
  reportWindow: string,
  filename: string
): string {
  const year = new Date(periodStart).getFullYear() || new Date().getFullYear();
  const windowSubfolder = reportWindow === "custom" ? "custom" : `${reportWindow}-days`;
  const sanitizedFilename = filename.toLowerCase().replace(/[^a-z0-9._-]/g, "-");
  return `${channel}/${year}/${windowSubfolder}/${sanitizedFilename}`;
}

export interface UploadStorageResult {
  success: boolean;
  storageKey: string;
  publicUrl: string;
  error?: string;
}

export async function uploadReportPdfToStorage(
  channel: string,
  periodStart: string,
  reportWindow: string,
  filename: string,
  fileBuffer: Buffer
): Promise<UploadStorageResult> {
  const storageKey = buildReportStoragePath(channel, periodStart, reportWindow, filename);

  if (isSupabaseConfigured && supabaseUrl && supabaseServiceKey) {
    try {
      const uploadEndpoint = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${BUCKET_NAME}/${storageKey}`;
      const res = await fetch(uploadEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${supabaseServiceKey}`,
          apikey: supabaseServiceKey,
          "Content-Type": "application/pdf",
          "x-upsert": "true",
        },
        body: new Uint8Array(fileBuffer),
      });

      if (!res.ok) {
        const errText = await res.text();
        return { success: false, storageKey: "", publicUrl: "", error: `Storage upload failed: ${errText}` };
      }

      // Generate initial signed URL
      const signedUrl = await getReportSignedUrl(storageKey, 3600);

      return {
        success: true,
        storageKey,
        publicUrl: signedUrl || `/api/reports/pdf?key=${encodeURIComponent(storageKey)}`,
      };
    } catch (err) {
      return {
        success: false,
        storageKey: "",
        publicUrl: "",
        error: err instanceof Error ? err.message : "Supabase Storage upload failed.",
      };
    }
  }

  // Local filesystem fallback (§1 local dev)
  try {
    const localDir = path.join(process.cwd(), "uploads", "reports", path.dirname(storageKey));
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    const localFilePath = path.join(process.cwd(), "uploads", "reports", storageKey);
    fs.writeFileSync(localFilePath, fileBuffer);

    return {
      success: true,
      storageKey,
      publicUrl: `/uploads/reports/${storageKey}`,
    };
  } catch (err) {
    return {
      success: false,
      storageKey: "",
      publicUrl: "",
      error: err instanceof Error ? err.message : "Local storage upload failed.",
    };
  }
}

export async function getReportSignedUrl(
  storageKey: string,
  expiresInSeconds = 3600
): Promise<string> {
  if (isSupabaseConfigured && supabaseUrl && supabaseServiceKey) {
    try {
      const signEndpoint = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/sign/${BUCKET_NAME}/${storageKey}`;
      const res = await fetch(signEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${supabaseServiceKey}`,
          apikey: supabaseServiceKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expiresIn: expiresInSeconds }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.signedURL) {
          const fullSignedUrl = data.signedURL.startsWith("http")
            ? data.signedURL
            : `${supabaseUrl.replace(/\/$/, "")}/storage/v1${data.signedURL}`;
          return fullSignedUrl;
        }
      }
    } catch {
      // Fallback local URL
    }
  }

  return `/uploads/reports/${storageKey}`;
}

export async function deleteReportFromStorage(storageKey: string): Promise<boolean> {
  if (!storageKey) return true;

  if (isSupabaseConfigured && supabaseUrl && supabaseServiceKey) {
    try {
      const deleteEndpoint = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${BUCKET_NAME}`;
      await fetch(deleteEndpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${supabaseServiceKey}`,
          apikey: supabaseServiceKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prefixes: [storageKey] }),
      });
      return true;
    } catch {
      // Fallback local cleanup
    }
  }

  try {
    const localFilePath = path.join(process.cwd(), "uploads", "reports", storageKey);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return true;
  } catch {
    return false;
  }
}
