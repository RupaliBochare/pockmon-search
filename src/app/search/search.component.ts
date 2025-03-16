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

  constructor(
    readonly http: HttpClient,
    readonly router: Router,
    private searchService: SearchStateService
  ) {} 

  ngOnInit() {
    // need to make it conditionly like if have priviose search text then dont call fetchPokemonList 
    this.fetchPokemonList();
    const { pokemonName, currentPage  } = this.searchService.getState();
    if (pokemonName) {
      this.pokemonName = pokemonName;
      this.previousSearchText = pokemonName;
      this.previousPage = currentPage;
    }
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

      // // Update the state only if search text has changed
      // this.searchService.setState({
      //   pokemonName: this.pokemonName,
      //   currentPage: targetPage,
      // });

      this.router.navigate(['/results'], {
        queryParams: { name: this.pokemonName, page: targetPage },
      });
    }
  }
}
