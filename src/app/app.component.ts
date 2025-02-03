import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  concatMap,
  delay,
  filter,
  finalize,
  from,
  interval,
  map,
  of,
  ReplaySubject,
  Subject,
  tap,
} from 'rxjs';
import { MORSE_TABLE, SPACE } from './app.constants';
import { Letter, SentenceComponent } from './sentence/sentence.component';
import { AudioService } from './audio.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, SentenceComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: {
    '(document:keyup)': 'onKeyboardUp($event)',
    '(document:keydown)': 'onKeyboardDown($event)',
  },
})
export class AppComponent {
  title = 'morse';

  letters: Letter[] = [];
  activeLetter = 0;
  activeMorseCode = 0;
  audioService = inject(AudioService);
  dit = 50;
  dah = 3 * this.dit;
  pause = 2 * this.dit;

  letter$ = new ReplaySubject<string>();
  morse$ = this.letter$.pipe(
    map((key, id) => [key, MORSE_TABLE.get(key)!, id] as const),
    tap(([key, morseCode, id]) => {
      console.log(key, morseCode, id);
      this.letters.push({ id, key, morseCode });
    }),
    concatMap(([key, morseCode, id]) => {
      return from(morseCode).pipe(
        map((code) => [code, code === '.' ? this.dit : this.dah] as const),
        concatMap(([code, time]) =>
          of(code).pipe(
            tap(() => {
              if (key !== SPACE) {
                this.audioService.start();
              }
            }),
            delay(time),
            tap(() => {
              this.audioService.stop();
              ++this.activeMorseCode;
            }),
            delay(this.pause),
          ),
        ),
        finalize(() => {
          ++this.activeLetter;
          this.activeMorseCode = 0;
        }),
      );
    }),
    // TODO
  );

  keyboardRows = [
    'qwertyuiop'.split(''),
    'asdfghjkl'.split(''),
    'zxcvbnm'.split(''),
    ['space'],
  ];

  constructor() {
    this.morse$.subscribe();
    // interval(1000).subscribe(
    //   () => (this.activeMorseCode = ++this.activeMorseCode % 4),
    // );
    // interval(1000).subscribe(() => ++this.activeLetter);
  }

  stop() {
    this.audioService.stop();
  }

  start() {
    this.audioService.start();
  }

  onKeyboardUp(event: KeyboardEvent) {
    if (event.key.length !== 1) return;
    let key = event.key.toLowerCase();

    const charCode = key.charCodeAt(0);

    // replace spaces to underlines
    if (charCode === 32) {
      key = '␣';
    } else if (charCode < 97 || charCode > 122) return;

    document.querySelector(`[data-letter=${key}]`)?.classList.remove('pressed');
    this.letter$.next(key);
  }

  onKeyboardDown(event: KeyboardEvent) {
    if (event.key.length !== 1) return;
    let key = event.key.toLowerCase();

    const charCode = key.charCodeAt(0);

    // replace spaces to underlines
    if (charCode === 32) {
      key = '␣';
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
