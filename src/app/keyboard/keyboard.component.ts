import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  inject,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import {
  concatMap,
  delay,
  finalize,
  from,
  map,
  of,
  ReplaySubject,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { RevealDirective } from '../reveal.directive';
import { Letter, SentenceComponent } from '../sentence/sentence.component';
import { AudioService } from '../audio.service';
import { BACK_SPACE, CLEAR, MORSE_TABLE, SPACE } from '../app.constants';

type DeletableLetter = Letter & { delete$: ReplaySubject<void> };

@Component({
  selector: 'app-keyboard',
  imports: [CommonModule, SentenceComponent, RevealDirective],
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.scss',
  host: {
    '(document:keyup)': 'onKeyboardUp($event)',
    '(document:keydown)': 'onKeyboardDown($event)',
  },
})
export class KeyboardComponent implements OnDestroy {
  isBrowser: boolean;
  letters: DeletableLetter[] = [];
  activeLetter = 0;
  activeMorseCode = 0;
  private audioService = inject(AudioService);
  private document = inject(DOCUMENT);
  private dit = 100;
  private dah = 3 * this.dit;
  private pause = this.dit;
  private letterPause = 3 * this.pause;

  letter$ = new Subject<string>();
  clear$ = new Subject<void>();
  destroyed$ = new ReplaySubject<void>();
  morse$ = () =>
    this.letter$.pipe(
      tap({
        subscribe: () => {
          this.letters = [];
          this.activeLetter = 0;
          this.activeMorseCode = 0;
        },
      }),
      map((char, id) => {
        const delete$ = new ReplaySubject<void>();
        return [char, MORSE_TABLE.get(char)!, id, delete$] as const;
      }),
      tap(([char, morseCode, id, delete$]) => {
        this.letters.push({ id, char, morseCode, delete$ });
      }),
      concatMap(([char, morseCode, _id, delete$]) => {
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
              finalize(() => {
                this.audioService.stop();
              }),
              takeUntil(delete$),
            ),
          ),
          delay(this.letterPause),
          takeUntil(this.destroyed$),
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
    [CLEAR, SPACE, BACK_SPACE],
  ];

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.clear$.pipe(switchMap(() => this.morse$())).subscribe();
    this.clear$.next();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  clearLetters(): void {
    this.clear$.next();
  }

  deleteLetter(): void {
    if (this.letters.length === 0) {
      return;
    }

    const last = this.letters[this.letters.length - 1];
    if (last.id <= this.activeLetter) {
      return;
    }

    const { delete$ } = this.letters.pop()!;
    delete$.next();
    delete$.complete();
  }

  onClick(key: string, event: Event): void {
    event.stopPropagation();
    (event.target as HTMLElement)?.blur();
    if (key === 'space') {
      key = SPACE;
    } else if (key === CLEAR) {
      return this.clearLetters();
    } else if (key === BACK_SPACE) {
      return this.deleteLetter();
    }
    this.letter$.next(key);
  }

  private keyboardEventToChar(
    event: KeyboardEvent,
    permitModifierKeys = true,
  ): string {
    if (event.repeat) return '';
    if (event.key === 'Backspace') return BACK_SPACE;
    if (event.key === 'C') return CLEAR;
    if (event.key.length !== 1) return '';
    if (
      permitModifierKeys &&
      (event.shiftKey || event.ctrlKey || event.altKey)
    ) {
      return '';
    }
    let key = event.key.toLowerCase();
    const charCode = key.charCodeAt(0);

    if (charCode === 32) {
      key = SPACE;
    } else if (charCode < 97 || charCode > 122) return '';

    return key;
  }

  onKeyboardUp(event: KeyboardEvent) {
    const key = this.keyboardEventToChar(event, false);
    if (!key) return;
    this.document
      .querySelector(`[data-letter=${key}]`)
      ?.classList.remove('pressed');
    if (key === 'c') {
      this.document
        .querySelector(`[data-letter=${CLEAR}]`)
        ?.classList.remove('pressed');
    }
  }

  onKeyboardDown(event: KeyboardEvent) {
    const key = this.keyboardEventToChar(event);
    if (!key) return;
    this.document
      .querySelector(`[data-letter=${key}]`)
      ?.classList.add('pressed');
    if (key === BACK_SPACE) {
      return this.deleteLetter();
    }
    if (key === CLEAR) {
      return this.clearLetters();
    }
    this.letter$.next(key);
  }
}
