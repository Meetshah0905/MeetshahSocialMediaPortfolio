import { put, del, head } from "@vercel/blob";
import crypto from "crypto";
import type { ChannelSlug, ReportWindow } from "./db";

/**
 * PDF blob storage (§8 of the reform prompt).
 *
 * Uploaded PDFs must survive redeploys, so we store them in Vercel Blob when a
 * BLOB_READ_WRITE_TOKEN is configured. Locally, without a token, we fall back
 * to `public/uploads/reports/` — enough for smoke testing but explicitly not
 * production-safe. Production without a token throws BlobNotConfiguredError so
 * the admin knows persistence is not wired up.
 */

export const MAX_PDF_BYTES = 25 * 1024 * 1024; // 25 MB
export const MAX_COVER_BYTES = 5 * 1024 * 1024; // 5 MB

const PDF_MIME = "application/pdf";
const COVER_MIMES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
]);

export class BlobNotConfiguredError extends Error {
  constructor() {
    super(
      "Persistent PDF storage is not configured. Set BLOB_READ_WRITE_TOKEN (Vercel Blob) — the filesystem is ephemeral in production.",
    );
    this.name = "BlobNotConfiguredError";
  }
}

export class InvalidUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidUploadError";
  }
}

const hasBlobToken = () =>
  typeof process !== "undefined" && !!process.env.BLOB_READ_WRITE_TOKEN;

const isProduction = () =>
  typeof process !== "undefined" && process.env.NODE_ENV === "production";

function sanitizeSegment(input: string): string {
  return input.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
}

function isoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Build the canonical stored filename for a report PDF.
 *
 * meet-shah-<channel>-<window>-days-<start>-to-<end>.pdf
 * The extension is preserved from the original filename after sanitization.
 */
export function buildReportPdfFilename(input: {
  channel: ChannelSlug;
  reportWindow: ReportWindow;
  periodStart: string;
  periodEnd: string;
}): string {
  const win = input.reportWindow === "custom" ? "custom-period" : `${input.reportWindow}-days`;
  return sanitizeSegment(
    `meet-shah-${input.channel}-${win}-${input.periodStart}-to-${input.periodEnd}.pdf`,
  );
}

export async function sha256OfBuffer(buffer: Buffer): Promise<string> {
  const hash = crypto.createHash("sha256");
  hash.update(buffer);
  return hash.digest("hex");
}

export type StoredPdf = {
  url: string;
  storageKey: string;
  sizeBytes: number;
  sha256: string;
};

export type StoredCover = {
  url: string;
  storageKey: string;
  sizeBytes: number;
};

export function validatePdfUpload(file: {
  arrayBuffer: () => Promise<ArrayBuffer>;
  type: string;
  size: number;
  name: string;
}) {
  if (file.type !== PDF_MIME) {
    throw new InvalidUploadError(
      `Only PDF files are accepted (received ${file.type || "unknown type"}).`,
    );
  }
  if (file.size > MAX_PDF_BYTES) {
    throw new InvalidUploadError(
      `PDF is ${(file.size / 1024 / 1024).toFixed(1)} MB; the limit is ${MAX_PDF_BYTES / 1024 / 1024} MB.`,
    );
  }
  if (file.size === 0) {
    throw new InvalidUploadError("The PDF is empty.");
  }
}

/** Read the file magic bytes to verify it is really a PDF (%PDF-). */
export function assertPdfMagic(buffer: Buffer) {
  const header = buffer.slice(0, 5).toString("ascii");
  if (header !== "%PDF-") {
    throw new InvalidUploadError(
      "The uploaded file is not a valid PDF (missing %PDF- header).",
    );
  }
}

