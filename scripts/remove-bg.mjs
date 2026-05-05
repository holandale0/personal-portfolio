import { Jimp } from 'jimp';
import { join } from 'path';

const FOLDER = 'public/assets/fotos';
const TOLERANCE = 30; // how close to white a pixel must be to become transparent

const files = ['padawan1.png', 'padawan2.png', 'knight1.png', 'knight2.png', 'master1.png'];

for (const file of files) {
  const path = join(FOLDER, file);
  const img = await Jimp.read(path);

  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];

    const isNearWhite = r > 255 - TOLERANCE && g > 255 - TOLERANCE && b > 255 - TOLERANCE;
    if (isNearWhite) {
      this.bitmap.data[idx + 3] = 0; // alpha = 0 (transparent)
    }
  });

  await img.write(path);
  console.log(`✔ ${file}`);
}
