import { Component, input, output } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { ExperienceItem } from '../experience';

@Component({
  selector: 'app-experience-crawl',
  imports: [UpperCasePipe],
  templateUrl: './experience-crawl.html',
  styleUrl: './experience-crawl.scss'
})
export class ExperienceCrawl {
  item         = input.required<ExperienceItem>();
  introText    = input.required<string>();
  episodeNumber = input.required<string>();
  closed       = output<void>();

  readonly stars = Array.from({ length: 180 }, () => ({
    x:       Math.random() * 100,
    y:       Math.random() * 100,
    size:    Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.75 + 0.25,
  }));

  close() { this.closed.emit(); }
}
