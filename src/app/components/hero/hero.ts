import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HologramPlayer } from '../shared/hologram-player/hologram-player';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, HologramPlayer],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero {
  readonly youtubeEmbedUrl = 'https://www.youtube.com/embed/0-kScbFRa90';

  scrollToAbout() {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToContact() {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
