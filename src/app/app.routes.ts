

import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { ResultsPageComponent } from './results-pgae/results-pgae.component';

export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'results', component: ResultsPageComponent }, 
  { path: '**', redirectTo: '' } 
];
