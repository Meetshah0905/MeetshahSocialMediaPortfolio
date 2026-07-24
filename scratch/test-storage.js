const path = require('path');

// We can test reading reports directly
const fs = require('fs');
const reportsPath = path.join(__dirname, '..', 'data', 'reports.json');
const reports = JSON.parse(fs.readFileSync(reportsPath, 'utf8'));

console.log("Loaded reports count:", reports.length);
reports.forEach(r => {
  console.log(`- ID: ${r.id} | Title: "${r.title}" | Status: ${r.status} | PDF: ${r.pdfStorageKey} (${r.pdfSizeBytes} bytes)`);
  const fullPdfPath = path.join(__dirname, '..', 'public', 'uploads', r.pdfStorageKey);
  console.log(`  File exists on disk: ${fs.existsSync(fullPdfPath)}`);
});
