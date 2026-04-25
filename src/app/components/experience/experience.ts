import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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

@Component({
  selector: 'app-experience',
  imports: [CommonModule],
  templateUrl: './experience.html',
  styleUrl: './experience.scss'
})
export class Experience {
  items: ExperienceItem[] = [
    {
      role: 'Desenvolvedor Java',
      company: 'Embrapa',
      period: 'Nov 2012 — Jul 2016',
      description: 'Projeto de pesquisa científica para migração de sistema de manejo florestal de Delphi para Java Swing. Persistência com Hibernate e PostgreSQL, geração de relatórios com JasperReports. Sistema utilizado por engenheiros florestais para planejamento de colheita sustentável.',
      tags: ['Java', 'Hibernate', 'PostgreSQL', 'JasperReports'],
      imageBefore: 'assets/fotos/padawan1.png',
      imageAfter: 'assets/fotos/padawan2.png',
    },
    {
      role: 'Desenvolvedor Back-End Java',
      company: 'Opah IT Consulting',
      period: 'Abr 2018 — Out 2023',
      description: 'Mais de 5 anos em projetos para grandes clientes: microserviços com Quarkus e Apache Kafka para Casas Bahia; jobs batch com Spring Batch para Banco Original; sistema full stack com Node.js e Angular 7 para Grupo Fleury; BFF bancário com Node.js para Crefisa.',
      tags: ['Java', 'Quarkus', 'Kafka', 'Spring Batch', 'Node.js', 'Angular'],
      imageAfter: 'assets/fotos/knight1.png',
      imageAfterCard: true,
    },
    {
      role: 'Desenvolvedor Back-End',
      company: 'Destaxa',
      period: 'Mai 2024 — Out 2024',
      description: 'Plataforma de conciliação financeira de transações de adquirentes. Serviços reativos com Java 17, Spring Boot, WebFlux e R2DBC. Clean Architecture com separação entre camadas Domain, Application e Infrastructure. Containerização com Docker e observabilidade via Grafana.',
      tags: ['Java 17', 'Spring Boot', 'WebFlux', 'R2DBC', 'Docker', 'Grafana'],
      imageAfter: 'assets/fotos/knight2.png',
      imageAfterCard: true,
    },
    {
      role: 'Desenvolvedor Back-End Java',
      company: 'Qintess',
      period: 'Out 2024 — Mar 2026',
      description: 'Desenvolvimento de soluções para carteiras digitais (Apple Pay) com integração entre Caixa Econômica Federal e Visa. APIs REST com Java 17 e Quarkus para gerenciamento do ciclo de vida de tokens, implementação de criptografia JWS/JWE e integração via Azure API Management.',
      tags: ['Java 17', 'Quarkus', 'Azure', 'REST APIs', 'JWS/JWE'],
      imageAfter: 'assets/fotos/master1.png',
      imageAfterCard: true,
    },
  ];
}
