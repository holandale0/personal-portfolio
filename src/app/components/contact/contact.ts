import {
  AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject,
} from '@angular/core';
import { InView } from '../shared/in-view/in-view';
import { renderLightLayer, sizeToHost } from '../shared/light-layer';

@Component({
  selector: 'app-contact',
  imports: [InView],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact implements AfterViewInit, OnDestroy {
  @ViewChild('holoCanvas') private canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('holoImg')    private imgRef!: ElementRef<HTMLImageElement>;

  private readonly hostRef = inject(ElementRef);
  private observer?: ResizeObserver;

  /* Medido na própria arte: a parede ao redor do holograma não passa de 66
     de luminância, enquanto o cone de luz fica entre 91 e 132 e os ícones
     chegam a 218. A rampa de 68 a 145 separa os dois com folga. */
  private readonly LIGHTS = { low: 68, high: 145, gain: 1.25 };

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const img    = this.imgRef.nativeElement;
    const host   = canvas.parentElement!;

    const paint = () => {
      sizeToHost(canvas, host);
      renderLightLayer(img, canvas, this.LIGHTS);
    };

    // A imagem é lazy: pode ainda não ter chegado quando a view monta.
    if (img.complete) paint();
    img.addEventListener('load', paint);

    this.observer = new ResizeObserver(paint);
    this.observer.observe(host);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
