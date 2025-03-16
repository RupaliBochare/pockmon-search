import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SearchStateService, Encounter, SearchState } from './search-state.service';

describe('SearchStateService', () => {
  let service: SearchStateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SearchStateService],
    });

    service = TestBed.inject(SearchStateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchPokemonList', () => {
    it('should fetch the Pokémon list successfully', () => {
      const mockData = { results: [{ name: 'pikachu' }] };

      service.fetchPokemonList().subscribe((data) => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon?limit=100');
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });

    it('should handle error and return an empty array', () => {
      service.fetchPokemonList().subscribe((data) => {
        expect(data).toEqual([]);
      });

      const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon?limit=100');
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('fetchEncounters', () => {
    const pokemonName = 'pikachu';
    const mockEncounters: Encounter[] = [
      {
        location_area: { name: 'kanto-route-1' },
        version_details: [{ version: { name: 'red' }, max_chance: 30 }],
      },
    ];

    it('should fetch encounters and update the state', () => {
      service.fetchEncounters(pokemonName).subscribe((data) => {
        expect(data).toEqual(mockEncounters);
        const state = service.getState();
        expect(state.pokemonName).toBe(pokemonName);
        expect(state.encounters).toEqual(mockEncounters);
        expect(state.totalPages).toBe(1);
      });

      const req = httpMock.expectOne(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/encounters`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEncounters);
    });

    it('should return cached encounters if already fetched', () => {
      // Set initial state with cached data
      service.setState({
        pokemonName,
        encounters: mockEncounters,
        totalPages: 1,
        currentPage: 1,
      });

      service.fetchEncounters(pokemonName).subscribe((data) => {
        expect(data).toEqual(mockEncounters);
      });

      // No HTTP request should be triggered due to caching
      httpMock.expectNone(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/encounters`);
    });

    it('should handle error and return an empty array', () => {
      service.fetchEncounters(pokemonName).subscribe((data) => {
        expect(data).toEqual([]);
      });

      const req = httpMock.expectOne(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/encounters`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('State Management', () => {
    it('should get and set state correctly', () => {
      const newState: Partial<SearchState> = {
        pokemonName: 'bulbasaur',
        currentPage: 2,
      };

      service.setState(newState);
      const state = service.getState();

      expect(state.pokemonName).toBe('bulbasaur');
      expect(state.currentPage).toBe(2);
    });

    it('should clear the state', () => {
      service.setState({ pokemonName: 'charmander' });
      service.clearState();

      const state = service.getState();
      expect(state.pokemonName).toBe('');
      expect(state.encounters).toEqual([]);
      expect(state.currentPage).toBe(1);
      expect(state.totalPages).toBe(0);
    });
  });

  describe('getStateObservable', () => {
    it('should emit updated state on change', (done) => {
      const newState: Partial<SearchState> = { pokemonName: 'squirtle' };

      service.getStateObservable().subscribe((state) => {
        expect(state.pokemonName).toBe('squirtle');
        done();
      });

      service.setState(newState);
    });
  });
});
