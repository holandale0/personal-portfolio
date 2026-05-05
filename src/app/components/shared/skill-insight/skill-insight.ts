import { Component, input, computed } from '@angular/core';

type Rank = 'padawan' | 'knight' | 'master';

@Component({
  selector: 'app-skill-insight',
  templateUrl: './skill-insight.html',
  styleUrl: './skill-insight.scss'
})
export class SkillInsight {
  skillName = input.required<string>();
  description = input.required<string>();
  rank = input.required<Rank>();

  readonly rankLabel = computed(() => {
    const labels: Record<Rank, string> = {
      padawan: 'Padawan · Básico',
      knight:  'Jedi Knight · Intermediário',
      master:  'Jedi Master · Avançado',
    };
    return labels[this.rank()];
  });
}
