import { Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-hologram-player',
  templateUrl: './hologram-player.html',
  styleUrl: './hologram-player.scss',
})
export class HologramPlayer {
  readonly videoUrl = input.required<string>();

  private sanitizer = inject(DomSanitizer);

  readonly active = signal(false);

  readonly safeUrl = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl() + '?autoplay=1')
  );

  activate() {
    this.active.set(true);
  }

  close(event: Event) {
    event.stopPropagation();
    this.active.set(false);
  }
}
