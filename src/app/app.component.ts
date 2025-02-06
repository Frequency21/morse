import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  concatMap,
  delay,
  finalize,
  from,
  map,
  of,
  ReplaySubject,
  tap,
} from 'rxjs';
import { MORSE_TABLE, SPACE } from './app.constants';
import { AudioService } from './audio.service';
import { RevealDirective } from './reveal.directive';
import { Letter, SentenceComponent } from './sentence/sentence.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, SentenceComponent, RevealDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: {
    '(document:keyup)': 'onKeyboardUp($event)',
    '(document:keydown)': 'onKeyboardDown($event)',
  },
})
export class AppComponent implements OnInit {
  letters: Letter[] = [];
  activeLetter = 0;
  activeMorseCode = 0;
  private audioService = inject(AudioService);
  private document = inject(DOCUMENT);
  private dit = 1000;
  private dah = 3 * this.dit;
  private pause = 1000;
  private letterPause = 3 * this.pause;

  letter$ = new ReplaySubject<string>();
  morse$ = this.letter$.pipe(
    map((char, id) => [char, MORSE_TABLE.get(char)!, id] as const),
    tap(([char, morseCode, id]) => this.letters.push({ id, char, morseCode })),
    concatMap(([char, morseCode]) => {
      const lastIndex = morseCode.length - 1;
      return from(
        morseCode
          .split('')
          .map(
            (code, i) =>
              [code === '.' ? this.dit : this.dah, i === lastIndex] as const,
          ),
      ).pipe(
        concatMap(([time, isLast]) =>
          of(null).pipe(
            tap(() => {
              if (char === SPACE) return;
              this.audioService.start();
            }),
            delay(time),
            tap(() => this.audioService.stop()),
            delay(isLast ? 0 : this.pause),
            tap(() => ++this.activeMorseCode),
          ),
        ),
        delay(this.letterPause),
        finalize(() => {
          ++this.activeLetter;
          this.activeMorseCode = 0;
        }),
      );
    }),
  );

  keyboardRows = [
    'qwertyuiop'.split(''),
    'asdfghjkl'.split(''),
    'zxcvbnm'.split(''),
    ['space'],
  ];

  ngOnInit(): void {
    this.morse$.subscribe();
  }

  onPointerDown(button: HTMLButtonElement) {
    button.classList.add('pressed');
  }

  onPointerCancel(button: HTMLButtonElement) {
    button.classList.remove('pressed');
  }

  onPointerUp(button: HTMLButtonElement, key: string) {
    if (key === 'space') {
      key = SPACE;
    }
    this.letter$.next(key);
    button.classList.remove('pressed');
  }

  private keyboardEventToChar(event: KeyboardEvent): string {
    if (event.key.length !== 1) return '';
    let key = event.key.toLowerCase();
    const charCode = key.charCodeAt(0);

    // replace spaces to underlines
    if (charCode === 32) {
      key = SPACE;
    } else if (charCode < 97 || charCode > 122) return '';

    return key;
  }

  onKeyboardUp(event: KeyboardEvent) {
    const key = this.keyboardEventToChar(event);
    if (!key) return;
    this.document
      .querySelector(`[data-letter=${key}]`)
      ?.classList.remove('pressed');
    this.letter$.next(key);
  }

  onKeyboardDown(event: KeyboardEvent) {
    const key = this.keyboardEventToChar(event);
    if (!key) return;
    this.document
      .querySelector(`[data-letter=${key}]`)
      ?.classList.add('pressed');
  }
}
