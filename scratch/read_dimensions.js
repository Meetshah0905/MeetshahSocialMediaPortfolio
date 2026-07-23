const fs = require("fs");
const path = require("path");

function getPngSize(buffer) {
  if (buffer.readUInt32BE(0) !== 0x89504e47) return null;
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

function getJpgSize(buffer) {
  if (buffer.readUInt16BE(0) !== 0xffd8) return null;
  let offset = 2;
  while (offset < buffer.length) {
    const marker = buffer.readUInt16BE(offset);
    offset += 2;
    if (marker === 0xffd9) break; // EOI
    if (marker === 0xffda) break; // SOS (Start of Scan - image data starts)
    
    const length = buffer.readUInt16BE(offset);
    if (marker >= 0xffc0 && marker <= 0xffc3 || marker >= 0xffc5 && marker <= 0xffc7 || marker >= 0xffc9 && marker <= 0xffcb || marker >= 0xffcd && marker <= 0xffcf) {
      // SOF marker
      const height = buffer.readUInt16BE(offset + 3);
      const width = buffer.readUInt16BE(offset + 5);
      return { width, height };
    }
    offset += length;
  }
  return null;
}

function getImageSize(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    if (ext === ".png") {
      return getPngSize(buffer);
    } else if (ext === ".jpg" || ext === ".jpeg") {
      return getJpgSize(buffer);
    }
  } catch (err) {
    console.error("Error reading " + filePath, err);
  }
  return null;
}

const folders = [
  path.join(__dirname, "..", "public", "images", "meet"),
  path.join(__dirname, "..", "public", "images", "fitness"),
  path.join(__dirname, "..", "public", "images", "finance")
];

folders.forEach(folder => {
  if (!fs.existsSync(folder)) return;
  console.log("=== " + folder + " ===");
  const files = fs.readdirSync(folder);
  files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    if ([".png", ".jpg", ".jpeg"].includes(ext)) {
      const fpath = path.join(folder, file);
      const size = getImageSize(fpath);
      if (size) {
        console.log(`${file} : ${size.width}x${size.height} (aspect ratio: ${(size.width / size.height).toFixed(2)})`);
      } else {
        console.log(`${file} : UNKNOWN`);
      }
    }
  });
});
