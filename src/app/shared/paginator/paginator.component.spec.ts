import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginatorComponent } from './paginator.component';

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the previous page number when `goToPreviousPage` is called', () => {
    spyOn(component.pageChange, 'emit');
    component.currentPage = 2;
    component.goToPreviousPage();
    expect(component.pageChange.emit).toHaveBeenCalledWith(1);
  });

  it('should not emit if already on the first page when `goToPreviousPage` is called', () => {
    spyOn(component.pageChange, 'emit');
    component.currentPage = 1;
    component.goToPreviousPage();
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should emit the next page number when `goToNextPage` is called', () => {
    spyOn(component.pageChange, 'emit');
    component.currentPage = 1;
    component.totalPages = 3;
    component.goToNextPage();
    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });

  it('should not emit if already on the last page when `goToNextPage` is called', () => {
    spyOn(component.pageChange, 'emit');
    component.currentPage = 3;
    component.totalPages = 3;
    component.goToNextPage();
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });
});
