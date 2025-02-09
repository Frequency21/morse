import { DOCUMENT, isPlatformServer } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { MorseGraphComponent } from '../morse-graph/morse-graph.component';

@Component({
  selector: 'app-navbar',
  imports: [MorseGraphComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Input({ required: true }) isMenuOpen!: boolean;
  @Output() isMenuOpenChange = new EventEmitter<boolean>();

  isLightMode?: boolean;
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  constructor() {
    if (isPlatformServer(this.platformId)) {
      return;
    }
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: light)');
    this.isLightMode = colorSchemeQuery.matches;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.isMenuOpenChange.emit(this.isMenuOpen);
  }

  setTheme(theme: 'dark' | 'light'): void {
    this.document.documentElement.dataset['theme'] = theme;
    this.isLightMode = theme === 'light';
  }
}
