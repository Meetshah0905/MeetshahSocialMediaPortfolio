import fs from "node:fs";
import path from "node:path";

export interface UnansweredQuestionRecord {
  id: string;
  question: string;
  classifiedIntent: string;
  reason: string;
  pagePath?: string;
  createdAt: string;
  reviewStatus: "pending" | "reviewed" | "resolved";
}

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "unanswered_questions.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export async function listUnansweredQuestions(): Promise<UnansweredQuestionRecord[]> {
  ensureDataDir();
  if (!fs.existsSync(FILE_PATH)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function recordUnansweredQuestion(
  question: string,
  classifiedIntent: string,
  reason: string,
  pagePath?: string
): Promise<UnansweredQuestionRecord> {
  const existing = await listUnansweredQuestions();
  const now = new Date().toISOString();
  const record: UnansweredQuestionRecord = {
    id: `unans_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    question: question.slice(0, 500),
    classifiedIntent,
    reason: reason.slice(0, 500),
    pagePath: pagePath ? pagePath.slice(0, 200) : undefined,
    createdAt: now,
    reviewStatus: "pending",
  };

  // Keep last 500 records
  const updated = [record, ...existing].slice(0, 500);
  ensureDataDir();
  fs.writeFileSync(FILE_PATH, JSON.stringify(updated, null, 2), "utf-8");

  return record;
}
