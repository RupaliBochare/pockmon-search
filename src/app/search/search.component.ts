import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // ✅ Import Router
import { SearchStateService } from '../core/services/search-state.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  pokemonName: string = '';
  suggestions: string[] = [];
  private pokemonList: string[] = [];
  private previousSearchText: string = '';
  private previousPage: number = 1;
  private isPokemonListFetched = false;
  private debounceTimer: any;

  constructor(
    readonly http: HttpClient,
    readonly router: Router,
    readonly searchService: SearchStateService
  ) {} 

  ngOnInit() {
    // need to make it conditionly like if have priviose search text then dont call fetchPokemonList 
   
    const { pokemonName, currentPage  } = this.searchService.getState();
    if (pokemonName) {
      this.pokemonName = pokemonName;
      this.previousSearchText = pokemonName;
      this.previousPage = currentPage;
      this.isPokemonListFetched = true;
    } else {
      this.fetchPokemonList();
    }
  }
  onInputChange() {
    clearTimeout(this.debounceTimer);
    
    this.debounceTimer = setTimeout(() => {
      const trimmedName = this.pokemonName.trim();

      if (trimmedName && trimmedName !== this.previousSearchText) {
        this.previousSearchText = trimmedName;
        this.fetchPokemonList();
        this.filterSuggestions();
      } else if (!trimmedName) {
        this.suggestions = [];
      }
    }, 300); // Debounce delay in milliseconds
  }


  fetchPokemonList() {
    this.searchService.fetchPokemonList().subscribe((response) => {
      this.pokemonList = response.results.map((pokemon: any) => pokemon.name);
    });
  }

  filterSuggestions() {
    this.suggestions = this.pokemonName.trim()
      ? this.pokemonList.filter((name) =>
          name.includes(this.pokemonName.toLowerCase())
        )
      : [];
  }

  onSuggestionClick(suggestion: string) {
    this.pokemonName = suggestion;
    this.suggestions = [];
    this.navigateToResults(); 
  }

  onSearchClick() {
    this.navigateToResults();
  }

  public navigateToResults() {
    if (this.pokemonName.trim()) {
      const isSameSearch = this.pokemonName === this.previousSearchText;
      const targetPage = isSameSearch ? this.previousPage : 1;
      this.router.navigate(['/results'], {
        queryParams: { name: this.pokemonName, page: targetPage },
      });
    }
  }
}
