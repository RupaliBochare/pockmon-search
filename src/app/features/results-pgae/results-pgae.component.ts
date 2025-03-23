import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ResultComponent } from '../result/result.component';

import { Subscription } from 'rxjs';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';
import { Encounter, SearchStateService } from '../../core/services/search-state.service';

@Component({
  selector: 'app-results-page',
  standalone: true,
  imports: [CommonModule, ResultComponent, PaginatorComponent],
  templateUrl: './results-pgae.component.html',
  styleUrls: ['./results-pgae.component.css']
})
export class ResultsPageComponent implements OnInit, OnDestroy {
  readonly route = inject(ActivatedRoute);
  readonly searchService = inject(SearchStateService);

  pokemonName = '';
  previousPokemonName = '';
  encounters: Encounter[] = [];
  paginatedEncounters: Encounter[] = [];

  currentPage = 1;
  totalPages = 0;
  limit = 10;
  private subscription!: Subscription;

  ngOnInit(): void {
    this.subscription = this.searchService.getStateObservable().subscribe(state => {
      
      this.pokemonName = state.pokemonName;
      this.encounters = state.encounters;
      this.currentPage = state.currentPage;
      this.totalPages = state.totalPages;
      this.updatePaginatedData();
    });

    this.route.queryParams.subscribe(params => {
      const pokemonName = params['name'];
      const currentPage = +params['page'];

      if (pokemonName !== this.pokemonName || currentPage !== this.currentPage) {
        this.fetchEncounters(pokemonName);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private fetchEncounters(pokemonName: string): void {
    this.searchService.fetchEncounters(pokemonName).subscribe({
      next: (results) => {
       // this.searchService.setState({ encounters: results , currentPage: 1});
      },
      error: () => {
        this.searchService.setState({ encounters: [] });
      }
    });
  }

  changePage(page: number): void {
    this.searchService.setState({ currentPage: page });
    this.updatePaginatedData();
  }

  private updatePaginatedData(): void {
    const start = (this.currentPage - 1) * this.limit;
    this.paginatedEncounters = this.encounters.slice(start, start + this.limit);
  }
}