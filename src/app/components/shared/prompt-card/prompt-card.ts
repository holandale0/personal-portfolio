import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prompt-card',
  imports: [CommonModule],
  templateUrl: './prompt-card.html',
  styleUrl: './prompt-card.scss'
})
export class PromptCard {
  promptText = input.required<string>();
  label = input('Prompt Engineering');
  model = input('Claude Sonnet 4.6');

  showPrompt = signal(false);

  toggle() {
    this.showPrompt.update(v => !v);
  }
}
