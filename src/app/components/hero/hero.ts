import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PromptCard } from '../shared/prompt-card/prompt-card';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, PromptCard],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero {
  readonly youtubeUrl: SafeResourceUrl;

  readonly heroPrompt = `Bom, eu gostaria de criar um portfolio profissional para mim. Inicialmente eu gostaria que o portifolio carregasse um vídeo gravado por mim, onde eu me apresento e faço um resumo sobre a minha tragetória até hoje. Eu gostaria de desenvolver esse portfolio utilizando Angular (versão mais estável), pois é uma das skills que eu pretendo destacar no portfolio. O foco inicial é criar o projeto front-end e ir refinando até que fique do jeito que eu idealizo. Quero que você construa para mim, do zero, a estrutura desse projeto. Vamos chama-lo de portfolio ou personal-portfolio.`;

  constructor(private sanitizer: DomSanitizer) {
    this.youtubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/AJX57W9RKjo'
    );
  }

  scrollToAbout() {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToContact() {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
