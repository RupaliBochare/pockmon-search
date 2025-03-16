import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ResultComponent } from '../result/result.component';
import { PaginatorComponent } from '../paginator/paginator.component';
import { SearchStateService } from '../core/services/search-state.service';
import { Encounter } from '../core/services/search-state.service';

@Component({
  selector: 'app-results-page',
  standalone: true,
  imports: [CommonModule, ResultComponent, PaginatorComponent],
  templateUrl: './results-pgae.component.html',
  styleUrl: './results-pgae.component.css'
})
export class ResultsPageComponent implements OnInit {
  readonly route = inject(ActivatedRoute);
  readonly searchService = inject(SearchStateService);

  pokemonName = '';
  encounters: Encounter[] = [];
  paginatedEncounters: Encounter[] = [];

  currentPage = 1;
  totalPages = 0;
  limit = 10;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.pokemonName = params['name'] || this.searchService.getState().pokemonName;
      this.currentPage = +params['page'] || this.searchService.getState().currentPage;

      this.fetchEncounters();
    });
  }

  private fetchEncounters(): void {
    this.searchService.fetchEncounters(this.pokemonName).subscribe({
      next: (results) => {
        this.encounters = results;
        if(this.encounters.length > 1) {
          this.totalPages = Math.ceil(results.length / this.limit);
          this.searchService.setState({
            encounters: results,
            totalPages: this.totalPages,
            currentPage: this.currentPage,
          });
          this.updatePaginatedData();
        }
      
      },
      error: () => {
        this.encounters = [];
        this.paginatedEncounters = [];
        this.searchService.setState({
          encounters: []
        });
      }
    });
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
