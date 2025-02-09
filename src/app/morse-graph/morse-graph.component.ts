import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-morse-graph]',
  imports: [],
  templateUrl: './morse-graph.component.html',
  encapsulation: ViewEncapsulation.None,
  host: {
    style: 'display: block; overflow-x: auto;',
  },
})
export class MorseGraphComponent {}
