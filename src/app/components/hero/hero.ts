import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-hero',
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero {
  readonly youtubeUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.youtubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      // 'https://www.youtube.com/embed/iqSYQ40vukU' // vídeo anterior (slides Canva)
      'https://www.youtube.com/embed/0-kScbFRa90'
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
