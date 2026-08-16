import { Component, computed, signal } from '@angular/core';

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
export class Projects {
  items: Project[] = [
    {
      title: 'Flight Monitor',
      description: 'Monitor silencioso de preços de passagens aéreas. Roda em background, varre janelas de datas configuradas e avisa quando encontra uma oferta dentro dos seus critérios. Só incomoda quando há oportunidade real.',
      tags: ['Java', 'SpringBoot','RabbitMQ', 'PostgreSQL', 'Python' , 'FastAPI', 'Vue.js', 'TypeScript', 'Vite', 'Docker'],
      github: 'https://github.com/holandale0/3layers-flightmonitor',
      highlight: true
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

  /**
   * Lista de um item só. O `track index()` no template força o Angular a
   * recriar o nó a cada troca, disparando a animação de entrada do CSS.
   */
  readonly current = computed(() => [this.items[this.index()]]);

  /** Decorativos: LEDs das laterais e teclas da mesa de controle. */
  readonly leds = [0, 1, 2, 3, 4];
  readonly deckKeys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

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
