import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  isScrolled = signal(false);
  isMenuOpen = signal(false);

  /**
   * Some ao rolar para baixo, volta ao rolar para cima.
   *
   * Em navegador embutido (Instagram, Facebook) a barra do próprio app se
   * recolhe e reexpande durante a rolagem, e uma navbar `fixed` fica ancorada
   * ao topo do layout viewport — que nesses momentos não coincide com a área
   * visível, deixando-a cortada pela metade. Escondendo-a por inteiro enquanto
   * se desce, ela nunca fica nesse meio-termo.
   */
  isHidden = signal(false);

  /** Posição da última mudança de direção considerada. */
  private lastY = 0;

  /** Rolagem mínima para reagir: sem isso a navbar pisca no quique do toque. */
  private readonly DELTA = 6;

  /** Antes disso ela fica sempre à vista — o topo é onde o menu é mais útil. */
  private readonly HIDE_AFTER = 80;

  navLinks = [
    { label: 'Início', anchor: 'hero' },
    { label: 'Sobre', anchor: 'about' },
    { label: 'Projetos', anchor: 'projects' },
    { label: 'Skills', anchor: 'skills' },
    { label: 'Experiência', anchor: 'experience' },
  ];

  @HostListener('window:scroll')
  onScroll() {
    const y = window.scrollY;
    this.isScrolled.set(y > 40);

    const delta = y - this.lastY;
    if (Math.abs(delta) < this.DELTA) return;
    this.lastY = y;

    // Com o menu aberto ela não pode sumir: o menu é filho dela e iria junto.
    if (y < this.HIDE_AFTER || this.isMenuOpen()) {
      this.isHidden.set(false);
      return;
    }

    this.isHidden.set(delta > 0);
  }

  scrollTo(anchor: string) {
    const el = document.getElementById(anchor);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    this.isMenuOpen.set(false);
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
    if (this.isMenuOpen()) this.isHidden.set(false);
  }
}
