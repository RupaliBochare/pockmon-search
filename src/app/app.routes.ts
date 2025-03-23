

import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';


export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'results', loadComponent :() => import('./results-pgae/results-pgae.component').then(m => m.ResultsPageComponent)},
  { path: '**', redirectTo: '' } 
];
