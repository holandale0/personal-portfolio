import sharp from 'sharp';

const SRC = 'public/assets/fotos/contact-me-full.png';
const OUT = 'public/assets/fotos/contact-me';

// Fundo da seção Contato (--bg-secondary): a vinheta converge para ele.
const BG = { r: 0x13, g: 0x0e, b: 0x09 };

const RATIO = 2.63; // mesma proporção de skills, projects e evolution2

// Perfil da vinheta: [distância elíptica normalizada, opacidade].
// Até 0.52 a imagem passa intacta; em 1.0 é a cor do fundo, pura.
const STOPS = [
  [0.0, 0.0],
  [0.52, 0.0],
  [0.72, 0.32],
  [0.86, 0.78],
  [1.0, 1.0],
];

function opacityAt(d) {
  if (d >= 1) return 1;
  for (let i = 1; i < STOPS.length; i++) {
    const [d0, o0] = STOPS[i - 1];
    const [d1, o1] = STOPS[i];
    if (d <= d1) return o0 + ((d - d0) / (d1 - d0)) * (o1 - o0);
  }
  return 1;
}

const meta = await sharp(SRC).metadata();

// Folga vertical para o assunto respirar: sem ela o robô encosta na base e a
// vinheta teria de escolher entre saturar na borda ou preservar as esteiras.
const PAD_Y = 90;
const H = meta.height + PAD_Y * 2;
const W = Math.round(H * RATIO);
const PAD_X = Math.round((W - meta.width) / 2);

// `extendWith: 'copy'` estica os pixels da própria borda para fora. Uma cor
// sólida deixaria emenda: as bordas da imagem não são uniformes (laterais em
// ~#2d2821, base do chão em ~#514538), então nenhum valor único serviria.
const base = await sharp(SRC)
  .extend({ top: PAD_Y, bottom: PAD_Y, left: PAD_X, right: PAD_X, extendWith: 'copy' })
  .toBuffer();

// Máscara elíptica desenhada pixel a pixel: semi-eixos iguais à meia-largura e
// meia-altura, de modo que a vinheta chegue a 100% do fundo em todas as bordas.
const CX = W / 2;
const CY = H / 2;
const overlay = Buffer.alloc(W * H * 4);

for (let y = 0; y < H; y++) {
  const dy = (y - CY) / CY;
  for (let x = 0; x < W; x++) {
    const dx = (x - CX) / CX;
    const i = (y * W + x) * 4;
    overlay[i] = BG.r;
    overlay[i + 1] = BG.g;
    overlay[i + 2] = BG.b;
    overlay[i + 3] = Math.round(opacityAt(Math.hypot(dx, dy)) * 255);
  }
}

const composed = sharp(base).composite([
  { input: overlay, raw: { width: W, height: H, channels: 4 }, blend: 'over' },
]);

const p = await composed.clone().png({ compressionLevel: 9 }).toFile(`${OUT}.png`);
const w = await composed.clone().webp({ quality: 88 }).toFile(`${OUT}.webp`);

console.log(`png : ${p.width}x${p.height}  ${Math.round(p.size / 1024)} kB`);
console.log(`webp: ${w.width}x${w.height}  ${Math.round(w.size / 1024)} kB  ratio ${(w.width / w.height).toFixed(2)}`);
