import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import { StorageNotConfiguredError } from "./db";

export type ProposalStatus = "new" | "reviewed" | "contacted" | "archived";

export type ProposalInquiry = {
  id: string;
  name: string;
  email: string;
  brand: string;
  vertical: string;
  budget: string;
  timeline: string;
  message: string;
  status: ProposalStatus;
  createdAt: string;
  updatedAt: string;
};

const PROPOSALS_PATH = path.join(process.cwd(), "data", "proposals.json");

const isRedisConfigured =
  typeof process !== "undefined" &&
  Boolean(process.env.UPSTASH_REDIS_REST_URL) &&
  Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

const redis = isRedisConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

const isProductionWithoutRedis =
  process.env.NODE_ENV === "production" && !isRedisConfigured;

function readJSONFile<T>(filePath: string, seed: T): T {
  try {
    const parentDir = path.dirname(filePath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
      if (!isProductionWithoutRedis) {
        writeJSONFile(filePath, seed);
      }
      return seed;
    }

    const data = fs.readFileSync(filePath, "utf-8");
    if (!data || !data.trim()) return seed;
    return JSON.parse(data) as T;
  } catch (err) {
    console.error(`Error reading JSON file ${filePath}:`, err);
    return seed;
  }
}

function writeJSONFile<T>(filePath: string, data: T): void {
  if (isProductionWithoutRedis) {
    throw new StorageNotConfiguredError();
  }
  const parentDir = path.dirname(filePath);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }
  const tempPath = `${filePath}.tmp.${Date.now()}.${Math.random().toString(36).slice(2, 6)}`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tempPath, filePath);
}

export async function saveProposalInquiry(inquiry: ProposalInquiry): Promise<void> {
  if (redis) {
    await redis.set(`proposal-inquiry:${inquiry.id}`, inquiry);
    return;
  }

  const list = readJSONFile<ProposalInquiry[]>(PROPOSALS_PATH, []);
  const idx = list.findIndex((p) => p.id === inquiry.id);
  if (idx >= 0) {
    list[idx] = inquiry;
  } else {
    list.push(inquiry);
  }
  writeJSONFile(PROPOSALS_PATH, list);
}

export async function listProposalInquiries(): Promise<ProposalInquiry[]> {
  let list: ProposalInquiry[] = [];
  if (redis) {
    const keys = await redis.keys("proposal-inquiry:*");
    for (const key of keys) {
      const p = await redis.get<ProposalInquiry>(key);
      if (p) list.push(p);
    }
  } else {
    list = readJSONFile<ProposalInquiry[]>(PROPOSALS_PATH, []);
  }

  // Sort newest first
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getProposalInquiry(id: string): Promise<ProposalInquiry | null> {
  if (redis) {
    const item = await redis.get<ProposalInquiry>(`proposal-inquiry:${id}`);
    if (item) return item;
  }
  const list = readJSONFile<ProposalInquiry[]>(PROPOSALS_PATH, []);
  return list.find((p) => p.id === id) ?? null;
}

export async function updateProposalInquiryStatus(
  id: string,
  status: ProposalStatus
): Promise<ProposalInquiry | null> {
  const existing = await getProposalInquiry(id);
  if (!existing) return null;

  const updated: ProposalInquiry = {
    ...existing,
    status,
    updatedAt: new Date().toISOString(),
  };

  await saveProposalInquiry(updated);
  return updated;
}

export async function deleteProposalInquiry(id: string): Promise<boolean> {
  if (redis) {
    const deletedCount = await redis.del(`proposal-inquiry:${id}`);
    return deletedCount > 0;
  }

  const list = readJSONFile<ProposalInquiry[]>(PROPOSALS_PATH, []);
  const filtered = list.filter((p) => p.id !== id);
  if (filtered.length === list.length) {
    return false;
  }
  writeJSONFile(PROPOSALS_PATH, filtered);
  return true;
}
