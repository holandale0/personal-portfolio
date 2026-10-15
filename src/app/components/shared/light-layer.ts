/**
 * Extrai de uma imagem apenas o que nela é luz, para dentro de um canvas.
 *
 * Por que isto existe: a forma barata de animar essas ilustrações é sobrepor
 * uma cópia delas em `mix-blend-mode: screen` e oscilar a opacidade. Só que a
 * cópia leva o fundo junto, e o fundo clareia quase tanto quanto o brilho —
 * medido: a parede subia 9% enquanto o holograma subia 13%, o que lê como uma
 * mancha, não como luz piscando.
 *
 * Aqui o alfa de cada pixel vira uma rampa sobre a luminância: abaixo de
 * `low` o pixel some por completo, acima de `high` entra inteiro. Como em
 * `screen` o transparente não altera nada, só a luz da arte acende.
 *
 * O resultado é um bitmap fixo: quem anima depois é a opacidade do canvas (de
 * graça, no compositor) ou uma máscara passando por cima. Nada por frame.
 */
export interface LightLayerOptions {
  /** Luminância (0-255) abaixo da qual o pixel é descartado. */
  low: number;
  /** Luminância a partir da qual o pixel entra com alfa cheio. */
  high: number;
  /** Multiplicador de cor, para a luz subir mais que o original. */
  gain?: number;
}

/**
 * Desenha `img` em `canvas` (que deve já estar dimensionado) mantendo só os
 * pixels claros. Retorna false se a imagem ainda não tem dimensões.
 */
export function renderLightLayer(
  img: HTMLImageElement,
  canvas: HTMLCanvasElement,
  { low, high, gain = 1 }: LightLayerOptions,
): boolean {
  const w = canvas.width;
  const h = canvas.height;
  if (!w || !h || !img.naturalWidth) return false;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return false;

  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);

  const frame = ctx.getImageData(0, 0, w, h);
  const px    = frame.data;
  const span  = Math.max(1, high - low);

  for (let i = 0; i < px.length; i += 4) {
    const r = px[i], g = px[i + 1], b = px[i + 2];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    if (lum <= low) {
      px[i + 3] = 0;
      continue;
    }

    // Rampa suave: um corte seco deixaria a borda da luz serrilhada.
    const t = Math.min(1, (lum - low) / span);
    px[i + 3] = Math.round(255 * t);

    if (gain !== 1) {
      px[i]     = Math.min(255, r * gain);
      px[i + 1] = Math.min(255, g * gain);
      px[i + 2] = Math.min(255, b * gain);
    }
  }

  ctx.putImageData(frame, 0, 0);
  return true;
}

/**
 * Dimensiona o canvas para cobrir `host` na densidade da tela, com teto de 2x
 * — acima disso o custo de memória cresce sem ganho visível.
 */
export function sizeToHost(canvas: HTMLCanvasElement, host: HTMLElement): boolean {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w   = Math.round(host.clientWidth  * dpr);
  const h   = Math.round(host.clientHeight * dpr);
  if (!w || !h) return false;
  if (canvas.width === w && canvas.height === h) return false;
  canvas.width  = w;
  canvas.height = h;
  return true;
}
