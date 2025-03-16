// 

import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { ResultsPageComponent } from './result/results-page.component';


export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'results', component: ResultsPageComponent }, // Results page
  { path: '**', redirectTo: '' } // Redirect unknown routes
];
