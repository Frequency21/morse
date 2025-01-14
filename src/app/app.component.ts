import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { filter, map, of } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: {
    '(document:keyup)': 'onKeyboardUp($event)',
    '(document:keydown)': 'onKeyboardDown($event)',
  },
})
export class AppComponent {
  title = 'morse';

  keyboardRows = [
    'qwertyuiop'.split(''),
    'asdfghjkl'.split(''),
    'zxcvbnm'.split(''),
    ['space'],
  ];

  onKeyboardUp(event: KeyboardEvent) {
    if (event.key.length !== 1) return;
    let key = event.key.toLowerCase();

    const charCode = key.charCodeAt(0);

    if (charCode === 32) {
      key = 'space';
    } else if (charCode < 97 || charCode > 122) return;

    document.querySelector(`[data-letter=${key}]`)?.classList.remove('pressed');
  }

  onKeyboardDown(event: KeyboardEvent) {
    if (event.key.length !== 1) return;
    let key = event.key.toLowerCase();

    const charCode = key.charCodeAt(0);

    if (charCode === 32) {
      key = 'space';
    } else if (charCode < 97 || charCode > 122) return;

    document.querySelector(`[data-letter=${key}]`)?.classList.add('pressed');
  }

  onMouseDown(event: MouseEvent) {
    (event.target as HTMLElement).classList.add('pressed');
  }

  onMouseUp(event: MouseEvent) {
    (event.target as HTMLElement).classList.remove('pressed');
  }
}