export async function storePdf(input: {
  file: File;
  channel: ChannelSlug;
  reportWindow: ReportWindow;
  periodStart: string;
  periodEnd: string;
}): Promise<StoredPdf> {
  validatePdfUpload(input.file);

  const buffer = Buffer.from(await input.file.arrayBuffer());
  assertPdfMagic(buffer);

  const sha256 = await sha256OfBuffer(buffer);
  const filename = buildReportPdfFilename(input);
  const key = `reports/${input.channel}/${isoDate()}/${sha256.slice(0, 12)}-${filename}`;

  if (hasBlobToken()) {
    const blob = await put(key, buffer, {
      access: "public",
      contentType: PDF_MIME,
      allowOverwrite: false,
    });
    return {
      url: blob.url,
      storageKey: blob.pathname,
      sizeBytes: input.file.size,
      sha256,
    };
  }

  if (isProduction()) throw new BlobNotConfiguredError();

  // Local dev fallback — writes to public/uploads so /uploads/... serves it.
  const fs = await import("fs");
  const path = await import("path");
  const localDir = path.join(process.cwd(), "public", "uploads", path.dirname(key));
  fs.mkdirSync(localDir, { recursive: true });
  const localPath = path.join(process.cwd(), "public", "uploads", key);
  fs.writeFileSync(localPath, buffer);

  return {
    url: `/uploads/${key}`,
    storageKey: key,
    sizeBytes: input.file.size,
    sha256,
  };
}

export async function storeCover(input: {
  file: File;
  channel: ChannelSlug;
  reportSlug: string;
}): Promise<StoredCover> {
  if (!COVER_MIMES.has(input.file.type)) {
    throw new InvalidUploadError(
      `Cover image must be PNG, JPEG or WebP (received ${input.file.type || "unknown type"}).`,
    );
  }
  if (input.file.size > MAX_COVER_BYTES) {
    throw new InvalidUploadError(
      `Cover image is ${(input.file.size / 1024 / 1024).toFixed(1)} MB; the limit is ${MAX_COVER_BYTES / 1024 / 1024} MB.`,
    );
  }

  const buffer = Buffer.from(await input.file.arrayBuffer());
  const ext = input.file.type === "image/png"
    ? "png"
    : input.file.type === "image/webp"
      ? "webp"
      : "jpg";
  const key = `report-covers/${input.channel}/${input.reportSlug}.${ext}`;

  if (hasBlobToken()) {
    const blob = await put(key, buffer, {
      access: "public",
      contentType: input.file.type,
      allowOverwrite: true,
    });
    return { url: blob.url, storageKey: blob.pathname, sizeBytes: input.file.size };
  }

  if (isProduction()) throw new BlobNotConfiguredError();

  const fs = await import("fs");
  const path = await import("path");
  const localDir = path.join(process.cwd(), "public", "uploads", path.dirname(key));
  fs.mkdirSync(localDir, { recursive: true });
  const localPath = path.join(process.cwd(), "public", "uploads", key);
  fs.writeFileSync(localPath, buffer);
  return { url: `/uploads/${key}`, storageKey: key, sizeBytes: input.file.size };
}

export async function deleteStoredBlob(storageKey: string): Promise<void> {
  if (!storageKey) return;
  if (hasBlobToken()) {
    try {
      await del(storageKey);
    } catch (err) {
      console.warn("Blob delete failed", storageKey, err);
    }
    return;
  }

  const fs = await import("fs");
  const path = await import("path");
  const localPath = path.join(process.cwd(), "public", "uploads", storageKey);
  try {
    if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
  } catch (err) {
    console.warn("Local blob delete failed", localPath, err);
  }
}

export async function blobExists(storageKey: string): Promise<boolean> {
  if (!storageKey) return false;
  if (hasBlobToken()) {
    try {
      await head(storageKey);
      return true;
    } catch {
      return false;
    }
  }
  const fs = await import("fs");
  const path = await import("path");
  return fs.existsSync(path.join(process.cwd(), "public", "uploads", storageKey));
}

export function isBlobConfigured(): boolean {
  return hasBlobToken() || !isProduction();
}
