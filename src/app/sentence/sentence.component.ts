import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

export type Letter = {
  id: number;
  key: string;
  morseCode: string;
};

@Component({
  selector: 'app-sentence',
  imports: [CommonModule],
  templateUrl: './sentence.component.html',
  styleUrl: './sentence.component.scss',
})
export class SentenceComponent {
  letters = input.required<Letter[]>();
  activeLetter = input.required<number>();
  activeMorseCode = input.required<number>();
}
