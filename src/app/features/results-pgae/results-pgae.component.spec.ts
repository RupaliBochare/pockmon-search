import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ResultsPageComponent } from './results-pgae.component';
import { SearchStateService, Encounter } from '../core/services/search-state.service';

describe('ResultsPageComponent', () => {
  let component: ResultsPageComponent;
  let fixture: ComponentFixture<ResultsPageComponent>;
  let searchServiceSpy: jasmine.SpyObj<SearchStateService>;

  const mockEncounters: Encounter[] = Array.from({ length: 25 }, (_, i) => ({
    location_area: { name: `area-${i + 1}` },
    version_details: [{ version: { name: `version-${i + 1}` }, max_chance: i + 1 }],
  }));

  beforeEach(async () => {
    searchServiceSpy = jasmine.createSpyObj('SearchStateService', [
      'fetchEncounters',
      'getState',
      'setState',
    ]);

    await TestBed.configureTestingModule({
      imports: [ResultsPageComponent],
      providers: [
        { provide: SearchStateService, useValue: searchServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ name: 'pikachu', page: '2' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultsPageComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with query parameters and fetch encounters', () => {
    searchServiceSpy.fetchEncounters.and.returnValue(of(mockEncounters));
    //searchServiceSpy.getState.and.returnValue({ pokemonName: '', currentPage: 1 });

    fixture.detectChanges();

    expect(component.pokemonName).toBe('pikachu');
    expect(component.currentPage).toBe(2);
    expect(component.totalPages).toBe(3); // 25 items with limit 10 => 3 pages
    expect(component.paginatedEncounters.length).toBe(10);
    expect(searchServiceSpy.setState).toHaveBeenCalledWith({
      encounters: mockEncounters,
      totalPages: 3,
      currentPage: 2,
    });
  });

  it('should handle fetch error gracefully', () => {
    searchServiceSpy.fetchEncounters.and.returnValue(throwError(() => new Error('Fetch error')));

    fixture.detectChanges();

    expect(component.encounters.length).toBe(0);
    expect(component.paginatedEncounters.length).toBe(0);
    expect(searchServiceSpy.setState).toHaveBeenCalledWith({ encounters: [] });
  });

  it('should change the current page and update paginated data', () => {
    searchServiceSpy.fetchEncounters.and.returnValue(of(mockEncounters));
    fixture.detectChanges();

    component.changePage(3);
    expect(component.currentPage).toBe(3);
    expect(component.paginatedEncounters[0].location_area.name).toBe('area-21');
    expect(searchServiceSpy.setState).toHaveBeenCalledWith({ currentPage: 3 });
  });

  it('should set paginated encounters correctly for the first page', () => {
    searchServiceSpy.fetchEncounters.and.returnValue(of(mockEncounters));
    fixture.detectChanges();

    component.changePage(1);
    expect(component.paginatedEncounters[0].location_area.name).toBe('area-1');
    expect(component.paginatedEncounters.length).toBe(10);
  });

  it('should not set paginated data if encounters list is empty', () => {
    searchServiceSpy.fetchEncounters.and.returnValue(of([]));
    fixture.detectChanges();

    expect(component.paginatedEncounters.length).toBe(0);
    expect(component.totalPages).toBe(0);
  });
});
