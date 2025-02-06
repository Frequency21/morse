import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, inject, OnInit } from '@angular/core';
import { interval, take } from 'rxjs';

@Directive({
  selector: '[appReveal]',
})
export class RevealDirective implements OnInit {
  private document = inject(DOCUMENT);

  constructor(private elRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const text = this.elRef.nativeElement.textContent?.split('');
    this.elRef.nativeElement.textContent = '';

    if (!text) return;
    const letters: HTMLElement[] = [];
    for (const letter of text) {
      const span = this.document.createElement('span');
      span.textContent = letter;
      span.style.visibility = 'hidden';
      letters.push(span);
      this.elRef.nativeElement.appendChild(span);
    }

    interval(80)
      .pipe(take(text.length))
      .subscribe((index) => {
        letters[index].style.visibility = 'visible';
      });
  }
}
