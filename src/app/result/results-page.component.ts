import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ResultComponent } from '../result/result.component';
import { PaginatorComponent } from '../paginator/paginator.component';
import { SearchStateService } from '../core/services/search-state.service';

interface Encounter {
  location_area: { name: string };
  version_details: { version: { name: string }; max_chance: number }[];
}

@Component({
  selector: 'app-results-page',
  standalone: true,
  imports: [CommonModule, ResultComponent, PaginatorComponent],
  template: `
    <div *ngIf="pokemonName">
      <h2 class ="overflow-x-auto p-5">Encounters for {{ pokemonName }}</h2>
      <app-result [encounters]="paginatedEncounters"></app-result>
      <app-paginator
        [currentPage]="currentPage"
        [totalPages]="totalPages"
        (pageChange)="changePage($event)">
      </app-paginator>
    </div>
  `
})
export class ResultsPageComponent implements OnInit {
  readonly route = inject(ActivatedRoute);
  readonly http = inject(HttpClient);
  private searchService = inject(SearchStateService);

  pokemonName = '';
  encounters = [];
  paginatedEncounters = [];

  currentPage = 1;
  totalPages = 0;
  limit = 10;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.pokemonName = params['name'] || this.searchService.getState().pokemonName;
      this.currentPage = +params['page'] || this.searchService.getState().currentPage;

      const cachedState = this.searchService.getState();

      // ✅ Check for cached data or fetch if needed
      if (cachedState.pokemonName === this.pokemonName && cachedState.encounters.length > 0) {
        this.useCachedData(cachedState);
      } else {
        this.fetchEncounters();
      }
    });
  }

  private useCachedData(cachedState: any) {
    this.encounters = cachedState.encounters;
    this.totalPages = cachedState.totalPages;
    this.updatePaginatedData();
  }

  private fetchEncounters(): void {
    this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${this.pokemonName}/encounters`).subscribe(
      (results) => {
        this.encounters = results;
        this.totalPages = Math.ceil(results.length / this.limit);
        this.searchService.setState({
          pokemonName: this.pokemonName,
          encounters: results,
          totalPages: this.totalPages,
          currentPage: this.currentPage,
        });
        this.updatePaginatedData();
      },
      (error) => {
        this.searchService.setState({
          pokemonName: this.pokemonName,
          encounters: [],
          totalPages: this.totalPages,
          currentPage: this.currentPage,
        });
        console.error('Error fetching encounters:', error)}
    );
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.searchService.setState({ currentPage: this.currentPage });
    this.updatePaginatedData();
  }

  private updatePaginatedData(): void {
    const start = (this.currentPage - 1) * this.limit;
    this.paginatedEncounters = this.encounters.slice(start, start + this.limit);
  }
}
