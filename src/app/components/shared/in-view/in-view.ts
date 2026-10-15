import { Directive, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';

/**
 * Põe a classe `in-view` no host enquanto ele estiver na tela.
 *
 * Existe para que animação só rode quando alguém pode vê-la. Animação fora da
 * tela continua custando composição e concorre com a rolagem do resto da
 * página — foi exatamente o que aconteceu com a areia da Trajetória antes de
 * ela ganhar o mesmo cuidado (ver `experience.ts`).
 */
@Directive({
  selector: '[appInView]',
})
export class InView implements OnInit, OnDestroy {
  private readonly host = inject(ElementRef).nativeElement as HTMLElement;
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      ([entry]) => this.host.classList.toggle('in-view', entry.isIntersecting),
      { threshold: 0 },
    );
    this.observer.observe(this.host);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
