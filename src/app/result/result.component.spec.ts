import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultComponent } from './result.component';

describe('ResultComponent', () => {
  let component: ResultComponent;
  let fixture: ComponentFixture<ResultComponent>;

  const mockEncounters = Array.from({ length: 25 }, (_, i) => ({
    location_area: { name: `area-${i + 1}` },
    version_details: [{ version: { name: `version-${i + 1}` }, max_chance: i + 1 }],
  }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update encounters and calculate total pages correctly', () => {
    component.encounters = mockEncounters;
    expect(component.encounterData()).toEqual(mockEncounters);
    expect(component.totalPages()).toBe(3); // 25 items with limit 10 => 3 pages
    expect(component.currentPage()).toBe(1);
  });

  it('should return correct paginated data for the first page', () => {
    component.encounters = mockEncounters;
    const paginatedData = component.paginatedEncounters();
    expect(paginatedData.length).toBe(10);
    expect(paginatedData[0].location_area.name).toBe('area-1');
  });

  it('should navigate to the next page', () => {
    component.encounters = mockEncounters;
    component.nextPage();
    expect(component.currentPage()).toBe(2);
  });

  it('should not exceed the total number of pages', () => {
    component.encounters = mockEncounters;
    component.currentPage.set(3);
    component.nextPage();
    expect(component.currentPage()).toBe(3);
  });

  it('should navigate to the previous page', () => {
    component.encounters = mockEncounters;
    component.currentPage.set(2);
    component.prevPage();
    expect(component.currentPage()).toBe(1);
  });

  it('should not go below page 1 when navigating backwards', () => {
    component.encounters = mockEncounters;
    component.prevPage();
    expect(component.currentPage()).toBe(1);
  });

  it('should return the correct paginated data after page change', () => {
    component.encounters = mockEncounters;
    component.currentPage.set(2);
    const paginatedData = component.paginatedEncounters();
    expect(paginatedData.length).toBe(10);
    expect(paginatedData[0].location_area.name).toBe('area-11');
  });
});
