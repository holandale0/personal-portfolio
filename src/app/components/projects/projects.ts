import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects {
  items: Project[] = [
    {
      title: 'Conciliação Financeira Batch',
      description: 'Aplicação batch de conciliação financeira com Java e Spring Batch. Processa grandes volumes de transações financeiras, validando e reconciliando registros entre sistemas de pagamento.',
      tags: ['Java', 'Spring Batch', 'Spring Boot', 'PostgreSQL'],
      github: 'https://github.com/holandale0/financial-reconciliation-batch',
      highlight: true
    },
    {
      title: 'Este Portfolio',
      description: 'Portfolio profissional desenvolvido com Angular 21 e design moderno. Estruturado como SPA com seções dedicadas para apresentação, skills, experiência e contato.',
      tags: ['Angular', 'TypeScript', 'SCSS'],
      github: 'https://github.com/holandale0/personal-portfolio',
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
}
