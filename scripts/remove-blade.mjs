import { Jimp } from 'jimp';
import { join } from 'path';

const FOLDER = 'public/assets/fotos';
const files = ['padawan1.png', 'padawan2.png'];

for (const file of files) {
  const path = join(FOLDER, file);
  const img = await Jimp.read(path);

  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    const a = this.bitmap.data[idx + 3];

    if (a === 0) return; // já transparente

    // Lâmina ciano clara (B=255, G alto, R menor que B e G)
    const isBlade = b >= 240 && g >= 180 && b > r + 20;

    if (isBlade) {
      this.bitmap.data[idx + 3] = 0;
    }
  });

  await img.write(path);
  console.log(`✔ ${file}`);
}
