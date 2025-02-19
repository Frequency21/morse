import { Component } from '@angular/core';
import { MorseGraphComponent } from '../morse-graph/morse-graph.component';

@Component({
  selector: 'app-rules',
  imports: [MorseGraphComponent],
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.scss',
})
export class RulesComponent {}
