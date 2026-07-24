const fs = require('fs');
const path = require('path');

console.log("ENV UPSTASH_REDIS_REST_URL:", process.env.UPSTASH_REDIS_REST_URL ? "SET" : "NOT SET");
console.log("ENV BLOB_READ_WRITE_TOKEN:", process.env.BLOB_READ_WRITE_TOKEN ? "SET" : "NOT SET");

const reportsPath = path.join(__dirname, '..', 'data', 'reports.json');
if (fs.existsSync(reportsPath)) {
  console.log("reports.json exists, size:", fs.statSync(reportsPath).size);
  console.log("reports.json content:", fs.readFileSync(reportsPath, 'utf8'));
} else {
  console.log("reports.json does NOT exist");
}
