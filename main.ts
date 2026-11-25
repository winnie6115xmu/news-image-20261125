// news-image-20261125 entry (Node 22, standard library only).
//
// The entry is the single image beside this file, entry.png: a collage summing up the world news of
// 25 November 2026. The program validates the image (PNG signature, size cap) and writes it to the
// output directory as entry.png, which is exactly what the judge sees.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const MAX_BYTES = 1024 * 1024;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const source = new URL('./entry.png', import.meta.url);
const image = readFileSync(source);

if (image.length === 0 || image.length > MAX_BYTES) {
  throw new Error(`entry.png is ${image.length} bytes; the gate takes at most ${MAX_BYTES}`);
}
if (!image.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
  throw new Error('entry.png does not start with the PNG signature');
}
// The IHDR chunk follows the signature: length (4), "IHDR" (4), then width and height as big-endian u32.
const width = image.readUInt32BE(16);
const height = image.readUInt32BE(20);
if (width > 1024 || height > 1024) {
  throw new Error(`entry.png is ${width}x${height}; the gate takes at most 1024x1024`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'entry.png'), image);
console.log(`news image: wrote entry.png (${image.length} bytes) to ${outDir}`);
