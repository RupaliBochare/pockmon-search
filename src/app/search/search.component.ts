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
  
      if (!trimmedName) {
        this.suggestions = [];
        return;
      }
  
      // Fetch again if list is empty (like after navigating back)
      if (!this.isPokemonListFetched || this.pokemonList.length === 0) {
        this.fetchPokemonList();
      } else {
        this.filterSuggestions();
      }
  
      this.previousSearchText = trimmedName;
    }, 300);
  }
  
  fetchPokemonList() {
    this.searchService.fetchPokemonList().subscribe((response) => {
      this.pokemonList = response.results.map((pokemon: any) => pokemon.name);
      this.isPokemonListFetched = true;
      this.filterSuggestions(); //  Ensure suggestions are updated after fetching
    });
  }
  
  filterSuggestions() {
    const searchValue = this.pokemonName.trim().toLowerCase();
  
    if (!searchValue) {
      this.suggestions = [];
      return;
    }
  
    this.suggestions = this.pokemonList.filter((name) =>
      name.toLowerCase().includes(searchValue)
    );
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
