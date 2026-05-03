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
      title: 'Este Portfolio',
      description: 'Portfolio profissional desenvolvido com Angular 21 e design moderno. Estruturado como SPA com seções dedicadas para apresentação, skills, experiência e contato.',
      tags: ['Angular', 'TypeScript', 'SCSS'],
      github: 'https://github.com/holandale0/personal-portfolio',
      highlight: true
    },
    {
      title: 'API REST com Quarkus',
      description: 'API RESTful de alta performance construída com Quarkus e Java. Inclui autenticação JWT, validação de dados e documentação via OpenAPI.',
      tags: ['Java', 'Quarkus', 'PostgreSQL', 'Docker'],
      github: '#'
    },
    {
      title: 'WebSocket App com Quarkus',
      description: 'Aplicação de comunicação em tempo real utilizando WebSocket com Java e Quarkus. Demonstra troca de mensagens bidirecional entre cliente e servidor com baixa latência.',
      tags: ['Java', 'Quarkus', 'WebSocket'],
      github: 'https://github.com/holandale0/websocket-java-quarkus-app'
    }
  ];
}
