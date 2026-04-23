import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {
  name = '';
  email = '';
  message = '';
  submitted = signal(false);

  socialLinks = [
    { icon: 'github', label: 'GitHub', url: 'https://github.com/' },
    { icon: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/' },
    { icon: 'email', label: 'E-mail', url: 'mailto:seu@email.com' },
  ];

  onSubmit() {
    if (this.name && this.email && this.message) {
      this.submitted.set(true);
      this.name = '';
      this.email = '';
      this.message = '';
    }
  }
}
