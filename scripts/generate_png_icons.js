import fs from 'fs';
import zlib from 'zlib';

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

const table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = ((c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1));
  }
  table[i] = c >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  const payload = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(payload), 0);
  return Buffer.concat([lenBuf, payload, crcBuf]);
}

function generatePng(width, height, isMaskable = false) {
  const header = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Scanlines with gold & dark obsidian gradient
  const rawData = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * (isMaskable ? 0.48 : 0.44);

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter byte: None
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= radius) {
        // Gold gradient with obsidian core
        const ratio = (x + y) / (width + height);
        // Gold color #D4AF37 to #F5D77F
        const r = Math.round(212 + (245 - 212) * ratio);
        const g = Math.round(175 + (215 - 175) * ratio);
        const b = Math.round(55 + (127 - 55) * ratio);

        // Center emblem impression
        const inCenter = Math.abs(dx) < width * 0.28 && Math.abs(dy) < height * 0.28;
        if (inCenter && (Math.abs(dx - dy) < width * 0.05 || Math.abs(dx + dy) < width * 0.05)) {
          rawData[offset++] = 255;
          rawData[offset++] = 245;
          rawData[offset++] = 180;
          rawData[offset++] = 255;
        } else {
          rawData[offset++] = 14; // #0E1322 dark obsidian
          rawData[offset++] = 19;
          rawData[offset++] = 34;
          rawData[offset++] = 255;
        }
      } else {
        // Outer border or transparent
        if (dist <= radius + (isMaskable ? 0 : 6)) {
          rawData[offset++] = 212; // Gold border
          rawData[offset++] = 175;
          rawData[offset++] = 55;
          rawData[offset++] = 255;
        } else {
          rawData[offset++] = 7;
          rawData[offset++] = 8;
          rawData[offset++] = 12;
          rawData[offset++] = isMaskable ? 255 : 0;
        }
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

fs.writeFileSync('./public/icon-192.png', generatePng(192, 192, false));
fs.writeFileSync('./public/icon-512.png', generatePng(512, 512, false));
fs.writeFileSync('./public/icon-512-maskable.png', generatePng(512, 512, true));
console.log('PNG Icons successfully generated in public/ folder!');
