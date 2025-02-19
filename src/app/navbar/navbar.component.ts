import { DOCUMENT, isPlatformServer } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'nav[app-nav]',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isMenuOpen = false;

  isLightMode?: boolean;
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);
  private router = inject(Router);

  constructor() {
    if (isPlatformServer(this.platformId)) {
      return;
    }
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: light)');
    this.isLightMode = colorSchemeQuery.matches;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.router.navigate(['/about']);
    } else {
      this.router.navigate(['']);
    }
  }

  setTheme(theme: 'dark' | 'light'): void {
    this.document.documentElement.dataset['theme'] = theme;
    this.isLightMode = theme === 'light';
  }
}
