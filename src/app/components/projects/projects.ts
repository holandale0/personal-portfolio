import {
  AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild,
  inject, signal,
} from '@angular/core';
import { renderLightLayer } from '../shared/light-layer';

/** Recorte do mapa de luz, com a posicao em que ele volta ao canvas. */
interface Layer { canvas: HTMLCanvasElement; x: number; y: number; }

export interface Project {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  highlight?: boolean;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects implements AfterViewInit, OnDestroy {
  // -- terminal vivo ---------------------------------------------------------
  //
  // Tres efeitos, todos somando luz ao que a arte ja desenhou - nada de
  // conteudo novo. E de proposito: no tamanho real a tela tem 54x48px e uma
  // linha de codigo tem 2px de altura, entao texto dinamico nao seria lido por
  // ninguem. O que se percebe nesse tamanho e MOVIMENTO, e e o que estes tres
  // entregam: faixa de execucao descendo pelo codigo, LEDs do console piscando
  // em grupos independentes, e a respiracao geral da tela.
  //
  // Todos usam o mapa de luz (light-layer.ts). Como em `screen` o transparente
  // nao altera nada, o homem em frente ao monitor - que e escuro - nunca
  // acende, e por isso os efeitos passam "atras" dele sem precisar de mascara
  // de silhueta, que seria a parte dificil deste quadro.

  @ViewChild('termCanvas') private canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('termImg')    private imgRef!: ElementRef<HTMLImageElement>;

  private readonly zone = inject(NgZone);

  /* Medido na arte: a parede lateral nao passa de 41 de luminancia, o codigo
     chega a 164 e os LEDs do console a 255. */
  private readonly LIGHTS = { low: 40, high: 105, gain: 2.0 };

  /* Caixas medidas sobre o mapa de luz, em fracao do canvas. */
  private readonly SCREEN  = [0.212, 0.030, 0.780, 0.625] as const;
  private readonly CODE    = [0.419, 0.092, 0.640, 0.597] as const;
  private readonly CONSOLE = [0.150, 0.632, 0.784, 0.890] as const;

  private readonly BANKS = 4;          // grupos de LEDs com piscar independente
  private readonly BAND_TRAVEL = 2.6;  // segundos para a faixa varrer o codigo
  private readonly BAND_CYCLE  = 4.4;  // + silencio

  private screen?: Layer;
  private code?: Layer;
  private scratch?: HTMLCanvasElement;
  private banks: Layer[] = [];

