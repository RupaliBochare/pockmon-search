import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface Encounter {
  location_area: { name: string };
  version_details: { version: { name: string }; max_chance: number }[];
}

export interface SearchState {
  pokemonName: string;
  encounters: Encounter[];
  currentPage: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class SearchStateService {
  private state: SearchState = {
    pokemonName: '',
    encounters: [],
    currentPage: 1,
    totalPages: 0,
  };

  private stateSubject = new BehaviorSubject<SearchState>(this.state);

  constructor(private readonly http: HttpClient) {}

  // Fetch Pokémon List with Caching
  fetchPokemonList(): Observable<any> {
    return this.http.get<any>('https://pokeapi.co/api/v2/pokemon?limit=100').pipe(
      catchError(() => of([]))
    );
  }

  // Fetch Encounters with Caching Logic
  fetchEncounters(pokemonName: string): Observable<Encounter[]> {
    if (this.state.pokemonName === pokemonName && this.state.encounters.length > 0) {
      return of(this.state.encounters);
    }

    return this.http.get<Encounter[]>(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/encounters`).pipe(
      tap((results) => {
        this.state.encounters = results;
        this.state.totalPages = Math.ceil(results.length / 10);
        this.state.pokemonName = pokemonName;
        this.stateSubject.next(this.state);
      }),
      catchError(() => of([]))
    );
  }

  // Get Current State
  getState(): SearchState {
    return this.state;
  }

  // Update State
  setState(partialState: Partial<SearchState>): void {
    this.state = { ...this.state, ...partialState };
    this.stateSubject.next(this.state);
  }

  // Observable for State Changes
  getStateObservable(): Observable<SearchState> {
    return this.stateSubject.asObservable();
  }

  // Clear State
  clearState(): void {
    this.state = {
      pokemonName: '',
      encounters: [],
      currentPage: 1,
      totalPages: 0,
    };
    this.stateSubject.next(this.state);
  }
}
