import {
  AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild,
  inject, signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillInsight } from '../shared/skill-insight/skill-insight';

type Rank = 'padawan' | 'knight' | 'master';

interface Skill {
  name: string;
  icon: string;
  level: number;
  rank: Rank;
  description?: string;
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

@Component({
  selector: 'app-skills',
  imports: [CommonModule, SkillInsight],
  templateUrl: './skills.html',
  styleUrl: './skills.scss'
})
export class Skills implements AfterViewInit, OnDestroy {
  // ── pontinhos de energia percorrendo as linhas ────────────────────────────
  //
  // A arte já traz as linhas ligando cada ícone ao cérebro. As coordenadas
  // abaixo foram TRAÇADAS da própria imagem (ampliando-a sobre uma grade em
  // porcentagem e conferindo o traçado sobreposto à arte), não estimadas: por
  // isso cada ponto corre exatamente em cima da linha desenhada, em qualquer
  // tamanho de tela, já que tudo é fração do canvas.
  //
  // Sentido: do ícone para o cérebro — a competência alimentando o centro.

  /** Polilinhas em fração do canvas, do ícone (primeiro ponto) ao cérebro. */
  private readonly PATHS: ReadonlyArray<ReadonlyArray<readonly [number, number]>> = [
    // codigo-limpo
    [[0.314, 0.143], [0.354, 0.143], [0.392, 0.211], [0.418, 0.211]],
    // arquitetura
    [[0.271, 0.313], [0.345, 0.313], [0.378, 0.354], [0.415, 0.354]],
    // resolucao
    [[0.276, 0.489], [0.322, 0.489], [0.346, 0.512], [0.374, 0.512], [0.405, 0.476]],
    // pensamento
    [[0.323, 0.658], [0.364, 0.658], [0.4, 0.591], [0.425, 0.531]],
    // domain-driven
    [[0.677, 0.16], [0.639, 0.16], [0.605, 0.209], [0.583, 0.209]],
    // design-patterns
    [[0.706, 0.343], [0.62, 0.343], [0.604, 0.334]],
    // microsservicos
    [[0.712, 0.506], [0.658, 0.506], [0.622, 0.415], [0.568, 0.415]],
    // automacao
    [[0.692, 0.656], [0.653, 0.656], [0.572, 0.563]],
  ];

  /** Defasagem por linha, para os oito fluxos não andarem em bloco. */
  private readonly OFFSETS = [0, 0.37, 0.68, 0.14, 0.52, 0.81, 0.26, 0.93];

  private readonly DOTS_PER_PATH = 2;
  private readonly CYCLE = 2.8;        // segundos para um ponto ir ponta a ponta

  @ViewChild('pulseCanvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly zone = inject(NgZone);

  /** Grão luminoso pré-renderizado: desenhar o brilho por quadro custa caro. */
  private sprite?: HTMLCanvasElement;
  /** Geometria em pixels do canvas, recalculada quando ele muda de tamanho. */
  private tracks: { pts: { x: number; y: number }[]; cum: number[]; len: number }[] = [];

  private raf      = 0;
  private lastTs   = 0;
  private cycleAge = 0;
  private onScreen = false;
  private tick?: (ts: number) => void;
  private viewObserver?: IntersectionObserver;
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => this.boot());
  }

  ngOnDestroy(): void {
    this.pause();
    this.viewObserver?.disconnect();
    this.resizeObserver?.disconnect();
  }

  private boot(): void {
    const canvas = this.canvasRef.nativeElement;
    const host   = canvas.parentElement!;

    const measure = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.round(host.clientWidth * dpr);
      const h = Math.round(host.clientHeight * dpr);
      if (!w || !h || (canvas.width === w && canvas.height === h)) return;
      canvas.width  = w;
      canvas.height = h;
      this.buildTracks(w, h);
      this.buildSprite(w);
    };
    measure();
    this.resizeObserver = new ResizeObserver(measure);
    this.resizeObserver.observe(host);

    this.tick = (ts: number) => {
      const dt = Math.min((ts - this.lastTs) / 1000, 0.05);
      this.lastTs   = ts;
      this.cycleAge = (this.cycleAge + dt) % this.CYCLE;
      this.draw(canvas);
      this.raf = requestAnimationFrame(this.tick!);
    };

