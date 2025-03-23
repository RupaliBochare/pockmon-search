import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { SearchStateService } from '../core/services/search-state.service';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let searchServiceSpy: jasmine.SpyObj<SearchStateService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    searchServiceSpy = jasmine.createSpyObj('SearchStateService', ['fetchPokemonList', 'getState']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    searchServiceSpy.fetchPokemonList.and.returnValue(of({ results: [{ name: 'pikachu' }, { name: 'bulbasaur' }] }));

    await TestBed.configureTestingModule({
      imports: [SearchComponent, HttpClientTestingModule],
      providers: [
        { provide: SearchStateService, useValue: searchServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch Pokémon list if no previous search text', () => {
    expect(searchServiceSpy.fetchPokemonList).toHaveBeenCalled();
  });

  it('should update suggestions based on input', fakeAsync(() => {
    component.pokemonName = 'pika';
    component.onInputChange();
    tick(300);
    component.filterSuggestions();
    expect(component.suggestions).toContain('pikachu');
  }));

  it('should clear suggestions for empty input', fakeAsync(() => {
    component.pokemonName = '';
    component.onInputChange();
    tick(300);
    expect(component.suggestions.length).toBe(0);
  }));

  it('should navigate to results on suggestion click', () => {
    component.onSuggestionClick('pikachu');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/results'], { queryParams: { name: 'pikachu', page: 1 } });
  });

  it('should navigate to results on search click', () => {
    component.pokemonName = 'bulbasaur';
    component.onSearchClick();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/results'], { queryParams: { name: 'bulbasaur', page: 1 } });
  });
});
