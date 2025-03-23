

import { Routes } from '@angular/router';
import { SearchComponent } from './features/search/search.component';



export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'results', loadComponent :() => import('./features/results-pgae/results-pgae.component').then(m => m.ResultsPageComponent)},
  { path: '**', redirectTo: '' } 
];
