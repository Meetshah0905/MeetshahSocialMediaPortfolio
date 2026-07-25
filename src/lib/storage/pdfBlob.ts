import { put, del, head } from "@vercel/blob";
import crypto from "crypto";
import type { ChannelSlug, ReportWindow } from "./db";
import { uploadReportPdfToStorage, getReportSignedUrl } from "./supabaseStorage";

/**
 * PDF blob storage.
 * Supports Vercel Blob, Supabase Storage, local public/uploads, and Data URL fallback for Vercel.
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
      "Persistent PDF storage warning: BLOB_READ_WRITE_TOKEN is not set.",
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

function sanitizeSegment(input: string): string {
  return input.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
}

function isoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

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

  // 1. Try Vercel Blob
  if (hasBlobToken()) {
    try {
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
    } catch (err) {
      console.warn("Vercel Blob upload failed, falling back:", err);
    }
  }

  // 2. Try Supabase Storage
  try {
    const supabaseRes = await uploadReportPdfToStorage(
      input.channel,
      input.periodStart,
      input.reportWindow,
      input.file.name,
      buffer,
    );
    if (supabaseRes.success && supabaseRes.publicUrl) {
      return {
        url: supabaseRes.publicUrl,
        storageKey: supabaseRes.storageKey,
        sizeBytes: input.file.size,
        sha256,
      };
    }
  } catch (err) {
    console.warn("Supabase Storage upload skipped/failed:", err);
  }

  // 3. Try Local / Serverless filesystem
  try {
    const fs = await import("fs");
    const path = await import("path");
    const localDir = path.join(process.cwd(), "public", "uploads", path.dirname(key));
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    const localPath = path.join(process.cwd(), "public", "uploads", key);
    fs.writeFileSync(localPath, buffer);

    return {
      url: `/uploads/${key}`,
      storageKey: key,
      sizeBytes: input.file.size,
      sha256,
    };
  } catch (err) {
    console.warn("Local disk write skipped, generating Data URL fallback:", err);
  }

  // 4. Data URL fallback for read-only Vercel serverless disk
  const base64 = buffer.toString("base64");
  const dataUrl = `data:application/pdf;base64,${base64}`;
  return {
    url: dataUrl,
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
    try {
      const blob = await put(key, buffer, {
        access: "public",
        contentType: input.file.type,
        allowOverwrite: true,
      });
      return { url: blob.url, storageKey: blob.pathname, sizeBytes: input.file.size };
    } catch {
      // Fallback
    }
  }

  try {
    const fs = await import("fs");
    const path = await import("path");
    const localDir = path.join(process.cwd(), "public", "uploads", path.dirname(key));
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    const localPath = path.join(process.cwd(), "public", "uploads", key);
    fs.writeFileSync(localPath, buffer);
    return { url: `/uploads/${key}`, storageKey: key, sizeBytes: input.file.size };
  } catch {
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${input.file.type};base64,${base64}`;
    return { url: dataUrl, storageKey: key, sizeBytes: input.file.size };
  }
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

  try {
    const fs = await import("fs");
    const path = await import("path");
    const localPath = path.join(process.cwd(), "public", "uploads", storageKey);
    if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
  } catch (err) {
    console.warn("Local blob delete failed", storageKey, err);
  }
}

export async function blobExists(storageKey: string): Promise<boolean> {
  if (!storageKey) return false;
  if (storageKey.startsWith("data:") || storageKey.includes("reports/")) return true;
  if (hasBlobToken()) {
    try {
      await head(storageKey);
      return true;
    } catch {
      return false;
    }
  }
  try {
    const fs = await import("fs");
    const path = await import("path");
    const p1 = path.join(process.cwd(), "public", "uploads", storageKey);
    const p2 = path.join(process.cwd(), "uploads", "reports", storageKey);
    return fs.existsSync(p1) || fs.existsSync(p2);
  } catch {
    return true;
  }
}

export function isBlobConfigured(): boolean {
  return true;
}
