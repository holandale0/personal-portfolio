import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About {
  stats = [
    { value: '10+', label: 'Anos de Experiência' },
    { value: '4',   label: 'Empresas' },
    { value: '20+', label: 'Tecnologias' },
    { value: '100%', label: 'Comprometimento' },
  ];
}
