import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join } from 'path';

const dir = 'public/assets/fotos';
const files = await readdir(dir);
const pngs = files.filter(f => f.endsWith('.png'));

for (const file of pngs) {
  const input = join(dir, file);
  const output = join(dir, file.replace('.png', '.webp'));
  await sharp(input).webp({ quality: 85 }).toFile(output);
  console.log(`Converted: ${file} → ${file.replace('.png', '.webp')}`);
}

console.log(`\nDone! Converted ${pngs.length} images.`);