    this.viewObserver = new IntersectionObserver(
      ([entry]) => {
        this.onScreen = entry.isIntersecting;
        if (this.onScreen) this.resume();
        else this.pause();
      },
      { threshold: 0 },
    );
    this.viewObserver.observe(host);
  }

  private resume(): void {
    if (this.raf || !this.onScreen || !this.tick) return;
    this.zone.runOutsideAngular(() => {
      // O primeiro quadro só acerta o relógio, senão o fluxo salta ao voltar.
      this.raf = requestAnimationFrame(ts => { this.lastTs = ts; this.tick!(ts); });
    });
  }

  private pause(): void {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  /** Converte as frações em pixels e acumula os comprimentos de segmento, para
      o ponto andar em velocidade constante mesmo com segmentos desiguais. */
  private buildTracks(w: number, h: number): void {
    this.tracks = this.PATHS.map(path => {
      const pts = path.map(([x, y]) => ({ x: x * w, y: y * h }));
      const cum = [0];
      for (let i = 1; i < pts.length; i++) {
        cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
      }
      return { pts, cum, len: cum[cum.length - 1] };
    });
  }

  private buildSprite(w: number): void {
    const core = Math.max(1.1, w * 0.0021);
    const size = Math.ceil(core * 10);
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d')!;
    const mid = size / 2;

    // Núcleo quase branco desvanecendo para o dourado da arte e daí para nada.
    const g = ctx.createRadialGradient(mid, mid, 0, mid, mid, mid);
    g.addColorStop(0,    'rgba(255, 244, 214, 1)');
    g.addColorStop(0.12, 'rgba(255, 214, 132, 0.88)');
    g.addColorStop(0.30, 'rgba(228, 168, 74, 0.30)');
    g.addColorStop(1,    'rgba(198, 136, 56, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    this.sprite = c;
  }

  /** Posição ao longo da polilinha, com `t` de 0 (ícone) a 1 (cérebro). */
  private pointAt(track: { pts: { x: number; y: number }[]; cum: number[]; len: number }, t: number) {
    const d = t * track.len;
    let i = 1;
    while (i < track.cum.length - 1 && track.cum[i] < d) i++;
    const seg = track.cum[i] - track.cum[i - 1] || 1;
    const k   = (d - track.cum[i - 1]) / seg;
    const a   = track.pts[i - 1];
    const b   = track.pts[i];
    return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
  }

  private draw(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');
    const sprite = this.sprite;
    if (!ctx || !sprite || !this.tracks.length) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const half = sprite.width / 2;
    const base = this.cycleAge / this.CYCLE;

    for (let p = 0; p < this.tracks.length; p++) {
      const track = this.tracks[p];
      for (let k = 0; k < this.DOTS_PER_PATH; k++) {
        const t = (base + this.OFFSETS[p] + k / this.DOTS_PER_PATH) % 1;

        // Acende saindo do ícone e se dissolve ao entrar no cérebro.
        const fade = Math.min(1, t / 0.12, (1 - t) / 0.22);
        if (fade <= 0) continue;

        const pos = this.pointAt(track, t);
        ctx.globalAlpha = fade;
        ctx.drawImage(sprite, pos.x - half, pos.y - half);
      }
    }
    ctx.globalAlpha = 1;
  }

  readonly activeSkill = signal<string | null>(null);
  readonly flashSkill  = signal<string>('');

  private readonly isTouch =
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  readonly rankLabel: Record<Rank, string> = {
    padawan: 'Padawan',
    knight:  'Jedi Knight',
    master:  'Jedi Master',
  };

  onEnter(skill: Skill) {
    if (!this.isTouch && skill.description) {
      this.activeSkill.set(skill.name);
    }
  }

  onLeave() {
    if (!this.isTouch) {
      this.activeSkill.set(null);
    }
  }

  onClick(skill: Skill) {
    if (this.isTouch && skill.description) {
      this.activeSkill.update(v => v === skill.name ? null : skill.name);
    }
    this.flashSkill.set(skill.name);
    setTimeout(() => this.flashSkill.set(''), 800);
  }

  categories: SkillCategory[] = [
    {
      title: 'Back-End',
      skills: [
        {
          name: 'Java', icon: 'assets/icons/java.svg', level: 95, rank: 'master',
          description: 'Atuo com Java desde 2012, iniciando pela versão 7 em um projeto desktop (Swing) na Embrapa. Acompanhei a evolução da linguagem passando pelas versões 8, 11, 17 e 21 em projetos de microserviços e APIs REST para empresas como Casas Bahia, Banco Original e Caixa Econômica Federal.',
        },
        {
          name: 'Spring Boot', icon: 'assets/icons/spring.svg', level: 90, rank: 'master',
          description: 'Utilizado em projetos de alta criticidade, incluindo uma plataforma de conciliação financeira na Destaxa com arquitetura reativa (WebFlux + R2DBC + Java 17). Experiência também com Spring Batch para processamento em lote no Banco Original.',
        },
        {
          name: 'Quarkus', icon: 'assets/icons/quarkus.svg', level: 85, rank: 'master',
          description: 'Stack principal nos últimos anos. Utilizado em microserviços para Casas Bahia (integrado ao Apache Kafka) na Opah IT Consulting, e na Qintess para APIs de tokenização de cartões (Apple Pay) integrando Caixa Econômica Federal e Visa via Azure API Management.',
        },
        {
          name: 'Spring WebFlux', icon: 'assets/icons/spring.svg', level: 80, rank: 'knight',
          description: 'Experiência com programação reativa usando Spring WebFlux e R2DBC na Destaxa, desenvolvendo serviços de conciliação de transações financeiras com Java 17. Foco em performance, non-blocking I/O e integração com bancos de dados reativos.',
        },
        {
          name: 'Apache Kafka', icon: 'assets/icons/kafka.svg', level: 75, rank: 'knight',
          description: 'Utilizado em arquitetura de microserviços para Casas Bahia durante atuação na Opah IT Consulting. Implementação de producers e consumers para comunicação assíncrona entre serviços de e-commerce em alta escala.',
        },
        {
          name: 'Node.js', icon: 'assets/icons/nodejs.svg', level: 70, rank: 'knight',
          description: 'Experiência em dois projetos distintos: sistema full stack com Angular 7 para o Grupo Fleury (área da saúde) e BFF (Backend for Frontend) bancário para a Crefisa. Ambos desenvolvidos durante a atuação na Opah IT Consulting.',
        },
      ]
    },
    {
      title: 'Dados & Arquitetura',
      skills: [
        {
          name: 'Microserviços', icon: 'assets/icons/microservicos.svg', level: 90, rank: 'master',
          description: 'Aplicado em projetos como Casas Bahia (Quarkus + Kafka) e Qintess (APIs bancárias de tokenização). Vivência com comunicação assíncrona, contratos de API, versionamento e resiliência em sistemas distribuídos de alta disponibilidade.',
        },
        {
          name: 'Clean Architecture', icon: 'assets/icons/clean-arch.svg', level: 85, rank: 'master',
          description: 'Aplicada na Destaxa com separação explícita entre camadas Domain, Application e Infrastructure em Java 17 + Spring Boot. Foco em testabilidade, inversão de dependências e isolamento das regras de negócio da plataforma de conciliação financeira.',
        },
        {
          name: 'PostgreSQL', icon: 'assets/icons/postgresql.svg', level: 85, rank: 'master',
          description: 'Primeira experiência na Embrapa (2012) usando Hibernate como ORM em um sistema de manejo florestal. Utilizado em projetos posteriores como banco relacional principal em sistemas transacionais de alta criticidade.',
        },
        {
          name: 'MongoDB', icon: 'assets/icons/mongodb.svg', level: 75, rank: 'knight',
          description: 'Experiência adquirida durante o projeto para Casas Bahia, onde utilizei MongoDB como banco de dados NoSQL para armazenamento e consulta de dados em uma arquitetura de microserviços com Quarkus e Apache Kafka.',
        },
        {
          name: 'Event-Driven Arch.', icon: 'assets/icons/event-driven.svg', level: 75, rank: 'knight',
          description: 'Experiência com arquitetura orientada a eventos utilizando Apache Kafka em microserviços para Casas Bahia. Foco em desacoplamento entre serviços e processamento assíncrono de eventos de pedidos e inventário em larga escala.',
        },
        {
          name: 'SQL Server', icon: 'assets/icons/sqlserver.svg', level: 75, rank: 'knight',
          description: 'Experiência adquirida no Grupo Fleury, onde a aplicação back-end em Node.js/Express realizava operações CRUD com SQL Server, além de consultas complexas com views, procedures e Outer Apply.',
        },
      ]
    },
    {
      title: 'Front-End',
      skills: [
        {
          name: 'Angular', icon: 'assets/icons/angular.svg', level: 70, rank: 'knight',
          description: 'Trabalhei com Angular em um sistema full stack para o Grupo Fleury com Angular 7 durante a Opah IT Consulting. Este portfolio pessoal foi desenvolvido com Angular 21, explorando standalone components, signals e as features mais recentes do framework.',
        },
        {
          name: 'TypeScript', icon: 'assets/icons/typescript.svg', level: 70, rank: 'knight',
          description: 'Experiência adquirida nos projetos do Grupo Fleury e Casas Bahia. Nessa última, atuei pontualmente com desenvolvimento front-end, utilizando TypeScript junto ao Angular.',
        },
        {
          name: 'JavaScript', icon: 'assets/icons/javascript.svg', level: 70, rank: 'knight',
          description: 'Experiência adquirida nos projetos do Grupo Fleury (Node.js/Express + Angular 7) e Casas Bahia, onde atuei pontualmente com desenvolvimento front-end.',
        },
        {
          name: 'HTML', icon: 'assets/icons/html.svg', level: 70, rank: 'knight',
          description: 'Experiência adquirida nos projetos do Grupo Fleury e Casas Bahia, com desenvolvimento de interfaces e templates em aplicações full stack Angular.',
        },
        {
          name: 'CSS', icon: 'assets/icons/css.svg', level: 65, rank: 'padawan',
          description: 'Experiência adquirida nos projetos do Grupo Fleury e Casas Bahia, com estilização de componentes em aplicações Angular. Este portfolio também foi uma oportunidade de aprofundar o conhecimento em CSS/SCSS.',
        },
        {
          name: 'Flexbox', icon: 'assets/icons/flexbox.svg', level: 60, rank: 'padawan',
          description: 'Conhecimento básico de layout com Flexbox aplicado no desenvolvimento deste portfolio e nos projetos de front-end do Grupo Fleury e Casas Bahia, para alinhamento e distribuição de elementos em interfaces Angular.',
        },
      ]
    },
    {
      title: 'DevOps & Cloud',
      skills: [
        {
          name: 'Docker', icon: 'assets/icons/docker.svg', level: 80, rank: 'knight',
          description: 'Utilizado na Destaxa para containerização dos serviços da plataforma de conciliação financeira, garantindo ambientes consistentes entre desenvolvimento e produção com Java 17 e Spring Boot.',
        },
        {
          name: 'Grafana', icon: 'assets/icons/grafana.svg', level: 65, rank: 'padawan',
          description: 'Configuração de dashboards de observabilidade na Destaxa para monitoramento da plataforma de conciliação de transações de adquirentes, acompanhando métricas de latência e volume de processamento.',
        },
        {
          name: 'Azure', icon: 'assets/icons/azure.svg', level: 60, rank: 'padawan',
          description: 'Experiência com Azure API Management na Qintess, onde desenvolvi APIs de tokenização (Apple Pay) integrando Caixa Econômica Federal e Visa. Utilização de políticas de segurança, transformação de requisições e autenticação na plataforma.',
        },
        {
          name: 'Kubernetes', icon: 'assets/icons/kubernetes.svg', level: 65, rank: 'padawan',
          description: 'Experiência adquirida na Casas Bahia, onde a infraestrutura de microserviços utilizava Kubernetes para orquestração de containers. Inicialmente o deploy era feito via OpenShift, depois migrado para Cloud Azure.',
        },
        {
          name: 'Jenkins', icon: 'assets/icons/jenkins.svg', level: 65, rank: 'padawan',
          description: 'Utilizado na fase inicial do projeto da Casas Bahia como ferramenta de CI/CD, integrado ao OpenShift para deploy dos microserviços. O pipeline foi posteriormente migrado para GitHub Actions e Cloud Azure.',
        },
        {
          name: 'GitHub Actions', icon: 'assets/icons/github-actions.svg', level: 65, rank: 'padawan',
          description: 'Adotado na Casas Bahia após a migração do pipeline de Jenkins/OpenShift para GitHub Actions e Cloud Azure, automatizando build, testes e deploy dos microserviços.',
        },
      ]
    }
  ];
}
