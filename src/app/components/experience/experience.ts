import {
  AfterViewInit, Component, ElementRef, NgZone,
  OnDestroy, ViewChild, inject, signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperienceCrawl } from './experience-crawl/experience-crawl';

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  description: string;
  tags: string[];
  current?: boolean;
  imageBefore?: string;
  imageBeforeCard?: boolean;
  imageAfter?: string;
  imageAfterCard?: boolean;
}

interface Vec { x: number; y: number; }
interface Grain { t: number; delay: number; speed: number; perp: number; r: number; }

const ROMAN       = ['I', 'II', 'III', 'IV', 'V'];
const INTRO_TEXTS = [
  'Onde tudo começou.',
  'A primeira evolução importante.',
  'Experiência desafiadora.',
  'A evolução continua.',
  'A missão em curso.',
];

@Component({
  selector: 'app-experience',
  imports: [CommonModule, ExperienceCrawl],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class Experience implements AfterViewInit, OnDestroy {
  @ViewChild('sandCanvas') private sandRef!: ElementRef<HTMLCanvasElement>;

  private zone = inject(NgZone);

  readonly activeIndex = signal<number | null>(null);

  introText(i: number): string  { return INTRO_TEXTS[i] ?? ''; }
  roman(i: number): string      { return ROMAN[i] ?? String(i + 1); }
  webpOf(path: string): string  { return path.replace('.png', '.webp'); }

  // ── sand particle system ──────────────────────────────────────────────────

  private raf       = 0;
  private lastTs    = 0;
  private cycleAge  = 0;
  private readonly  PAUSE  = 4;          // seconds of silence before each breeze
  private readonly  EFFECT = 4;          // seconds the breeze takes to cross
  private readonly  CYCLE  = 8;          // PAUSE + EFFECT
  private readonly  N      = 180;        // grains per burst
  private grains:   Grain[] = [];
  private spineA    = this.mkSpine();    // current burst path
  private spineB    = this.mkSpine();    // next burst path (for morphing)

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => this.boot());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
  }

  private gauss(): number {
    return Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());
  }

  private mkSpine(): Vec[] {
    const j = () => (Math.random() - 0.5);
    return [
      { x: -0.08,            y: 0.62 + j() * 0.16 },  // entry – left edge
      { x: 0.28 + j() * 0.12, y: 0.20 + j() * 0.20 }, // 1st control – up-left area
      { x: 0.65 + j() * 0.10, y: 0.68 + j() * 0.18 }, // 2nd control – down-right
      { x: 1.08,             y: 0.28 + j() * 0.22 },  // exit – right edge
    ];
  }

  private bez(pts: Vec[], t: number): Vec {
    const m = 1 - t;
    return {
      x: m**3*pts[0].x + 3*m**2*t*pts[1].x + 3*m*t**2*pts[2].x + t**3*pts[3].x,
      y: m**3*pts[0].y + 3*m**2*t*pts[1].y + 3*m*t**2*pts[2].y + t**3*pts[3].y,
    };
  }

  private bezTangent(pts: Vec[], t: number): Vec {
    const m = 1 - t;
    const dx = 3*(m**2*(pts[1].x-pts[0].x) + 2*m*t*(pts[2].x-pts[1].x) + t**2*(pts[3].x-pts[2].x));
    const dy = 3*(m**2*(pts[1].y-pts[0].y) + 2*m*t*(pts[2].y-pts[1].y) + t**2*(pts[3].y-pts[2].y));
    const l  = Math.hypot(dx, dy) || 1;
    return { x: dx / l, y: dy / l };
  }

  private mkGrains(): void {
    this.grains = Array.from({ length: this.N }, () => ({
      t:     0,
      delay: Math.max(0, this.gauss() * 0.45), // delays relative to effect start
      speed: 0.32 + Math.random() * 0.22,       // fast enough to finish within EFFECT
      perp:  this.gauss(),
      r:     1.4 + Math.random() * 3.8,
    }));
  }

  private boot(): void {
    const canvas = this.sandRef.nativeElement;
    const host   = canvas.parentElement!;

    const sync = () => {
      if (host.offsetWidth > 0) {
        canvas.width  = host.offsetWidth;
        canvas.height = host.offsetHeight;
      }
    };
    sync();
    new ResizeObserver(sync).observe(host);

    this.mkGrains();

    const tick = (ts: number) => {
      const dt = Math.min((ts - this.lastTs) / 1000, 0.05);
      this.lastTs    = ts;
      this.cycleAge += dt;

      if (this.cycleAge >= this.CYCLE) {
        this.cycleAge -= this.CYCLE;
        this.spineA = this.spineB;
        this.spineB = this.mkSpine();
        this.mkGrains();
      }

      this.draw(canvas, dt);
      this.raf = requestAnimationFrame(tick);
    };

    this.raf = requestAnimationFrame(ts => { this.lastTs = ts; tick(ts); });
  }

  private draw(canvas: HTMLCanvasElement, dt: number): void {
    const ctx = canvas.getContext('2d')!;
    const W   = canvas.width;
    const H   = canvas.height;
    if (W === 0 || H === 0) return;

    ctx.clearRect(0, 0, W, H);

    // Time since the effect phase started within this cycle
    const effectAge = this.cycleAge - this.PAUSE;
    if (effectAge <= 0 || effectAge >= this.EFFECT) return;

    // Smooth fade in / fade out within the effect window
    const cycleFade = Math.min(1, effectAge / 0.40, (this.EFFECT - effectAge) / 0.65);
    if (cycleFade <= 0) return;

    // Gradually morph spine during the effect — shape changes each pass
    const blend = (effectAge / this.EFFECT) * 0.55;
    const pts   = this.spineA.map((a, i) => ({
      x: a.x + (this.spineB[i].x - a.x) * blend,
      y: a.y + (this.spineB[i].y - a.y) * blend,
    }));

    ctx.shadowBlur  = 12;
    ctx.shadowColor = 'rgba(190,145,60,0.45)';
    ctx.fillStyle   = 'rgba(218,182,110,1)';

    for (const g of this.grains) {
      if (effectAge < g.delay) continue;
      if (g.t > 1.08) continue;

      g.t += g.speed * dt;
      const tc  = Math.max(0, Math.min(1, g.t));

      const pos = this.bez(pts, tc);
      const tan = this.bezTangent(pts, tc);

      const env    = Math.sin(Math.PI * tc);
      const perpPx = g.perp * env * H * 0.16;

      const nx = -tan.y;
      const ny =  tan.x;

      const px = pos.x * W + nx * perpPx;
      const py = pos.y * H + ny * perpPx;

      const alpha = env * cycleFade * 0.90;
      if (alpha < 0.015) continue;

      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.ellipse(px, py, g.r * 1.9, g.r * 0.55, Math.atan2(tan.y, tan.x), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur  = 0;
  }

  // ── experience data ───────────────────────────────────────────────────────

  items: ExperienceItem[] = [
    {
      role: 'Desenvolvedor Java',
      company: 'Embrapa',
      period: 'Nov 2012 — Jul 2016',
      description: 'Projeto de pesquisa científica para migração de sistema de manejo florestal de Delphi para Java Swing. Persistência com Hibernate e PostgreSQL, geração de relatórios com JasperReports. Sistema utilizado por engenheiros florestais para planejamento de colheita sustentável.',
      tags: ['Java', 'Hibernate', 'PostgreSQL', 'JasperReports'],
    },
    {
      role: 'Desenvolvedor Back-End Java',
      company: 'Opah IT Consulting',
      period: 'Abr 2018 — Out 2023',
      description: 'Mais de 5 anos em projetos para grandes clientes: microserviços com Quarkus e Apache Kafka para Casas Bahia; jobs batch com Spring Batch para Banco Original; sistema full stack com Node.js e Angular 7 para Grupo Fleury; BFF bancário com Node.js para Crefisa.',
      tags: ['Java', 'Quarkus', 'Kafka', 'Spring Batch', 'Node.js', 'Angular'],
    },
    {
      role: 'Desenvolvedor Back-End',
      company: 'Destaxa',
      period: 'Mai 2024 — Out 2024',
      description: 'Plataforma de conciliação financeira de transações de adquirentes. Serviços reativos com Java 17, Spring Boot, WebFlux e R2DBC. Clean Architecture com separação entre camadas Domain, Application e Infrastructure. Containerização com Docker e observabilidade via Grafana.',
      tags: ['Java 17', 'Spring Boot', 'WebFlux', 'R2DBC', 'Docker', 'Grafana'],
    },
    {
      role: 'Desenvolvedor Back-End Java',
      company: 'Qintess',
      period: 'Out 2024 — Mar 2026',
      description: 'Desenvolvimento de soluções para carteiras digitais (Apple Pay) com integração entre Caixa Econômica Federal e Visa. APIs REST com Java 17 e Quarkus para gerenciamento do ciclo de vida de tokens, implementação de criptografia JWS/JWE e integração via Azure API Management.',
      tags: ['Java 17', 'Quarkus', 'Azure', 'REST APIs', 'JWS/JWE'],
    },
    {
      role: 'Desenvolvedor Back-End Java',
      company: 'Basis',
      period: 'Mai 2026 — Atual',
      current: true,
      description: 'Atuação no time de engenharia do cliente TJPR (Tribunal de Justiça do Estado do Paraná), definindo padrões de engenharia de software, processos de desenvolvimento e gestão de tecnologias. Desenvolvimento de novas features, sustentação de sistemas legados e migração do Spring Boot 3.5 para 4.0. Observabilidade com Graylog, Grafana e Dynatrace. Suporte a front-end Angular 22.',
      tags: ['Java', 'Spring Boot', 'Angular 22', 'Graylog', 'Grafana', 'Dynatrace'],
    },
  ];
}
