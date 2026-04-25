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

  navLinks = [
    { label: 'Início', anchor: 'hero' },
    { label: 'Sobre', anchor: 'about' },
    { label: 'Skills', anchor: 'skills' },
    { label: 'Experiência', anchor: 'experience' },
    { label: 'Projetos', anchor: 'projects' },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 40);
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
  }
}
