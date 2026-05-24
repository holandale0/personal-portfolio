import { Component, signal } from '@angular/core';
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
export class Skills {
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
