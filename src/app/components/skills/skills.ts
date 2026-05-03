import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptCard } from '../shared/prompt-card/prompt-card';

type Rank = 'padawan' | 'knight' | 'master';

interface Skill {
  name: string;
  icon: string;
  level: number; // largura da lâmina do sabre (0–100)
  rank: Rank;    // patente definida manualmente
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

@Component({
  selector: 'app-skills',
  imports: [CommonModule, PromptCard],
  templateUrl: './skills.html',
  styleUrl: './skills.scss'
})
export class Skills {
  readonly prompt = `Eu tive uma idéia para incorporar algo que sou apaixonado ao meu portfolio. Eu sou muito fã de Star Wars, e gostaria de usar isso de alguma forma. Um exemplo que podemos fazer é classificar o nível de perícia em linguagens, ferramentas, frameworks como padawan, knight e master. De resto, você pode usar sua criatividade, e eu indicarei se ficou bom ou se eu gostaria que mudasse algo.`;

  readonly rankLabel: Record<Rank, string> = {
    padawan: 'Padawan',
    knight:  'Jedi Knight',
    master:  'Jedi Master',
  };

  categories: SkillCategory[] = [
    {
      title: 'Back-End',
      skills: [
        { name: 'Java',           icon: '☕', level: 95, rank: 'master'  },
        { name: 'Spring Boot',    icon: '🌱', level: 90, rank: 'master'  },
        { name: 'Quarkus',        icon: '⚡', level: 85, rank: 'master'  },
        { name: 'Spring WebFlux', icon: '🌊', level: 80, rank: 'knight'  },
        { name: 'Apache Kafka',   icon: '📨', level: 75, rank: 'knight'  },
        { name: 'Node.js',        icon: '🟢', level: 70, rank: 'knight'  },
      ]
    },
    {
      title: 'Dados & Arquitetura',
      skills: [
        { name: 'Microserviços',      icon: '🏗️', level: 90, rank: 'master'  },
        { name: 'Clean Architecture', icon: '🎯', level: 85, rank: 'master'  },
        { name: 'PostgreSQL',         icon: '🐘', level: 85, rank: 'master'  },
        { name: 'MongoDB',            icon: '🍃', level: 75, rank: 'knight'  },
        { name: 'Event-Driven Arch.', icon: '🔁', level: 75, rank: 'knight'  },
        { name: 'SQL Server',         icon: '🗄️', level: 75, rank: 'knight' },
      ]
    },
    {
      title: 'Front-End',
      skills: [
        { name: 'Angular',     icon: '🅰️', level: 70, rank: 'knight'  },
        { name: 'TypeScript',  icon: '🔷', level: 70, rank: 'knight'  },
        { name: 'JavaScript',  icon: '🟡', level: 70, rank: 'knight'  },
        { name: 'HTML',        icon: '🌐', level: 70, rank: 'knight'  },
        { name: 'CSS',         icon: '🎨', level: 65, rank: 'padawan'  },
      ]
    },
    {
      title: 'DevOps & Cloud',
      skills: [
        { name: 'Docker',          icon: '🐳', level: 80, rank: 'knight'  },
        { name: 'Grafana',         icon: '📊', level: 65, rank: 'padawan' },
        { name: 'Azure',           icon: '☁️', level: 60, rank: 'padawan' },
        { name: 'Kubernetes',      icon: '⚙️', level: 65, rank: 'padawan' },
        { name: 'Jenkins',         icon: '🔧', level: 65, rank: 'padawan' },
        { name: 'GitHub Actions',  icon: '🤖', level: 65, rank: 'padawan' },
      ]
    }
  ];
}
