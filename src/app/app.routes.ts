import { Routes } from '@angular/router';
import { KeyboardComponent } from './keyboard/keyboard.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: KeyboardComponent,
  },
  {
    path: 'about',
    pathMatch: 'full',
    loadComponent: () =>
      import('./rules/rules.component').then((c) => c.RulesComponent),
  },
];
