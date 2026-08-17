import sharp from 'sharp';
import { mkdir } from 'fs/promises';

/**
 * Normaliza as logos das empresas da seção Trajetória.
 *
 * Cada logo vem do site oficial em um tamanho e recorte diferente, então:
 *  1. `trim` remove a margem transparente que cada arquivo traz de fábrica —
 *     sem isso a Opah (1920x793, quase toda vazia) apareceria minúscula;
 *  2. `contain` encaixa todas na MESMA caixa, de modo que o CSS possa usar
 *     uma medida única e nenhuma logo domine as outras.
 *
 * A cor é resolvida no CSS (filtro para silhueta clara), não aqui, para que
 * os arquivos continuem servindo caso se decida voltar às cores da marca.
 */

const SRC = 'C:/Users/holan/AppData/Local/Temp/claude/c--Projects-Frontend-personal-portfolio/b109a94f-bf2a-4d57-9c9f-dd4547ae6c43/scratchpad/logos';
const OUT = 'public/assets/logos';

const BOX = { width: 320, height: 96 }; // 10:3 — folgado para caber as horizontais

const LOGOS = ['embrapa', 'opah', 'destaxa', 'qintess', 'basis'];

/**
 * Alguns arquivos vêm com fundo branco chapado em vez de alfa (a Embrapa é
 * 60% branco opaco). Sem tratar, o filtro de silhueta do CSS pinta o fundo
 * inteiro e a logo vira um retângulo branco. Aqui o branco vira transparência,
 * com meio-tom preservado para as bordas não serrilharem.
 */
async function flattenWhiteToAlpha(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  let opaque = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] > 16) opaque++;
  const hasAlpha = opaque / (info.width * info.height) < 0.95;
  if (hasAlpha) return sharp(file); // já tem recorte próprio: não mexer

  for (let i = 0; i < data.length; i += 4) {
    data[i + 3] = 255 - Math.min(data[i], data[i + 1], data[i + 2]);
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });
}

await mkdir(OUT, { recursive: true });

for (const name of LOGOS) {
  const base = await flattenWhiteToAlpha(`${SRC}/${name}.png`);

  const info = await base
    .trim({ threshold: 12 })
    .resize({ ...BOX, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(`${OUT}/${name}.webp`);

  console.log(`${name.padEnd(9)} -> ${info.width}x${info.height}  ${(info.size / 1024).toFixed(1)} kB`);
}