  private raf      = 0;
  private lastTs   = 0;
  private age      = 0;
  private onScreen = false;
  private tick?: (ts: number) => void;
  private viewObserver?: IntersectionObserver;
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => this.boot());
  }

  ngOnDestroy(): void {
    this.pauseAnim();
    this.viewObserver?.disconnect();
    this.resizeObserver?.disconnect();
  }

  private boot(): void {
    const canvas = this.canvasRef.nativeElement;
    const img    = this.imgRef.nativeElement;
    const host   = canvas.parentElement!;

    const build = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.round(host.clientWidth * dpr);
      const h = Math.round(host.clientHeight * dpr);
      if (!w || !h) return;
      if (canvas.width === w && canvas.height === h && this.screen) return;
      canvas.width  = w;
      canvas.height = h;

      // Mapa de luz inteiro, so para ser recortado nas tres regioes.
      const full = document.createElement('canvas');
      full.width  = w;
      full.height = h;
      if (!renderLightLayer(img, full, this.LIGHTS)) return;

      this.screen = this.cut(full, this.SCREEN, w, h);
      this.code   = this.cut(full, this.CODE, w, h);
      this.banks  = this.splitBanks(this.cut(full, this.CONSOLE, w, h), this.BANKS);

      // Reaproveitado a cada quadro para mascarar a faixa; do tamanho do codigo.
      const sc = document.createElement('canvas');
      sc.width  = this.code.canvas.width;
      sc.height = this.code.canvas.height;
      this.scratch = sc;
    };

    build();
    img.addEventListener('load', build);
    this.resizeObserver = new ResizeObserver(build);
    this.resizeObserver.observe(host);

    this.tick = (ts: number) => {
      const dt = Math.min((ts - this.lastTs) / 1000, 0.05);
      this.lastTs = ts;
      this.age   += dt;
      this.draw(canvas);
      this.raf = requestAnimationFrame(this.tick!);
    };

    this.viewObserver = new IntersectionObserver(
      ([entry]) => {
        this.onScreen = entry.isIntersecting;
        if (this.onScreen) this.resumeAnim();
        else this.pauseAnim();
      },
      { threshold: 0 },
    );
    this.viewObserver.observe(host);
  }

  private resumeAnim(): void {
    if (this.raf || !this.onScreen || !this.tick) return;
    this.zone.runOutsideAngular(() => {
      // O primeiro quadro so acerta o relogio, senao a faixa salta ao voltar.
      this.raf = requestAnimationFrame(ts => { this.lastTs = ts; this.tick!(ts); });
    });
  }

  private pauseAnim(): void {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private cut(src: HTMLCanvasElement, box: readonly number[], w: number, h: number): Layer {
    const x  = Math.floor(box[0] * w);
    const y  = Math.floor(box[1] * h);
    const cw = Math.max(1, Math.ceil((box[2] - box[0]) * w));
    const ch = Math.max(1, Math.ceil((box[3] - box[1]) * h));
    const c  = document.createElement('canvas');
    c.width  = cw;
    c.height = ch;
    c.getContext('2d')!.drawImage(src, x, y, cw, ch, 0, 0, cw, ch);
    return { canvas: c, x, y };
  }

  /**
   * Divide os LEDs em grupos por celula da grade, nao por pixel: um LED inteiro
   * cai sempre no mesmo grupo, senao ele piscaria pontilhado em vez de inteiro.
   */
  private splitBanks(layer: Layer, n: number): Layer[] {
    const cell = Math.max(6, Math.round(layer.canvas.width / 16));
    const out: Layer[] = [];
    for (let b = 0; b < n; b++) {
      const c  = document.createElement('canvas');
      c.width  = layer.canvas.width;
      c.height = layer.canvas.height;
      const ctx = c.getContext('2d')!;
      ctx.drawImage(layer.canvas, 0, 0);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = '#000';
      for (let cy = 0; cy * cell < c.height; cy++) {
        for (let cx = 0; cx * cell < c.width; cx++) {
          if ((cx * 7 + cy * 13) % n !== b) {
            ctx.fillRect(cx * cell, cy * cell, cell, cell);
          }
        }
      }
      out.push({ canvas: c, x: layer.x, y: layer.y });
    }
    return out;
  }

  /** Ruido deterministico em [0,1): piscar irregular sem guardar estado. */
  private noise(n: number): number {
    const v = Math.sin(n * 12.9898) * 43758.5453;
    return v - Math.floor(v);
  }

  private draw(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');
    if (!ctx || !this.screen || !this.code || !this.scratch) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = this.age;

    // Respiracao da tela: lenta e fraca, como um CRT vivo.
    ctx.globalAlpha = 0.02
      + 0.13 * (0.5 + 0.5 * Math.sin(t * 0.8))
      + 0.07 * (0.5 + 0.5 * Math.sin(t * 2.7 + 1.3));
    ctx.drawImage(this.screen.canvas, this.screen.x, this.screen.y);

    // LEDs: cada grupo troca de valor em degraus, em ritmo proprio.
    for (let b = 0; b < this.banks.length; b++) {
      const step = Math.floor(t / (0.21 + b * 0.05)) + b * 37;
      ctx.globalAlpha = 0.04 + 0.80 * this.noise(step);
      ctx.drawImage(this.banks[b].canvas, this.banks[b].x, this.banks[b].y);
    }

    // Faixa de execucao descendo pelo codigo.
    const phase = t % this.BAND_CYCLE;
    if (phase < this.BAND_TRAVEL) {
      const p    = phase / this.BAND_TRAVEL;
      const ch   = this.code.canvas.height;
      const y    = p * ch;
      const half = Math.max(5, ch * 0.16);
      // Nasce e morre esvanecendo, para nao piscar ao entrar e sair.
      const alpha = 1.0 * Math.min(1, p / 0.12, (1 - p) / 0.18);

      if (alpha > 0.01) {
        const sc = this.scratch.getContext('2d')!;
        sc.globalCompositeOperation = 'source-over';
        sc.clearRect(0, 0, this.scratch.width, this.scratch.height);
        sc.drawImage(this.code.canvas, 0, 0);

        sc.globalCompositeOperation = 'destination-in';
        const g = sc.createLinearGradient(0, y - half, 0, y + half);
        g.addColorStop(0,   'rgba(0,0,0,0)');
        g.addColorStop(0.5, 'rgba(0,0,0,1)');
        g.addColorStop(1,   'rgba(0,0,0,0)');
        sc.fillStyle = g;
        sc.fillRect(0, 0, this.scratch.width, this.scratch.height);

        ctx.globalAlpha = alpha;
        ctx.drawImage(this.scratch, this.code.x, this.code.y);
      }
    }

    ctx.globalAlpha = 1;
  }

  items: Project[] = [
    {
      title: 'Flight Monitor',
      description: 'Monitor silencioso de preços de passagens aéreas. Roda em background, varre janelas de datas configuradas e avisa quando encontra uma oferta dentro dos seus critérios. Só incomoda quando há oportunidade real.',
      tags: ['Java', 'SpringBoot','RabbitMQ', 'PostgreSQL', 'Python' , 'FastAPI', 'Vue.js', 'TypeScript', 'Vite', 'Docker'],
      github: 'https://github.com/holandale0/3layers-flightmonitor',
      highlight: true
    },
    {
      title: 'StandardPay',
      description: 'Simulador de plataforma de pagamentos no estilo Stripe ou PayPal — nenhum dinheiro real é movimentado. Reproduz o fluxo completo: criação da cobrança, checkout hospedado com cartão e PIX simulados, webhooks assinados com HMAC via padrão outbox, estornos e expiração. Arquitetura BCE validada por ArchUnit no build.',
      tags: ['Java 21', 'Quarkus', 'PostgreSQL', 'Hibernate Panache', 'Flyway', 'Qute', 'OpenAPI', 'Docker'],
      github: 'https://github.com/holandale0/standard-pay'
    },
    {
      title: 'Este Portfolio',
      description: 'Portfolio profissional desenvolvido com Angular 21 e design moderno. Estruturado como SPA com seções dedicadas para apresentação, skills, experiência e contato.',
      tags: ['Angular', 'TypeScript', 'SCSS'],
      github: 'https://github.com/holandale0/personal-portfolio'
    },
    {
      title: 'Port Killer',
      description: 'Utilitário desktop para verificar e encerrar processos que estão ocupando uma porta de rede — com interface gráfica moderna e suporte a Windows, Linux e macOS.',
      tags: ['Python', 'Shell'],
      github: 'https://github.com/holandale0/port-killer'
    },
    {
      title: 'Conciliação Financeira Batch',
      description: 'Aplicação batch de conciliação financeira com Java e Spring Batch. Processa grandes volumes de transações financeiras, validando e reconciliando registros entre sistemas de pagamento.',
      tags: ['Java', 'Spring Batch', 'Spring Boot', 'PostgreSQL'],
      github: 'https://github.com/holandale0/financial-reconciliation-batch'
    },
    {
      title: 'Quarkus Concurrency Lab',
      description: 'Plataforma de simulação e benchmark de concorrência que compara o desempenho de Virtual Threads (Project Loom) vs Platform Threads (pool fixo) em cenários realistas de carga — I/O-bound e CPU-bound.',
      tags: ['Java', 'Quarkus', 'Micrometer + Prometheus', 'Grafana', 'k6', 'Mutiny'],
      github: 'https://github.com/holandale0/quarkus-concurrency-lab'
    },
    {
      title: 'Sistema de Processamento de Pedidos',
      description: 'Sistema de processamento de pedidos baseado em arquitetura orientada a eventos (Event-Driven) utilizando Java 21, Spring Boot e Apache Kafka.',
      tags: ['Java', 'SpringBoot', 'PostgreSQL', 'Apache Kafka' ],
      github: 'https://github.com/holandale0/order-processing-system'
    },
    {
      title: 'WebSocket App com Quarkus',
      description: 'Aplicação de comunicação em tempo real utilizando WebSocket com Java e Quarkus. Demonstra troca de mensagens bidirecional entre cliente e servidor com baixa latência.',
      tags: ['Java', 'Quarkus', 'WebSocket', 'Redis', 'PostgreSQL'],
      github: 'https://github.com/holandale0/websocket-java-quarkus-app'
    }
  ];

  /** Índice do projeto exibido na tela do console. */
  readonly index = signal(0);

  /** 1 = avançou (entra pela direita), -1 = voltou (entra pela esquerda). */
  readonly direction = signal(1);

  private touchStartX = 0;

  next(): void {
    this.step(1);
  }

  prev(): void {
    this.step(-1);
  }

  goTo(target: number): void {
    if (target === this.index()) return;
    this.direction.set(target > this.index() ? 1 : -1);
    this.index.set(target);
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    const deltaX = event.changedTouches[0].clientX - this.touchStartX;
    if (Math.abs(deltaX) < 45) return;
    if (deltaX < 0) this.next();
    else this.prev();
  }

  private step(delta: number): void {
    const total = this.items.length;
    this.direction.set(delta);
    this.index.set((this.index() + delta + total) % total);
  }
}
